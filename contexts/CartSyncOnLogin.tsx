"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartStore";

export default function CartSyncOnLogin() {
  const { status } = useSession();
  const didRun = useRef(false);

  const items = useCartStore((s: any) => s.items);
  const setItems = useCartStore((s: any) => s.setItems); 

  useEffect(() => {
    if (status !== "authenticated") {
      didRun.current = false;
      return;
    }
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      const payload = {
        items: (items ?? []).map((i: any) => ({
          productId: i.id,
          quantity: i.quantity,
          selectedColor: i.selectedColor ?? null,
          selectedSize: i.selectedSize ?? null,
        })),
      };

      const res = await fetch("/api/users/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.cart?.items) {
        setItems(
          data.cart.items.map((i: any) => ({
            id: i.productId,
            quantity: i.quantity,
            selectedColor: i.selectedColor ?? null,
            selectedSize: i.selectedSize ?? null,
          })),
        );
      }
    })();
  }, [status]);

  return null;
}
