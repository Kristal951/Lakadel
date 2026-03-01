import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore, CartItem, CartItemPayload } from "./types";
import {
  cartGet,
  cartAdd,
  cartUpdate,
  cartClear,
  fetchProduct,
} from "@/lib/cartApi";

const sameColor = (
  a?: CartItem["selectedColor"],
  b?: CartItem["selectedColor"],
) => (a?.hex ?? null) === (b?.hex ?? null);

const sameSize = (a?: string | null, b?: string | null) =>
  (a ?? null) === (b ?? null);

const toPayload = (item: Partial<CartItem>): CartItemPayload => ({
  productId: item.productId!,
  quantity: item.quantity ?? 1,
  selectedColor: item.selectedColor?.hex ?? null,
  selectedSize: item.selectedSize ?? null,
});

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,

      clearLocalCart: () => {
        set({ items: [] });
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart-storage");
        }
      },

      syncCart: async () => {
        set({ isSyncing: true });
        try {
          const { items: backendItems } = await cartGet();

          const fullItems: CartItem[] = await Promise.all(
            backendItems.map(async (payload) => {
              const res = await fetchProduct(payload.productId);
              const product =
                (res as any)?.product ?? (res as any)?.order ?? res;

              return {
                productId: payload.productId,
                quantity: payload.quantity,
                selectedColor: payload.selectedColor
                  ? { hex: payload.selectedColor, name: "" }
                  : undefined,
                selectedSize: payload.selectedSize ?? null,
                product,
              };
            }),
          );

          set({ items: fullItems });
        } catch (e) {
          console.error("Failed to sync cart:", e);
        } finally {
          set({ isSyncing: false });
        }
      },
      addToCart: async (item) => {
        if (!item.productId || (item.quantity ?? 1) <= 0) return;

        const prev = get().items;

        const existingIndex = prev.findIndex(
          (i) =>
            i.productId === item.productId &&
            sameSize(i.selectedSize, item.selectedSize) &&
            sameColor(i.selectedColor, item.selectedColor),
        );

        let next: CartItem[];
        if (existingIndex !== -1) {
          next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + (item.quantity ?? 1),
          };
        } else {
          next = [
            ...prev,
            { ...item, quantity: item.quantity ?? 1 } as CartItem,
          ];
        }

        set({ items: next });

        try {
          await cartAdd(toPayload(item));
        } catch (error) {
          set({ items: prev });
          throw error;
        }
      },

      removeFromCart: async (productId, selectedSize, selectedColorHex) => {
        const prev = get().items;

        const next = prev.filter(
          (i) =>
            !(
              i.productId === productId &&
              (i.selectedSize ?? null) === (selectedSize ?? null) &&
              (i.selectedColor?.hex ?? null) === (selectedColorHex ?? null)
            ),
        );

        set({ items: next });

        try {
          await cartUpdate({
            productId,
            selectedSize: selectedSize ?? null,
            selectedColor: selectedColorHex ?? null,
            quantity: 1,
            action: "remove",
          });
        } catch (error) {
          set({ items: prev });
          throw error;
        }
      },

      increaseQty: async (productId, selectedSize, selectedColorHex) => {
        const prev = get().items;

        const next = prev.map((i) => {
          const match =
            i.productId === productId &&
            (i.selectedSize ?? null) === (selectedSize ?? null) &&
            (i.selectedColor?.hex ?? null) === (selectedColorHex ?? null);

          if (!match) return i;

          const max = i.product?.totalStock ?? 99;
          return { ...i, quantity: Math.min(i.quantity + 1, max) };
        });

        set({ items: next });

        try {
          await cartUpdate({
            productId,
            selectedSize: selectedSize ?? null,
            selectedColor: selectedColorHex ?? null,
            quantity: 1,
            action: "increase",
          });
        } catch (error) {
          set({ items: prev });
          throw error;
        }
      },

      decreaseQty: async (productId, selectedSize, selectedColorHex) => {
        const prev = get().items;

        const next = prev
          .map((i) => {
            const match =
              i.productId === productId &&
              (i.selectedSize ?? null) === (selectedSize ?? null) &&
              (i.selectedColor?.hex ?? null) === (selectedColorHex ?? null);

            return match ? { ...i, quantity: i.quantity - 1 } : i;
          })
          .filter((i) => i.quantity > 0);

        set({ items: next });

        try {
          await cartUpdate({
            productId,
            selectedSize: selectedSize ?? null,
            selectedColor: selectedColorHex ?? null,
            quantity: 1,
            action: "decrease",
          });
        } catch (error) {
          set({ items: prev });
          throw error;
        }
      },

      clearCart: async () => {
        const prev = get().items;
        set({ items: [] });

        try {
          await cartClear();
        } catch (error) {
          set({ items: prev });
          throw error;
        }
      },
    }),
    { name: "cart-storage" },
  ),
);

export default useCartStore;
