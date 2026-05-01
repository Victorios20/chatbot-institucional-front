"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Instagram, Linkedin, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { SESSION_STORAGE_KEY } from "@/lib/session";

type LoginPayload = {
  registration: string;
  password: string;
};

type LoginSuccessResponse = {
  sessionId: string;
};

type LoginErrorResponse = {
  message?: string;
  code?: string;
  status?: number;
};

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/uniforcomunica/",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@UniversidadedeFortaleza",
    icon: Youtube,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/school/universidade-de-fortaleza/",
    icon: Linkedin,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const sessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (sessionId) {
      router.replace("/chat");
    }
  }, [router]);

  function getLoginErrorMessage(response: Response, data: LoginErrorResponse) {
    if (response.status === 401 || data.code === "INVALID_CREDENTIALS") {
      return "Matrícula ou senha inválidos.";
    }

    if (response.status === 503 || data.code === "LOGIN_SERVICE_UNAVAILABLE") {
      return "Não foi possível conectar ao serviço de login.";
    }

    return data.message || "Não foi possível realizar o login. Verifique seus dados e tente novamente.";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const payload: LoginPayload = {
      registration: matricula.trim(),
      password: senha,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as LoginSuccessResponse & LoginErrorResponse;

      if (!response.ok) {
        const message = getLoginErrorMessage(response, data);
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      if (!data.sessionId) {
        const message = "Não foi possível iniciar sua sessão. Tente novamente.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      window.sessionStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
      toast.success("Login realizado com sucesso");
      router.push("/chat");
    } catch {
      const message = "Não foi possível conectar ao serviço de login.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login-page min-h-screen overflow-hidden">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="login-hero relative flex min-h-[42vh] flex-col justify-between px-6 py-8 text-white sm:px-10 sm:py-10 lg:min-h-screen lg:px-14 lg:py-12">
          <div className="login-hero__image" />
          <div className="login-hero__overlay" />

          <div className="relative z-10 max-w-xl space-y-6">
            <div className="space-y-3">
              <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.32em] text-white/80">
                Portal institucional
              </p>
              <h1 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Seu acesso ao Chatbot Institucional da Unifor.
              </h1>
              <p className="max-w-lg text-sm leading-6 text-white/78 sm:text-base">
                Assistente institucional para esclarecimento de dúvidas acadêmicas e administrativas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-white/85">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/18"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>

            <p className="text-sm font-medium text-white/88 sm:text-base">
              Fundação Edson Queiroz | Universidade de Fortaleza
            </p>
          </div>
        </div>

        <div className="login-pattern relative flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="login-pattern__symbols" />

          <Card className="relative z-10 w-full max-w-[42rem] rounded-[2rem] border-white/70 bg-white/92 shadow-[0_35px_110px_rgba(3,40,120,0.2)] backdrop-blur-md">
            <CardHeader className="space-y-6 px-6 pb-0 pt-8 text-center sm:px-10 sm:pt-10">
              <Image
                src="/assets/unifor/unifor-logo-07.png"
                alt="Símbolo Unifor"
                width={220}
                height={138}
                className="mx-auto h-auto w-32 sm:w-36"
              />

              <div className="space-y-2">
                <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">
                  Acesse sua conta Unifor
                </CardTitle>
                <CardDescription className="mx-auto max-w-md text-base leading-7 text-slate-600">
                  Entre com sua matrícula e senha para acessar o chat institucional.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <label htmlFor="matricula" className="block text-lg font-semibold text-slate-950">
                    Matrícula
                  </label>
                  <Input
                    id="matricula"
                    required
                    value={matricula}
                    onChange={(event) => setMatricula(event.target.value)}
                    placeholder="Matrícula"
                    autoComplete="username"
                    className="h-14 rounded-xl border-slate-200 bg-white px-4 text-base shadow-none focus-visible:ring-2"
                  />
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="senha" className="block text-lg font-semibold text-slate-950">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="senha"
                      required
                      type={showPassword ? "text" : "password"}
                      value={senha}
                      onChange={(event) => setSenha(event.target.value)}
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      className="h-14 rounded-xl border-slate-200 bg-white px-4 pr-14 text-base shadow-none focus-visible:ring-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 inline-flex w-14 items-center justify-center text-primary transition hover:text-primary/80"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {errorMessage ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-xl bg-primary text-base font-semibold shadow-[0_16px_35px_rgba(4,76,244,0.28)] hover:bg-[var(--primary-hover)]"
                >
                  {isSubmitting ? "Entrando..." : "Acessar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
