import { useExchangeRateStore } from "@/store/exchangeRate";

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

export function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(amountNGN: number, currency = "NGN") {
  const rates = useExchangeRateStore.getState().rates;
  const rate = rates[currency] ?? 1;
  const converted = amountNGN * rate;

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(converted);

  const symbol = formatted.replace(/\d.*$/, ""); 
  const number = formatted.replace(symbol, "").trim(); 
  return `${symbol} ${number}`;
}
