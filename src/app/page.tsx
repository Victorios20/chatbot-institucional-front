"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, SendHorizontal, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ChatRole = "user" | "bot";

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
};

const QUICK_PROMPTS = [
  "Como funciona a frequencia de 75%?",
  "Quantos creditos optativos eu preciso?",
  "Tenho duvida sobre financeiro.",
];

function buildReply(message: string): string {
  const text = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (text.includes("falta") || text.includes("frequencia")) {
    return "Para frequencia, posso te explicar as regras de 75% e 80%. Voce quer ver por disciplina de 72h?";
  }

  if (text.includes("credito") || text.includes("creditos") || text.includes("optativa")) {
    return "Sobre optativas: o objetivo e integralizar 12 creditos. Se quiser, eu te mostro um exemplo de planejamento.";
  }

  if (text.includes("financeiro") || text.includes("mensalidade") || text.includes("boleto")) {
    return "No financeiro, posso orientar em boleto, mensalidade e negociacao. Qual parte voce quer resolver agora?";
  }

  return "Posso te ajudar em 3 frentes: Academico, Financeiro e Secretaria. Qual delas voce quer agora?";
}

export default function Home() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "bot",
      text: "Ola! Eu sou o Chatbot Institucional Unifor. Me diga sua duvida e eu te ajudo agora.",
    },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    window.setTimeout(() => {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: buildReply(trimmed),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 550);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
    setInput("");
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <Card className="overflow-hidden border-border/80 bg-card/90 shadow-[0_20px_60px_rgba(2,16,60,0.18)] backdrop-blur-xl">
          <CardHeader className="border-b border-border/80 bg-muted/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg">Atendimento Inteligente</CardTitle>
                  <CardDescription>Chat demonstrativo do projeto institucional</CardDescription>
                </div>
              </div>

              <Badge variant="secondary" className="gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs">
                <Sparkles size={14} className="text-primary" />
                IA online para testes
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-0">
            <div className="border-b border-border/70 px-5 py-3">
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-[58vh] space-y-4 overflow-y-auto scrollbar-none px-5 py-5 md:px-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm md:max-w-[78%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-slate-200 bg-white text-slate-900"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  </div>
                </div>
              ) : null}

              <div ref={endRef} />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/80 bg-background/70 p-4 md:p-5">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Digite sua duvida academica, financeira ou institucional..."
                  className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button type="submit" className="h-11 rounded-xl px-4">
                  Enviar
                  <SendHorizontal size={16} />
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
