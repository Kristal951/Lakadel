"use client";

import { useNotificationStore } from "@/store/notificationsStore";
import { Bell, Check, ShoppingBag, Info } from "lucide-react";
import Link from "next/link";

interface NotificationDropdownProps {
  setOpen: (open: boolean) => void;
}

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
