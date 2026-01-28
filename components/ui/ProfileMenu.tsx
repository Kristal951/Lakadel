"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { FiSettings, FiLogOut } from "react-icons/fi";
// import { signOut } from "next-auth/react"; // uncomment if using NextAuth

interface ProfileMenuProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

export default function ProfileMenu({ setOpen, open }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  const handleLogout = async () => {
    setOpen(false);
    // await signOut({ callbackUrl: "/login" });
    console.log("Handle Logout");
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-14 w-52 rounded-xl border border-foreground/20 bg-background shadow-lg py-2 z-100"
    >
      <div className="px-4 py-2 border-b border-foreground/10 mb-1">
        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
          Account
        </p>
      </div>

      <ul className="flex flex-col">
        <li>
          <Link
            href="/wishlist"
            className="flex items-center px-4 py-2.5 text-sm font-medium hover:bg-foreground/5 transition"
            onClick={() => setOpen(false)}
          >
            <Heart className="w-5 h-5 mr-2" />
            Wishlist
          </Link>
        </li>

        <li>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2.5 text-sm font-medium hover:bg-foreground/5 transition"
            onClick={() => setOpen(false)}
          >
            <FiSettings className="w-5 h-5 mr-2" />
            Settings
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
