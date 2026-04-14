import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { parseAuthToken } from "@/lib/auth-token";
import { getPublicUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const auth = parseAuthToken(token);

    if (!auth) {
      return NextResponse.json({ user: getPublicUser(), guest: true });
    }

    const user = db
      .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
      .get(auth.id) as
      | { id: number; name: string; email: string; role: number }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 },
    );
  }
}
