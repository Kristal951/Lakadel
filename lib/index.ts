import { useExchangeRateStore } from "@/store/exchangeRate";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const countries = [
  { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "EU", name: "Eurozone", currency: "EUR", symbol: "€" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "$" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "$" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "$" },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "CHF" },
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R" },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$" },
];

/**
 * Basic NGN Formatter for internal use
 */
export function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Universal Price Formatter
 * @param amount - The base price (Assumed NGN)
 * @param currency - Target currency code (e.g. "USD")
 * @param rate - The multiplier to convert base to target
 */
export function formatPrice(amount: number, currency: string, rate: number) {
  const converted = Number(amount) * Number(rate);

  if (!Number.isFinite(converted)) return "—";

  // Determine decimal precision: JPY doesn't use decimals, NGN usually doesn't in e-commerce
  const isZeroDecimal = ["NGN", "JPY", "KRW"].includes(currency.toUpperCase());

  const nf = new Intl.NumberFormat("en-US", {
    // "en-US" ensures standard symbol placement
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
  });

  try {
    const parts = nf.formatToParts(converted);
    const symbol = parts.find((p) => p.type === "currency")?.value || "";
    const value = parts
      .filter((p) => p.type !== "currency")
      .map((p) => p.value)
      .join("")
      .trim();

    return `${symbol} ${value}`;
  } catch (e) {
    return `${currency} ${converted.toLocaleString()}`;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
