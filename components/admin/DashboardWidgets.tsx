import clsx from "clsx";
import type { ComponentType } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: string; // e.g. "+12%" or "vs last week"
  tone?: "emerald" | "indigo" | "amber" | "rose" | "slate";
  trendColor? : string;
};

const TONE = {
  emerald: {
    ring: "ring-emerald-500/10",
    chip: "bg-emerald-500/10 text-emerald-700",
    glow: "from-emerald-500/10 via-transparent to-transparent",
    trend: "bg-emerald-500/10 text-emerald-700 border-emerald-500/10",
  },
  indigo: {
    ring: "ring-indigo-500/10",
    chip: "bg-indigo-500/10 text-indigo-700",
    glow: "from-indigo-500/10 via-transparent to-transparent",
    trend: "bg-indigo-500/10 text-indigo-700 border-indigo-500/10",
  },
  amber: {
    ring: "ring-amber-500/10",
    chip: "bg-amber-500/10 text-amber-800",
    glow: "from-amber-500/10 via-transparent to-transparent",
    trend: "bg-amber-500/10 text-amber-800 border-amber-500/10",
  },
  rose: {
    ring: "ring-rose-500/10",
    chip: "bg-rose-500/10 text-rose-700",
    glow: "from-rose-500/10 via-transparent to-transparent",
    trend: "bg-rose-500/10 text-rose-700 border-rose-500/10",
  },
  slate: {
    ring: "ring-slate-500/10",
    chip: "bg-slate-500/10 text-slate-700",
    glow: "from-slate-500/10 via-transparent to-transparent",
    trend: "bg-slate-500/10 text-slate-700 border-slate-500/10",
  },
} as const;

export function StatCard({ title, value, icon: Icon, trend, trendColor = 'foreground'}: StatCardProps) {
  return (
   <div
  className={clsx(
    "group relative flex-1 overflow-hidden transition-all duration-300",
    "border-r border-foreground/10 last:border-r-0",
    "hover:bg-foreground/2"
  )}
>
  <div className="relative h-full p-8">
    <div className="flex items-start justify-between">
      <div className="space-y-5">
        
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/3 shadow-sm">
          <Icon className="h-5 w-5 text-foreground/70" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">
            {title}
          </p>
          <h3 className="text-4xl font-semibold tracking-tighter text-foreground">
            {value}
          </h3>
        </div>
      </div>

      {/* Trend pill */}
      {trend && (
        <div className={`flex items-center gap-1 rounded-full border border-${trendColor} bg-foreground/3 px-2.5 py-1 text-[10px] font-black text-foreground/60 transition-colors group-hover:border-foreground/20`}>
          <span className={`text-${trendColor}`}>{trend}</span>
          <svg
            className={`h-2.5 w-2.5 opacity-60 text-${trendColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      )}
    </div>

    {/* Mini bars */}
    {/* <div className="mt-8 flex h-8 items-end gap-1.5 opacity-20 transition-opacity group-hover:opacity-50">
      {[30, 60, 40, 80, 50, 90, 70].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-foreground rounded-full"
          style={{ height: `${h}%` }}
        />
      ))}
    </div> */}
  </div>
</div>

  );
}

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_STYLES: Record<
  OrderStatus,
  { pill: string; dot: string; label: string }
> = {
  PENDING: {
    pill: "bg-amber-500/10 text-amber-800 border-amber-500/15",
    dot: "bg-amber-500",
    label: "Pending",
  },
  PAID: {
    pill: "bg-emerald-500/10 text-emerald-700 border-emerald-500/15",
    dot: "bg-emerald-500",
    label: "Paid",
  },
  SHIPPED: {
    pill: "bg-blue-500/10 text-blue-700 border-blue-500/15",
    dot: "bg-blue-500",
    label: "Shipped",
  },
  DELIVERED: {
    pill: "bg-indigo-500/10 text-indigo-700 border-indigo-500/15",
    dot: "bg-indigo-500",
    label: "Delivered",
  },
  CANCELLED: {
    pill: "bg-rose-500/10 text-rose-700 border-rose-500/15",
    dot: "bg-rose-500",
    label: "Cancelled",
  },
};

export function StatusBadge({
  status,
  soft = true,
}: {
  status: string;
  soft?: boolean;
}) {
  const key = status?.toUpperCase() as OrderStatus;
  const s = STATUS_STYLES[key];

  const fallback = {
    pill: "bg-slate-500/10 text-slate-700 border-slate-500/15",
    dot: "bg-slate-500",
    label: status,
  };

  const final = s ?? fallback;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide",
        soft ? final.pill : "bg-foreground text-background border-foreground/30",
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={clsx(
            "absolute inline-flex h-full w-full rounded-full opacity-40",
            key === "PENDING" ? "animate-ping" : "animate-pulse",
            soft ? final.dot : "bg-background",
          )}
        />
        <span
          className={clsx(
            "relative inline-flex h-2 w-2 rounded-full",
            soft ? final.dot : "bg-background",
          )}
        />
      </span>

      <span className="leading-none">{final.label}</span>
    </span>
  );
}