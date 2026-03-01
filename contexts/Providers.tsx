"use client";

import { ToastProvider } from "@/hooks/useToast";
import { SessionProvider } from "next-auth/react";
import SessionSync from "./SessionSync";
import StoreInitializer from "./StoreInitialiser";
import ClientInit from "./ClientInit";
import SyncCartOnLogin from "./CartSyncOnLogin";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <StoreInitializer />
        <ClientInit />
        <SessionSync />
        <SyncCartOnLogin/>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
