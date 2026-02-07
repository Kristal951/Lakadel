"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/hooks/useToast";
import { CheckCircle2, Clock3, RefreshCw, XCircle, ArrowRight, ShoppingBag, Download, Copy, Check } from "lucide-react";

type OrderStatus = "PENDING" | "PAID" | "FAILED";
type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  currency: string;
  paymentRef?: string | null;
  paidAt?: string | null;
  paymentMethod?: "PAYSTACK" | "STRIPE" | null;
  subTotal?: number | null;
  shippingFee?: number | null;
};

const formatDateTime = (v?: string | null) => {
  if (!v) return "-";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const money = (currency?: string, n?: number | null) =>
  !currency || n === null || n === undefined ? "-" : `${currency} ${n.toLocaleString()}`;

const middleEllipsis = (str: string, head = 8, tail = 6) =>
  str.length <= head + tail + 3 ? str : `${str.slice(0, head)}...${str.slice(-tail)}`;

export default function SuccessClient() {
  const params = useSearchParams();
  const { showToast } = useToast();
  const { clearCart } = useCartStore();

  const orderId = useMemo(() => params.get("orderId") ?? "", [params]);
  const token = useMemo(() => params.get("t") ?? "", [params]);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const didToastRef = useRef(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError("Missing Order ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = token
        ? `/api/users/orders/${orderId}?t=${encodeURIComponent(token)}`
        : `/api/users/orders/${orderId}`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Order not found");

      const loaded = data.order as Order;
      setOrder(loaded);

      if (loaded.status === "PAID" && !didToastRef.current) {
        didToastRef.current = true;
        clearCart();
        showToast("Payment secured successfully", "success");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [orderId, token, clearCart, showToast]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (!orderId || order?.status !== "PENDING") return;
    const interval = setInterval(() => fetchOrder(), 5000);
    return () => clearInterval(interval);
  }, [orderId, order?.status, fetchOrder]);

  const status = order?.status ?? "PENDING";
  const isPaid = status === "PAID";
  const isFailed = status === "FAILED";

  // ✅ IMPORTANT: avoid dynamic Tailwind class strings (see fix #2 below)
  const theme = {
    PAID: { ring: "bg-emerald-500", badgeBg: "bg-emerald-500/10", badgeBorder: "border-emerald-500/20", badgeText: "text-emerald-600", label: "Paid", icon: <CheckCircle2 className="w-8 h-8" /> },
    FAILED: { ring: "bg-red-500",     badgeBg: "bg-red-500/10",     badgeBorder: "border-red-500/20",     badgeText: "text-red-600",     label: "Failed", icon: <XCircle className="w-8 h-8" /> },
    PENDING:{ ring: "bg-amber-500",   badgeBg: "bg-amber-500/10",   badgeBorder: "border-amber-500/20",   badgeText: "text-amber-600",   label: "Verifying", icon: <Clock3 className="w-8 h-8 animate-spin-slow" /> },
  }[status];

  if (loading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <RefreshCw className="w-10 h-10 animate-spin text-muted-foreground opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg relative group">
        <div className="relative bg-background border border-foreground/50 rounded-[2.5rem] overflow-hidden">
          <div className="relative p-8 pt-12 text-center flex flex-col items-center">
            <div className={`mb-6 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 text-white ${theme.ring}`}>
              {theme.icon}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {isPaid ? "Payment Successful!" : isFailed ? "Payment Declined" : "Verifying Payment..."}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground font-medium max-w-60">
              {isPaid ? "Your order is confirmed and currently being processed." : "Waiting for the payment network to update."}
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
                {theme.label}
              </span>

              {order?.paymentMethod && (
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-foreground/5 bg-foreground/5 text-muted-foreground">
                  {order.paymentMethod}
                </span>
              )}
            </div>
          </div>

          <div className="px-8 pb-10">
            <div className="bg-muted/30 dark:bg-white/5 rounded-4xl p-6 space-y-4">
              <Row label="Order Reference" value={order?.id} mono copy />
              <Row label="Transaction Date" value={formatDateTime(order?.paidAt)} />
              <div className="my-4 border-t border-dashed border-foreground/10 pt-4">
                <Row label="Total Amount" value={money(order?.currency, order?.total)} bold />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`/api/users/orders/${orderId}${token ? `?t=${token}` : ""}/receipt/`}
                className={`flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-sm transition-all ${
                  isPaid
                    ? "bg-background text-foreground border hover:scale-[1.02] hover:bg-foreground hover:text-background active:scale-95"
                    : "bg-muted text-muted-foreground pointer-events-none"
                }`}
              >
                <Download className="w-4 h-4" /> Download PDF Receipt
              </a>

              <div className="grid grid-cols-2 gap-3 mt-1">
                <Link href="/dashboard/orders" className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground text-sm font-bold transition-all">
                  <ShoppingBag className="w-4 h-4" /> Order History
                </Link>
                <Link href="/shop" className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground text-sm font-bold transition-all">
                  Shop <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, bold, copy }: { label: string; value?: string | number | null; mono?: boolean; bold?: boolean; copy?: boolean }) {
  const [copied, setCopied] = useState(false);
  const raw = value ? String(value) : "";

  const onCopy = async () => {
    if (!raw) return;
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center group/row">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`${mono ? "font-mono text-base" : "text-sm"} ${bold ? "font-black" : "font-semibold"} text-foreground/90`}>
          {raw ? (mono ? middleEllipsis(raw) : raw) : "-"}
        </span>
        {copy && raw && (
          <button onClick={onCopy} className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-opacity">
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
          </button>
        )}
      </div>
    </div>
  );
}
