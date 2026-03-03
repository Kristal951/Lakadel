"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useNotificationStore } from "@/store/notificationsStore";
import { AppNotification } from "@/store/types";

export default function SocketNotificationsClient() {
  const { data: session, status } = useSession();
  const push = useNotificationStore((s) => s.push);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const userId = (session?.user as any)?.id;
    if (!userId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });

    socket.on("connect", () => socket.emit("join", { userId }));
    socket.on("notification:new", (n) => {
      console.log("📩 realtime notification:", n);
      push(n);
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [status, session, push]);

  return null;
}
