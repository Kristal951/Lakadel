"use client";
import { useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";

export default function EnsureGuestSession() {
  const { status } = useSession();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (status !== "unauthenticated") return;

    ran.current = true;
    signIn("guest", { redirect: false });
  }, [status]);

  return null;
}