import { create } from "zustand";
import { Store } from "./types";

export const useNotificationStore = create<Store>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  hasFetched: false,
  loading: false,

  fetchNotifications: async () => {
    if (get().hasFetched) return;

    const res = await fetch("/api/users/notifications", {
      cache: "no-store",
    });

    if (!res.ok) return;

    const data = await res.json();

    set({
      notifications: data.items ?? [],
      unreadCount: data.unreadCount ?? 0,
      hasFetched: true,
    });
  },

  push: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + (n.read ? 0 : 1),
    })),

  markAllRead: async () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({
        ...n,
        read: true,
      })),
      unreadCount: 0,
    }));

    await fetch("/api/users/notifications/read-all", {
      method: "PATCH",
    });
  },
  markRead: async (id: string) => {
    await fetch(`/api/users/notifications/${id}`, {
      method: "PATCH",
    });

    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }));
  },

  clearAllNotification: async () => {
    set({loading: true})
    try {
      const res = await fetch("/api/users/notifications", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to clear notifications");
      }

      set({
        notifications: [],
        unreadCount: 0,
      });
    } catch (error) {
      console.error("Clear notifications error:", error);
    }finally{
       set({loading: false})
    }
  },
  reset: () =>
    set({
      notifications: [],
      unreadCount: 0,
      hasFetched: false,
    }),
}));
