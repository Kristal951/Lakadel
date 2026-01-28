import { create } from "zustand";
import { UserState } from "./types";

const countryCurrencyMap: Record<
  string,
  { code: string; symbol: string }
> = {
  NG: { code: "NGN", symbol: "₦" },
  US: { code: "USD", symbol: "$" },
  GB: { code: "GBP", symbol: "£" },
  EU: { code: "EUR", symbol: "€" },
  CA: { code: "CAD", symbol: "$" },
  AU: { code: "AUD", symbol: "$" },
  JP: { code: "JPY", symbol: "¥" },
  IN: { code: "INR", symbol: "₹" },
  SG: { code: "SGD", symbol: "$" },
  CH: { code: "CHF", symbol: "CHF" },
  ZA: { code: "ZAR", symbol: "R" },
  BR: { code: "BRL", symbol: "R$" },
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  currency: "USD",
  currencySymbol: "$",
  country: "",

  setUser: (user) => set({ user, isAuthenticated: true, loading: false }),
  setCurrency: (currency: string, symbol: string) =>
    set({ currency, currencySymbol: symbol }),

  logout: () =>
    set({ user: null, isAuthenticated: false, currency: "USD", currencySymbol: "$", country: "" }),

  setCountry: (countryCode: string) => {
    const curr = countryCurrencyMap[countryCode] || { code: "USD", symbol: "$" };
    set({
      country: countryCode,
      currency: curr.code,
      currencySymbol: curr.symbol,
    });
  },

  registerUser: async (data: any) => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Registration failed");

      set({
        user: result.user,
        isAuthenticated: true,
        loading: false,
      });

      return res;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return err;
    }
  },
}));

export default useUserStore;
