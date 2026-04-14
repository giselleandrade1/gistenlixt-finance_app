/**
 * ThemeToggle - Botão para alternar entre tema claro e escuro
 */

"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeOptional } from "@/app/providers/ThemeProvider";

export const ThemeToggle = () => {
  const themeContext = useThemeOptional();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita renderizar até estar montado para prevenir mismatch de hidratação
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg p-2 w-9 h-9 opacity-0"
        aria-label="Carregando tema..."
        disabled
      />
    );
  }

  if (!themeContext) {
    return (
      <button
        type="button"
        className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Tema indisponível"
        title="Tema indisponível"
        disabled
      >
        <Sun className="h-5 w-5 text-slate-400" />
      </button>
    );
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title={`Mudar para tema ${theme === "light" ? "escuro" : "claro"}`}
      aria-label={`Mudar para tema ${theme === "light" ? "escuro" : "claro"}`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      ) : (
        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      )}
    </button>
  );
};
