"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartStore";

export default function CartDebouncedSync() {
  const { status } = useSession();
  const items = useCartStore((s: any) => s.items);

  const timer = useRef<any>(null);
  const lastPayload = useRef<string>("");

  useEffect(() => {
    if (status !== "authenticated") return;

    const payload = JSON.stringify({
      items: (items ?? []).map((i: any) => ({
        productId: i.id,
        quantity: i.quantity,
        selectedColor: i.selectedColor ?? null,
        selectedSize: i.selectedSize ?? null,
      })),
    });

    if (payload === lastPayload.current) return;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      lastPayload.current = payload;
      await fetch("/api/users/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
    }, 600);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [items, status]);

  return null;
}
