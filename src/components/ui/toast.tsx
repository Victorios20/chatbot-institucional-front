"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

type ToastMessage = {
  id: number;
  title: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  success: (title: string) => void;
  error: (title: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, variant: ToastVariant) => {
    const id = Date.now();

    setToasts((currentToasts) => [...currentToasts, { id, title, variant }]);
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (title: string) => showToast(title, "success"),
      error: (title: string) => showToast(title, "error"),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

function Toaster({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => {
        const Icon = toast.variant === "success" ? CheckCircle2 : XCircle;

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-[0_18px_45px_rgba(15,23,42,0.18)]",
              toast.variant === "success" ? "border-emerald-200 text-emerald-800" : "border-red-200 text-red-700"
            )}
          >
            <Icon size={18} />
            <span>{toast.title}</span>
          </div>
        );
      })}
    </div>
  );
}
