// store/exchangeRateStore.ts
import { create } from "zustand";
import { RateStore } from "./types";

export const useExchangeRateStore = create<RateStore>((set) => ({
  rates: { NGN: 1, USD: 0.00067, EUR: 0.00062, GBP: 0.00053 },

  fetchRates: async () => {
    try {
      const res = await fetch("/api/exchange-rates");
      const data = await res.json();
      set({ rates: { NGN: 1, ...data } });
    } catch (err) {
      console.warn("Using fallback rates due to fetch failure", err);
    }
  },
}));
