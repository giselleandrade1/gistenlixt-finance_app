/**
 * LoginPanel - Componente isolado e reutilizável para autenticação de usuários
 *
 * Recursos:
 * - Validação de email com regex e mensagens em PT-BR
 * - Validação de senha com mínimo de 8 caracteres
 * - Estados de loading e feedback visual
 * - Integração com API /api/auth/login
 * - Suporte a "Esqueci minha senha"
 * - Acessibilidade completa (ARIA, foco, navegação por teclado)
 * - Design responsivo e consistente
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface LoginPanelProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({
  onSuccess,
  onError,
  redirectTo = "/dashboard",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Valida o formulário antes de submeter
   * Retorna true se válido, false caso contrário
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validação de email
    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "E-mail inválido";
    }

    // Validação de senha - mínimo 8 caracteres
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submete o formulário e autentica o usuário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setInfoMessage("");

    // Valida antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Erro ao fazer login";
        setGeneralError(errorMessage);
        onError?.(errorMessage);
        setLoading(false);
        return;
      }

      // Sucesso - redireciona
      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = "Erro ao conectar com o servidor";
      setGeneralError(errorMessage);
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  /**
   * Handler para "Esqueci minha senha"
   */
  const handleForgotPassword = () => {
    setGeneralError("");
    setInfoMessage(
      "A recuperação de senha ainda não está automatizada. Entre em contato com o administrador para redefinir sua senha.",
    );
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-3 text-center animate-fade-in delay-100">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white animate-bounce-in hover-scale hover:animate-glow-pulse">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">Bem-vindo(a)</h1>
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Entre com seu e-mail e senha para continuar
          </p>
        </div>

        {/* Erro geral */}
        {generalError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 animate-slide-down"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {infoMessage && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 animate-slide-down"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 animate-fade-in delay-200"
          noValidate
        >
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            error={errors.email}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            icon={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
            required
          />

          {/* Esqueci minha senha */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 focus:outline-none focus:underline dark:text-purple-400 dark:hover:text-purple-300 transition-fast hover-lift"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Botão de login */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
            variant="primary"
            className="card-enter"
          >
            Entrar na conta
          </Button>
        </form>

        {/* Link para cadastro */}
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-center text-sm dark:border-slate-700 dark:bg-slate-900/50 card-hover animate-fade-in delay-300">
          Não tem uma conta?{" "}
          <a
            href="/cadastro"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none transition-all hover-scale"
          >
            Criar conta grátis
          </a>
        </div>
      </div>
    </div>
  );
};
