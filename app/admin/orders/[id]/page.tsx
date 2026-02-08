// app/admin/orders/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { StatusBadge } from "@/components/admin/DashboardWidgets";
import {
  ArrowLeft,
  Receipt,
  Calendar,
  User2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { authOptions } from "@/lib/authOptions";
import Image from "next/image";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatMoney(amount: number, currency = "NGN") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.id) redirect("/login");
  if (user.role !== "ADMIN") redirect("/shop");
}

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      total: true,
      totalKobo: true,
      currency: true,
      createdAt: true,
      paidAt: true,
      paymentRef: true,
      paymentMethod: true,
      subTotal: true,
      shippingFee: true,

      customerName: true,
      customerEmail: true,
      customerPhone: true,

      shippingAddress: true, 

      user: {
        select: {
          name: true,
          email: true,
        },
      },

      orderItems: {
        select: {
          id: true,
          quantity: true,
          unitPriceKobo: true,
          lineTotalKobo: true,
          selectedColor: true,
          selectedSize: true,
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              sku: true,
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const addr = order.shippingAddress as any | null;

  const customerName =
    order.customerName ?? order.user?.name ?? addr?.fullName ?? "Customer";

  const customerEmail =
    order.customerEmail ?? order.user?.email ?? addr?.email ?? "—";

  const customerPhone = order.customerPhone ?? addr?.phone ?? "—";

  const itemsTotal =
    order.orderItems?.reduce(
      (sum, it) => sum + koboToNaira(it.lineTotalKobo ?? 0),
      0,
    ) ?? 0;

  const computedTotal = itemsTotal + Number(order.shippingFee ?? 0);

  function koboToNaira(kobo: number) {
    return Number(kobo || 0);
  }

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <StatusBadge status={order.status} />
          </div>

          <p className="text-sm text-foreground/50">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/api/admin/orders/${order.id}/receipt`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95"
          >
            <Receipt className="h-4 w-4" />
            Download Receipt
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <section className="lg:col-span-2 rounded-[2rem] border border-foreground/10 bg-background overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/[0.02] flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40">
              Items Purchased
            </h2>

            <span className="text-xs font-semibold text-foreground/40">
              {order.orderItems.length} item(s)
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-foreground/5">
            {order.orderItems.map((item) => {
              const product = item.product;
              const unitPrice = koboToNaira(item.unitPriceKobo ?? 0);
              const lineTotal = koboToNaira(item.lineTotalKobo ?? 0);

              const image = product?.images?.[0] ?? "/placeholder.png"; // fallback image

              return (
                <div
                  key={item.id}
                  className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                  {/* LEFT: Image + Info */}
                  <div className="flex items-start gap-5">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/[0.03]">
                      <Image
                        src={image}
                        alt={product?.name ?? "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        {product?.name ?? "Product Deleted"}
                      </p>

                      <p className="text-sm text-foreground/40 font-mono">
                        {product?.sku
                          ? `SKU: ${product.sku}`
                          : "SKU unavailable"}
                      </p>

                      {/* Variants */}
                      <div className="flex flex-wrap gap-2 text-xs text-foreground/50 mt-4">
                        {item.selectedSize && (
                          <span className="rounded-full border border-foreground/10 px-2 py-1">
                            Size: {item.selectedSize}
                          </span>
                        )}

                        {item.selectedColor && (
                          <span className="rounded-full border border-foreground/10 px-2 py-1">
                            Color: {item.selectedColor}
                          </span>
                        )}

                        <span className="rounded-full border border-foreground/10 px-2 py-1">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Pricing */}
                  <div className="text-right space-y-1">
                    <p className="text-xs text-foreground/40">Unit Price</p>

                    <p className="text-sm font-mono font-semibold text-foreground">
                      {formatMoney(unitPrice, order.currency)}
                    </p>

                    <p className="text-xs text-foreground/40 mt-2">
                      Line Total
                    </p>

                    <p className="text-sm font-mono font-bold text-foreground">
                      {formatMoney(lineTotal, order.currency)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right column */}
        <aside className="space-y-6">
          {/* Summary */}
          <section className="rounded-[2rem] border border-foreground/10 bg-background overflow-hidden">
            <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/[0.02]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40">
                Summary
              </h2>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50">Payment Method</span>
                <span className="font-semibold text-foreground">
                  {order.paymentMethod ?? "—"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50">Payment Ref</span>
                <span className="font-mono font-semibold text-foreground">
                  {order.paymentRef ?? "—"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50 inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Paid At
                </span>
                <span className="font-semibold text-foreground">
                  {order.paidAt ? new Date(order.paidAt).toLocaleString() : "—"}
                </span>
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50">Items Total</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatMoney(itemsTotal, order.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50">Shipping Fee</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatMoney(Number(order.shippingFee ?? 0), order.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50">Computed Total</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatMoney(computedTotal, order.currency)}
                </span>
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground/60">
                  Total
                </span>
                <span className="text-lg font-mono font-extrabold text-foreground">
                  {formatMoney(order.total, order.currency)}
                </span>
              </div>

              <p className="text-xs text-foreground/40">
                (TotalKobo: {order.totalKobo.toLocaleString()})
              </p>
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-[2rem] border border-foreground/10 bg-background overflow-hidden">
            <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/[0.02]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40">
                Customer
              </h2>
            </div>

            <div className="p-8 space-y-3">
              <div className="flex items-start gap-3">
                <User2 className="h-5 w-5 text-foreground/40 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {customerName}
                  </p>
                </div>
              </div>

              <p className="flex items-center gap-2 text-sm text-foreground/70">
                <Mail className="h-4 w-4 text-foreground/40" />
                {customerEmail}
              </p>

              <p className="flex items-center gap-2 text-sm text-foreground/70">
                <Phone className="h-4 w-4 text-foreground/40" />
                {customerPhone ?? "—"}
              </p>

              {addr ? (
                <>
                  <div className="h-px bg-foreground/10" />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-foreground/40 mt-0.5" />
                    <div className="text-sm text-foreground/70">
                      <p className="font-semibold text-foreground">
                        Shipping Address
                      </p>
                      <p>{addr?.address1 ?? "—"}</p>
                      <p>{(addr?.city ?? "—") + ", " + (addr?.state ?? "—")}</p>
                      <p>{addr?.country ?? "—"}</p>
                      {addr?.landmark ? <p>Landmark: {addr.landmark}</p> : null}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
