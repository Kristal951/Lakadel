"use client";

import { ToastProvider } from "@/hooks/useToast";
import { SessionProvider } from "next-auth/react";
import SessionSync from "./SessionSync";
import StoreInitializer from "./StoreInitialiser";
import SyncCartOnLogin from "./CartSyncOnLogin";
import SocketNotificationsClient from "./SocketProvider";
import NotificationsBootstrap from "./SocketNotifications";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <StoreInitializer />
        <SessionSync />
        <SyncCartOnLogin />
        <SocketNotificationsClient />
        <NotificationsBootstrap />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
