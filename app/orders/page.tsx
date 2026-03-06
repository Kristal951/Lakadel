// app/orders/page.tsx
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Search, FileText, Calendar, Truck } from "lucide-react";
import { formatOrderNumber } from "@/lib/cartDB";
import { OrderStatus } from "@prisma/client";

const money = (kobo: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    kobo / 100,
  );

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "text-amber-600 bg-amber-50" },
  PAID: { label: "Confirmed", color: "text-emerald-600 bg-emerald-50" },
  SHIPPED: { label: "In Transit", color: "text-blue-600 bg-blue-50" },
  DELIVERED: { label: "Delivered", color: "text-muted-foreground bg-secondary" },
  FAILED: { label: "Declined", color: "text-red-600 bg-red-50" },
};

const TABS = [
  { label: "All Activity", value: "" },
  { label: "Processing", value: "PENDING" },
  { label: "Confirmed", value: "PAID" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
];

export default async function OrdersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ status?: string }> 
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { status } = await searchParams;
  const statusRaw = (status ?? "").toUpperCase();

const statusFilter: OrderStatus | undefined =
  (Object.values(OrderStatus) as string[]).includes(statusRaw)
    ? (statusRaw as OrderStatus)
    : undefined;

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { orderItems: { include: { product: true } } },
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-light tracking-tight italic">Orders</h1>
            <p className="text-muted-foreground text-sm font-medium">
              {orders.length} curated purchases {statusFilter && `• ${statusFilter.toLowerCase()}`}
            </p>
          </div>
          
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
            <input 
              type="text" 
              placeholder="Filter by ID..." 
              className="w-full pl-11 pr-4 py-3 bg-secondary/40 border border-transparent rounded-2xl text-sm focus:bg-secondary/60 focus:ring-2 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 mb-16 p-1.5 bg-secondary/20 rounded-2xl w-fit">
          {TABS.map((t) => {
            const isActive = t.value === statusFilter;
            return (
              <Link
                key={t.label}
                href={t.value ? `/orders?status=${t.value}` : "/orders"}
                className={`px-5 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                  isActive 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {orders.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed rounded-[3rem] border-border bg-secondary/5">
            <ShoppingBag className="text-muted-foreground/20 mb-4" size={40} />
            <p className="text-muted-foreground font-light italic">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-16">
            {orders.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.PENDING;
              
              return (
                <div key={order.id} className="grid lg:grid-cols-[1fr_320px] gap-10 items-start group">
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest font-bold text-muted-foreground/60 border-b border-border/40 pb-4">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> 
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <FileText size={14} /> 
                        REF: {order.id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-6">
                      {order.orderItems.map((item: any) => (
                        <div key={item.id} className="flex gap-6">
                          <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-secondary/50 shrink-0">
                            <Image 
                              src={item.product?.images?.[0] || "/placeholder.png"} 
                              alt="" 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-lg font-light tracking-tight">{item.product?.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                            <p className="text-sm font-semibold mt-2">{money(item.unitPriceKobo)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 space-y-8 shadow-sm transition-all group-hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total Paid</p>
                        <p className="text-3xl font-extralight tracking-tighter">{money(order.totalKobo)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 py-4 border-y border-border/40 text-xs text-muted-foreground font-medium">
                      <Truck size={16} />
                      <span>Estimated Arrival: 2–3 Days</span>
                    </div>

                    <Link
                      href={`/orders/${formatOrderNumber(order.orderNumber)}`}
                      className="flex items-center justify-between w-full p-4 bg-foreground text-background rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Track Order
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}