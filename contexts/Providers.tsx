"use client";

import { ToastProvider } from "@/hooks/useToast";
import { SessionProvider } from "next-auth/react";
import SessionSync from "./SessionSync";
import CartSyncOnLogin from "./CartSyncOnLogin";
import CartDebouncedSync from "./CartDebouncedSync";
import StoreInitializer from "./StoreInitialiser";
import ClientInit from "./ClientInit";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <StoreInitializer />
        <ClientInit />
        <SessionSync />
        <CartSyncOnLogin />
        <CartDebouncedSync />

        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
