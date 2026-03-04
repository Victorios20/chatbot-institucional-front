"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function AppHeader() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <div className="rounded-xl border border-border/80 bg-white/95 p-2 shadow-sm">
            <Image
              src="/assets/unifor/unifor-logo-05.png"
              alt="Logo Unifor"
              width={170}
              height={52}
              priority
              className="h-8 w-auto md:h-9"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-foreground md:text-lg">
              Chatbot Institucional Unifor
            </p>
            <p className="truncate text-xs text-muted-foreground md:text-sm">Universidade de Fortaleza</p>
          </div>
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  );
}
