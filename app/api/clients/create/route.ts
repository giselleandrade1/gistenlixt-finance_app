import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { parseAuthToken } from "@/lib/auth-token";
import { getPublicUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const auth = parseAuthToken(token);
    const userId = auth?.id ?? getPublicUser().id;

    const body = await request.json();
    const {
      razao_social,
      cnpj,
      email,
      telefone,
      regime_tributario,
      anexo_simples,
      cidade,
      estado,
      faturamento_anual,
    } = body as {
      razao_social?: string;
      cnpj?: string;
      email?: string;
      telefone?: string;
      regime_tributario?: string;
      anexo_simples?: string;
      cidade?: string;
      estado?: string;
      faturamento_anual?: number | string;
    };

    if (!razao_social || !cnpj || !regime_tributario) {
      return NextResponse.json(
        { error: "Razão social, CNPJ e regime tributário são obrigatórios" },
        { status: 400 },
      );
    }

    const result = db
      .prepare(
        "INSERT INTO clients (user_id, razao_social, cnpj, email, telefone, regime_tributario, anexo_simples, cidade, estado, faturamento_anual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        userId,
        razao_social,
        cnpj,
        email || null,
        telefone || null,
        regime_tributario,
        anexo_simples || null,
        cidade || null,
        estado || null,
        faturamento_anual ? Number(faturamento_anual) : null,
      );

    return NextResponse.json({
      success: true,
      clientId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 },
    );
  }
}
