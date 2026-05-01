"use client";

import { usePathname } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { ToastProvider } from "@/components/ui/toast";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showHeader = pathname !== "/";

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        {showHeader ? <AppHeader /> : null}
        <main>{children}</main>
      </div>
    </ToastProvider>
  );
}

