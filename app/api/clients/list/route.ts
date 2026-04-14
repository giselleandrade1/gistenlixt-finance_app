import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { parseAuthToken } from "@/lib/auth-token";
import { getPublicUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const auth = parseAuthToken(token);
    const userId = auth?.id ?? getPublicUser().id;

    const clients = db
      .prepare(
        "SELECT id, razao_social, cnpj, email, telefone, regime_tributario, anexo_simples, cidade, estado, faturamento_anual, created_at, updated_at FROM clients WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(userId) as Array<{
      id: number;
      razao_social: string;
      cnpj: string;
      email?: string;
      telefone?: string;
      regime_tributario: string;
      anexo_simples?: string;
      cidade?: string;
      estado?: string;
      faturamento_anual?: number;
      created_at: string;
      updated_at: string;
    }>;

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao listar clientes" },
      { status: 500 },
    );
  }
}
