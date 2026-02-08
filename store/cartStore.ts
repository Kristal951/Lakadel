import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState } from "./types";

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // ✅ add these
      loggingOut: false,
      hydrated: false,

      addToCart: (newItem) => {
        set((state) => {
          const exists = state.items.find(
            (i) =>
              i.id === newItem.id &&
              i.selectedColor === newItem.selectedColor &&
              i.selectedSize === newItem.selectedSize
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id &&
                i.selectedColor === newItem.selectedColor &&
                i.selectedSize === newItem.selectedSize
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (productId, color, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.id === productId &&
                i.selectedColor === color &&
                i.selectedSize === size
              )
          ),
        }));
      },

      updateQuantity: (productId, qty, color, size) => {
        set((state) => {
          if (qty < 1) {
            return {
              items: state.items.filter(
                (i) =>
                  !(
                    i.id === productId &&
                    i.selectedColor === color &&
                    i.selectedSize === size
                  )
              ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.id === productId &&
              i.selectedColor === color &&
              i.selectedSize === size
                ? { ...i, quantity: qty }
                : i
            ),
          };
        });
      },

      // ✅ clear also resets flags
      clearCart: () => set({ items: [], hydrated: false }),

      setItems: (items: any[]) => set({ items }),

      // ✅ now it will actually exist
      setLoggingOut: (v: boolean) => set({ loggingOut: v }),

      // ✅ use after fetching server cart on login
      setHydrated: (v: boolean) => set({ hydrated: v }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cart-storage",

      // ✅ only persist items (don’t persist loggingOut/hydrated)
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useCartStore;
