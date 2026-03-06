"use client";
import { Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const money = (kobo: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    kobo / 100,
  );

const statusLabel = (s: string) => {
  switch (s) {
    case "PAID":
      return {
        text: "Paid",
        cls: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
      };
    case "PENDING":
      return {
        text: "Pending payment",
        cls: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
      };
    case "FAILED":
      return {
        text: "Payment failed",
        cls: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
      };
    case "SHIPPED":
      return {
        text: "Shipped",
        cls: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
      };
    case "DELIVERED":
      return {
        text: "Delivered",
        cls: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
      };
    default:
      return { text: s, cls: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20" };
  }
};

const OrderClient = ({ order, orderRef }: { order: any; orderRef: string }) => {
  const router = useRouter();
  const pill = statusLabel(order.status);
  const shippingAddress = order.shippingAddress;
  const name = order.customerName || shippingAddress.fullName;
  const [retrying, setRetrying] = useState(false);

  const handleRetryPayment = async () => {
    try {
      setRetrying(true);

      const res = await fetch("/api/users/paystack/initialise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to retry payment");
      }

      if (!data?.authorization_url) {
        throw new Error("Paystack did not return an authorization URL");
      }

      window.location.href = data.authorization_url;
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Unable to retry payment");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/50 hover:text-foreground transition-colors mb-12"
        >
          <IoArrowBackOutline className="text-base" />
          Back
        </button>
        <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Order <span className="font-mono">{orderRef}</span>
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${pill.cls}`}
                >
                  {pill.text}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70">
                <span>
                  Placed:{" "}
                  <span className="text-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </span>
                <span>
                  Payment Method:{" "}
                  <span className="text-foreground">
                    {order.paymentMethod ?? "—"}
                  </span>
                </span>
                <span>
                  Total:{" "}
                  <span className="text-foreground font-semibold">
                    {money(order.totalKobo)}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center justify-center rounded-2xl border border-foreground/10 bg-background px-4 py-2 text-sm font-semibold hover:bg-foreground/5 transition">
                Download invoice
              </button>
              <button className="inline-flex items-center justify-center rounded-2xl bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
                Contact support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Items</h2>
              <p className="text-sm text-foreground/60">
                {order.orderItems.length} item
                {order.orderItems.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="rounded-3xl border border-foreground/10 overflow-hidden">
              <ul className="divide-y divide-foreground/10">
                {order.orderItems.map((item: any) => {
                  const img = item.product.images?.[0] ?? "/placeholder.png";
                  const color =
                    typeof item.selectedColor === "string"
                      ? (() => {
                          try {
                            return JSON.parse(item.selectedColor);
                          } catch {
                            return null;
                          }
                        })()
                      : item.selectedColor;
                  console.log(item);
                  return (
                    <li
                      key={item.id}
                      className="p-5 md:p-6 hover:bg-foreground/3 transition"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-2xl bg-foreground/5 border border-foreground/10">
                          <Image
                            src={img}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">
                                {item.product.name}
                              </p>
                              <div className="mt-1 text-xs text-foreground/60 flex flex-wrap gap-2">
                                <span>Qty: {item.quantity}</span>
                                {item.selectedSize && (
                                  <span>• Size: {item.selectedSize}</span>
                                )}

                                {item.selectedColor && (
                                  <span>• Color: {color?.name ?? "N/A"}</span>
                                )}
                              </div>
                            </div>
                            <p className="font-mono text-sm font-semibold">
                              {money(
                                Math.round(item.unitPriceKobo * item.quantity),
                              )}
                            </p>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button className="rounded-xl border border-foreground/10 px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5 transition">
                              Buy again
                            </button>
                            <button className="rounded-xl border border-foreground/10 px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5 transition">
                              Cancel order
                            </button>
                            {["PENDING", "FAILED"].includes(order.status) && (
                              <button
                                onClick={handleRetryPayment}
                                className="rounded-xl bg-foreground px-4 py-2 text-background"
                              >
                                Retry Payment
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-foreground/10 bg-background p-6">
              <h3 className="font-bold">Order summary</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span className="text-foreground font-semibold">
                    {money(order.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span className="text-foreground font-semibold">
                    {money(order.shippingFee)}
                  </span>
                </div>
                <div className="h-px bg-foreground/10 my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="font-mono">{money(order.totalKobo)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-5">Delivery Details</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <User size={16} className="mt-1 text-foreground/60" />
                  <div className="gap-1 flex flex-col">
                    <p className="text-xs text-foreground/80 tracking-wider font-semibold">
                      Name:
                    </p>
                    <p className="font-medium">{name ?? "—"}</p>
                  </div>
                </div>

                {order.customerPhone && (
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="mt-1 text-foreground/60" />
                    <div className="gap-1 flex flex-col">
                      <p className="text-xs text-foreground/80 tracking-wider font-semibold">
                        Phone:
                      </p>
                      <p>{order.customerPhone}</p>
                    </div>
                  </div>
                )}

                {order.customerEmail && (
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="mt-1 text-foreground/60" />
                    <div className="gap-1 flex flex-col">
                      <p className="text-xs text-foreground/80 tracking-wider font-semibold">
                        Email:
                      </p>
                      <p>{order.customerEmail}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 text-foreground/60" />
                  <div className="gap-1 flex flex-col">
                    <p className="text-xs text-foreground/80 tracking-wider font-semibold">
                      Address:
                    </p>
                    <p className="leading-relaxed">
                      {shippingAddress.streetAddress} <br />
                      {shippingAddress.city}, {shippingAddress.state} <br />
                      {shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
              <p className="text-sm text-foreground/70">
                Need help? Keep your order reference handy:{" "}
                <span className="font-mono text-foreground">{orderRef}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderClient;
