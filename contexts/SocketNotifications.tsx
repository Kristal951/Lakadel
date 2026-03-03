"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useNotificationStore } from "@/store/notificationsStore";

export default function NotificationsBootstrap() {
  const { status } = useSession();
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, fetchNotifications]);

  return null;
}