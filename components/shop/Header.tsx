"use client";

import useProductStore from "@/store/productStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { CgProfile } from "react-icons/cg";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";
import ProfileMenu from "../ui/ProfileMenu";
import useCartStore from "@/store/cartStore";
import { useSession } from "next-auth/react";
import Spinner from "../ui/spinner";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notificationsStore";
import NotificationDropdown from "./NotificationsDropDown";

const Header = () => {
  const router = useRouter();

  const { items, isSyncing } = useCartStore();
  const { query, setQuery } = useProductStore();
  const { notifications, unreadCount } = useNotificationStore();

  const { data: session } = useSession();
  const user = session?.user as any;

  const [localQuery, setLocalQuery] = useState(query);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToBag = () => router.push("/shopping-bag");

  useEffect(() => {
    const timer = setTimeout(() => setQuery(localQuery), 300);
    return () => clearTimeout(timer);
  }, [localQuery, setQuery]);

  const cartCount = items.length;

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-18 flex items-center md:justify-between md:px-6 px-2 z-50 border-0 border-b border-gray-100"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Link href="/shop" className="relative h-11 md:w-35 w-10 shrink-0">
        <Image
          src="/Lakadel2.png"
          alt="Lakadel logo"
          fill
          priority
          className="object-contain"
        />
      </Link>

      <div className="flex items-center gap-2 w-[90%] md:w-max justify-between md:gap-4">
        <div className="relative ml-4 flex items-center group">
          <IoSearchOutline className="absolute left-3 w-5 h-5 text-foreground/50 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-52 md:w-85 pl-10 pr-4 py-2 border border-foreground/20 rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-1 border-l border-foreground/20 pl-4">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={`relative p-2 rounded-full transition-all ${
                notifOpen
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
              )}
            </button>

            {notifOpen && <NotificationDropdown setOpen={setNotifOpen} />}
          </div>
          <button
            onClick={goToBag}
            className="p-2 rounded-full relative cursor-pointer hover:bg-foreground/10 transition-colors"
            aria-label="View Cart"
            disabled={isSyncing}
          >
            {cartCount > 0 && !isSyncing && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-background bg-foreground rounded-full">
                {cartCount}
              </span>
            )}
            {isSyncing ? (
              <Spinner w="5" h="5" />
            ) : (
              <IoBagOutline className="w-6 h-6" />
            )}
          </button>

          <div className="relative" ref={menuRef}>
            {user?.image ? (
              <Image
                src={user.image}
                alt="Profile Image"
                width={32}
                height={32}
                className="rounded-full cursor-pointer hover:bg-foreground/10 transition-colors"
                onClick={() => setOpen((prev) => !prev)}
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
                className="p-2 rounded-full cursor-pointer hover:bg-foreground/10 transition-colors"
                aria-label="Profile Menu"
              >
                <CgProfile className="w-6 h-6" />
              </button>
            )}

            {open && (
              <div className="absolute right-0 mt-2">
                <ProfileMenu setOpen={setOpen} open={open} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
