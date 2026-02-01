"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSwitcherWrapper from "@/components/ui/ThemeSwitcherWrapper";
import { ToastProvider } from "@/hooks/useToast";
import { SessionProvider } from "next-auth/react";
import SessionSync from "./SessionSync";
import CartSyncOnLogin from "./CartSyncOnLogin";
import CartDebouncedSync from "./CartDebouncedSync";
import ExchangeRateBootstrap from "./ExchangeRateBootstrap";
import StoreInitializer from "./StoreInitialiser";
import ClientInit from "./ClientInit";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {/* <ThemeProvider> */}
          <StoreInitializer />
          <ClientInit/>
          <SessionSync />
          <CartSyncOnLogin />
          <CartDebouncedSync />

          {children}
        {/* </ThemeProvider> */}
      </ToastProvider>
    </SessionProvider>
  );
}
