/**
 * CadastroPanel - Componente isolado e reutilizável para registro de novos usuários
 *
 * Recursos:
 * - Validação de nome (mínimo 3 caracteres)
 * - Validação de email com regex e mensagens em PT-BR
 * - Validação avançada de senha (maiúscula, número, caractere especial)
 * - Validação de confirmação de senha
 * - Estados de loading e feedback visual claro
 * - Integração com API /api/auth/signup
 * - Acessibilidade completa (ARIA, foco, navegação por teclado)
 * - Design responsivo e consistente
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface CadastroPanelProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const CadastroPanel: React.FC<CadastroPanelProps> = ({
  onSuccess,
  onError,
  redirectTo = "/?success=cadastro",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Valida senha com regras avançadas
   * - Mínimo 8 caracteres
   * - Pelo menos uma letra maiúscula
   * - Pelo menos um número
   * - Pelo menos um caractere especial
   */
  const validatePassword = (pwd: string): string | undefined => {
    if (!pwd) {
      return "Senha é obrigatória";
    }
    if (pwd.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "A senha deve conter pelo menos uma letra maiúscula";
    }
    if (!/[0-9]/.test(pwd)) {
      return "A senha deve conter pelo menos um número";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return "A senha deve conter pelo menos um caractere especial (!@#$%^&*...)";
    }
    return undefined;
  };

  /**
   * Valida o formulário completo antes de submeter
   * Retorna true se válido, false caso contrário
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validação de nome
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (name.trim().length < 3) {
      newErrors.name = "O nome deve ter no mínimo 3 caracteres";
    }

    // Validação de email
    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "E-mail inválido";
    }

    // Validação de senha
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validação de confirmação de senha
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submete o formulário e cria novo usuário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    // Valida antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Erro ao criar conta";
        setGeneralError(errorMessage);
        onError?.(errorMessage);
        setLoading(false);
        return;
      }

      // Sucesso - exibe mensagem e redireciona
      setSuccessMessage("Conta criada com sucesso! Redirecionando...");
      onSuccess?.();

      setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    } catch (err) {
      const errorMessage = "Erro ao conectar com o servidor";
      setGeneralError(errorMessage);
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white">
              <User className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">Crie sua conta</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Preencha os campos abaixo para começar
          </p>
        </div>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Erro geral */}
        {generalError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            error={errors.name}
            icon={<User className="h-4 w-4" />}
            autoComplete="name"
            required
          />

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
            autoComplete="new-password"
            helperText="Mínimo 8 caracteres, uma maiúscula, um número e um caractere especial"
            required
          />

          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            icon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            required
          />

          {/* Botão de cadastro */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading || !!successMessage}
            variant="primary"
          >
            Criar conta
          </Button>
        </form>

        {/* Link para login */}
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-center text-sm dark:border-slate-700 dark:bg-slate-900/50">
          Já tem uma conta?{" "}
          <a
            href="/"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none transition-all"
          >
            Fazer login
          </a>
        </div>
      </div>
    </div>
  );
};
