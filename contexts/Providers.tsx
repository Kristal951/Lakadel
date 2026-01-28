// app/providers.tsx
"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSwitcherWrapper from "@/components/ui/ThemeSwitcherWrapper";
import { ToastProvider } from "@/hooks/useToast";
import { useExchangeRateStore } from "@/store/exchangeRate";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchRates = useExchangeRateStore((s) => s.fetchRates);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <ToastProvider>
      <ThemeProvider>
        {children}
        <ThemeSwitcherWrapper />
      </ThemeProvider>
    </ToastProvider>
  );
}
