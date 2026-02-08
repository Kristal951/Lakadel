"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartStore";

export default function CartDebouncedSync() {
  const { status } = useSession();

  const items = useCartStore((s: any) => s.items);
  const hydrated = useCartStore((s: any) => s.hydrated);
  const loggingOut = useCartStore((s: any) => s.loggingOut);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controller = useRef<AbortController | null>(null);

  const lastAck = useRef<string>("");

  const payload = useMemo(() => {
    const normalized = (items ?? [])
      .map((i: any) => ({
        productId: String(i.productId ?? i.id),
        quantity: Math.max(1, Math.floor(Number(i.quantity ?? 1))),
        selectedColor: i.selectedColor ?? null,
        selectedSize: i.selectedSize ?? null,
      }))
      .filter((i: any) => i.productId && i.quantity > 0)
      .sort((a: any, b: any) =>
        `${a.productId}|${a.selectedColor}|${a.selectedSize}`.localeCompare(
          `${b.productId}|${b.selectedColor}|${b.selectedSize}`,
        ),
      );

    return JSON.stringify({ items: normalized });
  }, [items]);

  useEffect(() => {
    if (status === "authenticated" && !loggingOut) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = null;

    controller.current?.abort();
    controller.current = null;

    lastAck.current = "";
  }, [status, loggingOut]);

  useEffect(() => {
    if (status !== "authenticated") return;

    if (loggingOut) return;

    if (!hydrated) return;

    if (payload === lastAck.current) return;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (loggingOut) return;

      controller.current?.abort();
      const ac = new AbortController();
      controller.current = ac;

      try {
        const res = await fetch("/api/users/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: payload,
          signal: ac.signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error("sync failed");
        lastAck.current = payload;
      } catch (e: any) {
        if (e?.name !== "AbortError") {
        }
      }
    }, 600);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [payload, status, hydrated, loggingOut]);

  return null;
}
