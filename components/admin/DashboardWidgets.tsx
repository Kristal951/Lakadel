import clsx from "clsx";

export function StatCard({ title, value, icon: Icon, trend }: any) {
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

export function StatusBadge({ status }: { status: string }) {
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
