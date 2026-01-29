import { create } from "zustand";
import { ExchangeRateState } from "./types";

export const useExchangeRateStore = create<ExchangeRateState>((set) => ({
  rates: {},
  loading: false,
  error: null,

  fetchRates: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users/exchange-rates");
      const data = await res.json();
      set({ rates: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  resetRates: () => set({ rates: {} }),
}));
