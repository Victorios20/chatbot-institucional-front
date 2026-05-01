"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ChatScreen } from "@/components/chat-screen";
import { SESSION_STORAGE_KEY } from "@/lib/session";

export default function ChatPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const sessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!sessionId) {
      router.replace("/");
      return;
    }

    setIsCheckingSession(false);
  }, [router]);

  if (isCheckingSession) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
        <p className="text-sm font-medium text-muted-foreground">Carregando...</p>
      </section>
    );
  }

  return <ChatScreen />;
}
