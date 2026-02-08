"use client";

import useUserStore from "@/store/userStore";
import { useExchangeRateStore } from "@/store/exchangeRate";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useCartStore from "@/store/cartStore";

interface ProfileMenuProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

export default function ProfileMenu({ setOpen, open }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout, user, currency, currencySymbol } = useUserStore();
  const { status } = useSession();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  const handleLogout = async () => {
    setOpen(false);

    const cartStore = useCartStore.getState();
    cartStore.setLoggingOut(true);
    await signOut({ redirect: false });

    cartStore.clearCart();
    useCartStore.persist.clearStorage();

    logout();
    router.push("/auth/login");
  };

  const handleLoginRedirect = () => {
    setOpen(false);
    router.push("/auth/login");
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-14 w-52 rounded-xl border border-foreground/20 bg-background shadow-lg py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-foreground/10 mb-1">
        {user ? (
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-foreground/50 truncate">
              {currencySymbol} {currency}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
              Account
            </p>
            <button
              onClick={handleLoginRedirect}
              className="w-full py-1.5 px-2 text-xs text-white bg-foreground rounded-md hover:bg-foreground/90 transition"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>

      <ul className="flex flex-col">
        <li>
          <Link
            href={user ? "/wishlist" : ""}
            className={`flex items-center px-4 py-2.5 text-sm font-medium hover:bg-foreground/5 transition ${
              !user ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <Heart className="w-5 h-5 mr-2" />
            Wishlist
          </Link>
        </li>

        <li>
          <Link
            href={user ? "/settings" : ""}
            className={`flex items-center px-4 py-2.5 text-sm font-medium hover:bg-foreground/5 transition ${
              !user ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <FiSettings className="w-5 h-5 mr-2" />
            Settings
          </Link>
        </li>

        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <FiLogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
