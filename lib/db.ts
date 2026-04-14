import Database from "better-sqlite3";
import path from "path";
import { hashSync } from "bcryptjs";

const dbPath = path.join(process.cwd(), "gastenlixt.db");
const db = new Database(dbPath);
const PUBLIC_USER_EMAIL = "public@gastenlixt.local";
const PUBLIC_USER_NAME = "Visitante";

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
export function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      razao_social TEXT NOT NULL,
      cnpj TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      regime_tributario TEXT NOT NULL,
      anexo_simples TEXT,
      cidade TEXT,
      estado TEXT,
      faturamento_anual REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (user_id, cnpj)
    )
  `);

  // Add role column to existing databases (safe if already exists)
  try {
    db.exec("ALTER TABLE users ADD COLUMN role INTEGER NOT NULL DEFAULT 0");
  } catch {
    // Column already exists
  }

  // Add user_id column to clients for existing databases
  try {
    db.exec("ALTER TABLE clients ADD COLUMN user_id INTEGER");
  } catch {
    // Column already exists
  }

  // Migrate legacy clients table (shared data) to per-user unique schema
  try {
    const clientsTable = db
      .prepare(
        "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'clients'",
      )
      .get() as { sql?: string } | undefined;

    const tableSql = clientsTable?.sql || "";
    const missingUserId = !tableSql.includes("user_id");
    const hasGlobalUniqueCnpj = tableSql.includes("cnpj TEXT NOT NULL UNIQUE");
    const hasPerUserUnique = tableSql.includes("UNIQUE (user_id, cnpj)");

    if (missingUserId || (hasGlobalUniqueCnpj && !hasPerUserUnique)) {
      db.exec("BEGIN TRANSACTION");

      db.exec(`
        CREATE TABLE IF NOT EXISTS clients_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          razao_social TEXT NOT NULL,
          cnpj TEXT NOT NULL,
          email TEXT,
          telefone TEXT,
          regime_tributario TEXT NOT NULL,
          anexo_simples TEXT,
          cidade TEXT,
          estado TEXT,
          faturamento_anual REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE (user_id, cnpj)
        )
      `);

      try {
        db.exec(`
          INSERT INTO clients_new (
            id,
            user_id,
            razao_social,
            cnpj,
            email,
            telefone,
            regime_tributario,
            anexo_simples,
            cidade,
            estado,
            faturamento_anual,
            created_at,
            updated_at
          )
          SELECT
            id,
            user_id,
            razao_social,
            cnpj,
            email,
            telefone,
            regime_tributario,
            anexo_simples,
            cidade,
            estado,
            faturamento_anual,
            created_at,
            updated_at
          FROM clients
          WHERE user_id IS NOT NULL
        `);
      } catch {
        // Legacy schema without user_id: nothing to migrate safely
      }

      db.exec("DROP TABLE IF EXISTS clients");
      db.exec("ALTER TABLE clients_new RENAME TO clients");
      db.exec("COMMIT");
    }
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // ignore
    }
    console.error("Error migrating clients table:", error);
  }

  // Create default admin user
  try {
    const adminExists = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get("admin@admin.com");

    if (!adminExists) {
      const hashedPassword = hashSync("admin123", 10);
      db.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ).run("admin", "admin@admin.com", hashedPassword, 1);
      console.log("Default admin user created: admin@admin.com");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }

  // Create a public shared user so anonymous visitors can use the system
  try {
    const publicPassword = hashSync("public-access", 10);
    const result = db
      .prepare(
        "INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      )
      .run(PUBLIC_USER_NAME, PUBLIC_USER_EMAIL, publicPassword, 1);

    if (result.changes > 0) {
      console.log("Default public user created: public access enabled");
    }
  } catch (error) {
    console.error("Error creating default public user:", error);
  }

  console.log("Database initialized successfully");
}

export function getPublicUser() {
  const user = db
    .prepare("SELECT id, name, email, role FROM users WHERE email = ?")
    .get(PUBLIC_USER_EMAIL) as
    | { id: number; name: string; email: string; role: number }
    | undefined;

  if (!user) {
    throw new Error("Public user not available");
  }

  return user;
}

// Initialize on first import
initializeDatabase();

export default db;
