/**
 * Página Dashboard - Interface moderna com visualização de dados
 * Requer autenticação, mostra estatísticas e informações do usuário
 */

"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Users, TrendingUp, Zap, LogOut } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { StatBox } from "@/app/components/ui/StatBox";
import { Button } from "@/app/components/ui/Button";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { method: "GET" });
        if (!response.ok) {
          setUser({ name: "Visitante", email: "" });
          return;
        }
        const data = await response.json();
        setUser({ name: data.user.name, email: data.user.email });
      } catch (error) {
        setUser({ name: "Visitante", email: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 transition-colors duration-500">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl dark:bg-purple-600 transition-opacity duration-700"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-pink-300 opacity-20 blur-3xl dark:bg-pink-600 transition-opacity duration-700"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 transition-all duration-300 animate-slide-down">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-slide-in-left delay-100">
            <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-2 text-white animate-bounce-in hover-scale">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">GistenLixt</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-slide-in-right delay-100">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hover-lift"
              title="Sair"
            >
              <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* Seção de Boas-vindas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Bom dia, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Aqui está um resumo do seu dashboard
          </p>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatBox
            label="Usuários Ativos"
            value="2.4K"
            change={12}
            trend="up"
            icon={<Users />}
            variant="default"
          />
          <StatBox
            label="Taxa de Crescimento"
            value="34%"
            change={8}
            trend="up"
            icon={<TrendingUp />}
            variant="accent"
          />
          <StatBox
            label="Conversões"
            value="892"
            change={5}
            trend="down"
            icon={<Zap />}
            variant="success"
          />
          <StatBox
            label="Receita"
            value="$12.5K"
            change={15}
            trend="up"
            icon={<BarChart3 />}
            variant="default"
          />
        </div>

        {/* Cards de Conteúdo */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12">
          {/* Card atividade */}
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:pb-0"
                >
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Novo usuário registrado
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      há {item} hora{item > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card recursos */}
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Recursos Disponíveis
            </h3>
            <div className="space-y-3">
              {[
                { name: "Análise em Tempo Real", icon: "📊" },
                { name: "Relatórios Customizados", icon: "📈" },
                { name: "Integração com APIs", icon: "🔗" },
                { name: "Suporte Premium", icon: "🎯" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {feature.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Card promocional */}
        <Card variant="gradient" className="text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Upgrade para Pro</h3>
            <p className="text-white/90">
              Desbloqueie recursos avançados e análises detalhadas
            </p>
            <Button variant="secondary" className="mx-auto">
              Saiba Mais
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
