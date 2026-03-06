"use client";

<<<<<<< HEAD
import { useMemo, useState } from "react";
import { useNotificationStore } from "@/store/notificationsStore";
import {
  Bell,
  Check,
  ShoppingBag,
  Info,
  Trash2,
  BellOff,
  X,
  Tag,
  CreditCard,
  BellDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { AppNotification } from "@/store/types";
import Link from "next/link";
import { NotificationType } from "@prisma/client";

type Tab = "ALL" | "UNREAD" | "ORDERS" | "PAYMENTS" | "PROMOTIONS" | "INFO";
=======
import { useNotificationStore } from "@/store/notificationsStore";
import { Bell, Check, ShoppingBag, Info } from "lucide-react";
import Link from "next/link";
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1

interface NotificationDropdownProps {
  setOpen: (open: boolean) => void;
}

<<<<<<< HEAD
export default function NotificationDropdown({
  setOpen,
}: NotificationDropdownProps) {
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const [tab, setTab] = useState<Tab>("ALL");

  const unreadCount = useMemo(
    () => notifications.filter((n: any) => !n.read).length,
    [notifications],
  );

  const filtered = useMemo(() => {
    const list = notifications as AppNotification[];

    if (tab === "ALL") return list;
    if (tab === "UNREAD") return list.filter((n) => n.read === false);

    const map: Partial<Record<Tab, NotificationType>> = {
      ORDERS: "ORDER",
      PAYMENTS: "PAYMENT",
      PROMOTIONS: "PROMOTION",
      INFO: "INFO",
    };

    const wanted = map[tab];
    if (!wanted) return list;

    return list.filter((n) => n.type === wanted);
  }, [notifications, tab]);

  const onClose = () => setOpen(false);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />

        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative ml-auto h-full w-full sm:w-105 bg-background border-l border-foreground/10 shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-foreground/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h1 className="text-lg font-semibold">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-foreground/5 transition"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
              <TabButton
                active={tab === "ALL"}
                onClick={() => setTab("ALL")}
                icon={<Bell className="w-4 h-4" />}
                label="All"
              />
              <TabButton
                active={tab === "UNREAD"}
                onClick={() => setTab("UNREAD")}
                icon={<BellDot className="w-4 h-4" />}
                label="Unread"
              />
              <TabButton
                active={tab === "ORDERS"}
                onClick={() => setTab("ORDERS")}
                icon={<ShoppingBag className="w-4 h-4" />}
                label="Orders"
              />
              <TabButton
                active={tab === "PAYMENTS"}
                onClick={() => setTab("PAYMENTS")}
                icon={<CreditCard className="w-4 h-4" />}
                label="Payments"
              />
              <TabButton
                active={tab === "PROMOTIONS"}
                onClick={() => setTab("PROMOTIONS")}
                icon={<Tag className="w-4 h-4" />}
                label="Promotions"
              />
              <TabButton
                active={tab === "INFO"}
                onClick={() => setTab("INFO")}
                icon={<Info className="w-4 h-4" />}
                label="Info"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-3">
                  <BellOff className="w-6 h-6 text-foreground/60" />
                </div>
                <p className="font-semibold">No notifications</p>
                <p className="text-sm text-foreground/60 mt-1">
                  You’ll see updates about your orders, payments and promos
                  here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-foreground/5">
                <AnimatePresence initial={false}>
                  {filtered.map((n: any) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={() => {
                        if (!n.read) markRead(n.id);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-foreground/10">
            <div className="flex gap-3">
              <button
                onClick={markAllRead}
                disabled={notifications.every((n: any) => n.read)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-foreground text-background font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Mark all
              </button>

              <button
                // onClick={clearAll}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-foreground/15 text-foreground hover:bg-foreground/5 transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-semibold transition ${
        active
          ? "bg-foreground text-background"
          : "bg-foreground/5 hover:bg-foreground/10 text-foreground"
      }`}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

import Image from "next/image";

const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: any;
  onRead: () => void;
}) => {
  const type = String(notification.type || "").toUpperCase();
  const isOrder = type === "ORDER";
  const isPayment = type === "PAYMENT";
  const isPromo = type === "PROMOTION";

  const Icon = isOrder ? ShoppingBag : isPayment ? CreditCard : isPromo ? Tag : Info;

  const badgeClass = isOrder
    ? "bg-purple-100 text-purple-600"
    : isPayment
      ? "bg-emerald-100 text-emerald-600"
      : isPromo
        ? "bg-rose-100 text-rose-600"
        : "bg-blue-100 text-blue-600";

  const orderThumbs: string[] =
    notification?.order?.orderItems
      ?.map((it: any) => it?.product?.images?.[0])
      .filter(Boolean)
      .slice(0, 3) ?? [];

  return (
    <Link href={notification.link || "#"} onClick={onRead}>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`group relative p-4 flex gap-4 cursor-pointer transition-all ${
          !notification.read ? "bg-foreground/5" : "hover:bg-foreground/3"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center ${badgeClass}`}
          >
            <Icon className="w-5 h-5" />
          </div>

          {orderThumbs.length > 0 && (
            <div className="mt-0.5 flex -space-x-2">
              {orderThumbs.map((src, idx) => (
                <div
                  key={src + idx}
                  className="relative w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-background bg-foreground/5"
                >
                  <Image
                    src={src}
                    alt="Order item"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-[13px] leading-snug truncate ${
                !notification.read
                  ? "font-bold text-foreground"
                  : "font-medium text-foreground/80"
              }`}
            >
              {notification.title}
            </p>

            {!notification.read && (
              <span className="mt-1.5 w-2 h-2 bg-foreground rounded-full ring-4 ring-foreground/10 shrink-0" />
            )}
          </div>

          <p className="text-xs text-foreground/60 mt-1 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <p className="text-[10px] font-medium text-foreground/45 mt-2">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
=======
const NotificationDropdown = ({ setOpen }: NotificationDropdownProps) => {
  const { notifications, markRead, markAllRead } = useNotificationStore();

  function timeAgo(input: string | Date) {
    const d = typeof input === "string" ? new Date(input) : input;
    const diff = Date.now() - d.getTime();
    const sec = Math.max(0, Math.floor(diff / 1000));

    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d`;
    return d.toLocaleDateString();
  }

  function isToday(date: Date) {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }
  return (
    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
      <div className="p-4 border-b border-foreground/5 flex items-center justify-between bg-foreground/2">
        <h3 className="font-semibold text-sm">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-75 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const created = new Date(notification.createdAt);
            const meta = isToday(created)
              ? timeAgo(created)
              : created.toLocaleDateString();

            return (
              <div
                key={notification.id}
                onClick={() => markRead(notification.id)}
                className={`p-4 flex gap-3 hover:bg-foreground/3 cursor-pointer transition-colors border-b border-foreground/5 last:border-0 ${
                  !notification.read ? "bg-foreground/1" : ""
                }`}
              >
                <div className="mt-1">
                  {notification.type === "order" ? (
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Info className="w-4 h-4 text-rose-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm leading-tight ${!notification.read ? "font-semibold" : "font-normal"}`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-xs text-foreground/60 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-foreground/45 shrink-0">
                    {meta}
                  </span>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-rose-500 rounded-full self-center" />
                )}
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center">
            <Bell className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-foreground/50">All caught up!</p>
          </div>
        )}
      </div>

      <Link
        href="/notifications"
        onClick={() => setOpen(false)}
        className="block p-3 text-center text-xs font-medium border-t border-foreground/5 hover:bg-foreground/3 transition-colors text-foreground/70"
      >
        View all notifications
      </Link>
    </div>
  );
};

export default NotificationDropdown;
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
