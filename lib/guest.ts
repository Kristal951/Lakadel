
import { v4 as uuidv4 } from "uuid";

const KEY = "lakadel_guest_id";

export function getGuestID(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${KEY}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

export function ensureGuestID(): string {
  const existing = getGuestID();
  if (existing) return existing;

  const id = uuidv4();
  document.cookie = `${KEY}=${encodeURIComponent(id)}; Path=/; Max-Age=${60 * 60 * 24 * 90}; SameSite=Lax`;
  return id;
}