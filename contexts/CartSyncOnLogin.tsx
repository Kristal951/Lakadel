"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartStore";

type LocalCartItem = {
  productId: string;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
};

function normalizeQty(q: unknown) {
  const n = Number(q);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.floor(n));
}

function toLocalCartItems(raw: any[]): LocalCartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((i) => ({
      productId: String(i?.productId ?? i?.id ?? ""),
      quantity: normalizeQty(i?.quantity),
      selectedColor: i?.selectedColor ?? null,
      selectedSize: i?.selectedSize ?? null,
    }))
    .filter((i) => i.productId);
}

function fromServerCartItems(raw: any[]): LocalCartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((i) => ({
      productId: String(i?.productId ?? ""),
      quantity: normalizeQty(i?.quantity),
      selectedColor: i?.selectedColor ?? null,
      selectedSize: i?.selectedSize ?? null,
    }))
    .filter((i) => i.productId);
}

export default function CartSyncOnLogin() {
  const { status } = useSession();

  const items = useCartStore((s: any) => s.items);
  const setItems = useCartStore((s: any) => s.setItems);
  const setHydrated = useCartStore((s: any) => s.setHydrated);

  const itemsRef = useRef<LocalCartItem[]>([]);
  useEffect(() => {
    itemsRef.current = toLocalCartItems(items);
  }, [items]);

  const mergeKey = "lakadel_cart_merge_done_v1";

  useEffect(() => {
    if (status === "authenticated") return;
    sessionStorage.removeItem(mergeKey);
    itemsRef.current = [];
    setHydrated(false);
  }, [status, setHydrated]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const controller = new AbortController();

    (async () => {
      try {
        const localSnapshot = itemsRef.current;
        const hasLocal = localSnapshot.length > 0;
        const alreadyMerged = sessionStorage.getItem(mergeKey) === "1";

        if (!hasLocal || alreadyMerged) {
          const res = await fetch("/api/users/cart/fetch", {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          });

          const data = await res.json().catch(() => ({}));
          const serverItems = fromServerCartItems(data?.cart?.items ?? []);

          setItems(serverItems);
          setHydrated(true);
          return;
        }

        sessionStorage.setItem(mergeKey, "1");

        const mergePayload = {
          mode: "REPLACE",
          items: localSnapshot.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            selectedColor: i.selectedColor ?? null,
            selectedSize: i.selectedSize ?? null,
          })),
        };

        const mergeRes = await fetch("/api/users/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mergePayload),
          signal: controller.signal,
          cache: "no-store",
        });

        const mergeData = await mergeRes.json().catch(() => ({}));
        const mergedItems = fromServerCartItems(mergeData?.cart?.items ?? []);

        setItems(mergedItems);
        setHydrated(true);
      } catch (e: any) {
        sessionStorage.removeItem(mergeKey);
        console.error("[CartSyncOnLogin]", e);
      }
    })();

    return () => controller.abort();
  }, [status, setItems, setHydrated]);

  return null;
}
