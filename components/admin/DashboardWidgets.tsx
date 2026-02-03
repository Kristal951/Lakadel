import clsx from "clsx";
import type { ComponentType } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: string; // e.g. "+12%" or "vs last week"
  tone?: "emerald" | "indigo" | "amber" | "rose" | "slate";
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

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  tone = "slate",
}: StatCardProps) {
  const t = TONE[tone];

interface StatCardProps {
  title: string;
  value: string;
  icon: any; // Or LucideIcon if you've imported it
  trend: string;
  iconColor: string; // Add this line
  iconBGColor: string; // Add this line
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor,
  iconBGColor,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-foreground/10 bg-background",
        "shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        "ring-1",
        t.ring,
      )}
    >
      {/* soft glow */}
      <div
        className={clsx(
          "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br blur-2xl",
          t.glow,
        )}
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "grid h-11 w-11 place-items-center rounded-2xl",
                "ring-1 ring-foreground/10",
                t.chip,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                {title}
              </p>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                {value}
              </h3>
            </div>
          </div>

          {trend ? (
            <span
              className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                t.trend,
              )}
            >
              {/* tiny arrow */}
              <span className="text-[10px] leading-none">↗</span>
              {trend}
            </span>
          ) : null}
        </div>

        {/* subtle divider */}
        <div className="mt-5 h-px w-full bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" />

        <p className="mt-4 text-sm font-medium text-foreground/60">
          Updated just now
        </p>
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