/**
 * Página de Login - Utiliza o componente LoginPanel isolado
 * Responsável por exibir avisos de query params (unauthorized, success)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoginPanel } from "./components/LoginPanel";
import { AuthFooter } from "./components/AuthFooter";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"info" | "success">("info");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("unauthorized") === "1") {
      setNotice("Acesso restrito para administradores.");
      setNoticeType("info");
      return;
    }
    if (params.get("success") === "cadastro") {
      setNotice("Cadastro realizado com sucesso. Faça login.");
      setNoticeType("success");
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 transition-colors duration-500">
      {/* Efeito de fundo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl dark:bg-purple-600 transition-opacity duration-700"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-pink-300 opacity-20 blur-3xl dark:bg-pink-600 transition-opacity duration-700"></div>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 font-sans">
        <div className="w-full max-w-md animate-scale-in">
          {/* Card principal */}
          <div className="rounded-3xl border border-white/30 bg-white/80 backdrop-blur-xl p-8 shadow-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-2xl dark:shadow-purple-500/10 card-hover transition-smooth">
            <div className="space-y-6">
              <div className="rounded-2xl border border-purple-200 bg-purple-50 px-4 py-4 text-sm text-purple-900 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-100">
                <p className="font-semibold">Acesso livre ao GistenLixt</p>
                <p className="mt-1 text-purple-800 dark:text-purple-200">
                  Você pode entrar no sistema sem login. O login fica disponível
                  apenas se quiser usar uma conta.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 transition-colors"
                >
                  Acessar GistenLixt agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Aviso de query params */}
              {notice && (
                <div
                  role="alert"
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-medium animate-slide-up ${
                    noticeType === "success"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {noticeType === "success" ? (
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  )}
                  <span>{notice}</span>
                </div>
              )}

              {/* LoginPanel */}
              <LoginPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Theme Toggle Footer */}
      <AuthFooter />
    </div>
  );
}
