// app/admin/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import clsx from "clsx";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    recentOrders,
    ordersToday,
    pendingOrders,
    customersCount,
    revenueTodayAgg,
  ] = await Promise.all([
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: { select: { quantity: true } },
      },
    }),

    prisma.order.count({
      where: { createdAt: { gte: startOfDay } },
    }),

    prisma.order.count({
      where: { status: "PENDING" },
    }),

    prisma.user.count({
      where: { isGuest: false },
    }),

    prisma.order.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: startOfDay },
      },
      _sum: { total: true },
    }),
  ]);

  const revenueToday = Number(revenueTodayAgg._sum.total ?? 0);

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-foreground/70 ">
            Welcome back. Here is what is happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground/95 text-background rounded-xl hover:bg-foreground transition shadow-lg text-sm font-semibold"
          >
            Manage Orders
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Revenue Today"
          value={`₦${revenueToday.toLocaleString()}`}
          icon={CreditCard}
          trend="Today"
        />
        <StatCard
          title="Orders Today"
          value={ordersToday.toString()}
          icon={ShoppingBag}
          trend="Today"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          icon={Clock}
          trend="Needs attention"
        />
        <StatCard
          title="Customers"
          value={customersCount.toString()}
          icon={Users}
          trend="Total"
        />
      </div>

      {/* Recent Orders Section */}
      <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-bold text-foreground">
              Recent Transactions
            </h2>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-foreground/70 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-foreground/70 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-foreground/70 uppercase tracking-wider text-center">
                  Qty
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-foreground/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-foreground/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-foreground/70 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((o: any) => {
                const itemsCount = o.orderItems.reduce(
                  (sum, it) => sum + it.quantity,
                  0,
                );

                return (
                  <tr
                    key={o.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-foreground bg-background border border-foreground/20 px-2 py-1 rounded-md uppercase">
                        #{o.id.slice(-6)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                          {(o.customerEmail ?? "NA")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {o.customerEmail ?? "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-foreground">
                      {itemsCount}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-foreground">
                        {Number(o.total).toLocaleString(undefined, {
                          style: "currency",
                          currency: o.currency || "NGN",
                          maximumFractionDigits:
                            (o.currency || "NGN") === "NGN" ? 0 : 2,
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {recentOrders.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic text-sm">
              No recent transactions found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-background p-6 rounded-3xl border border-foreground/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground/70">{title}</p>
      <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-100",
    SHIPPED: "bg-blue-50 text-blue-700 border-blue-100",
    DELIVERED: "bg-indigo-50 text-indigo-700 border-indigo-100",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          status === "PAID" ? "bg-emerald-500" : "bg-current",
        )}
      />
      {status}
    </span>
  );
}
