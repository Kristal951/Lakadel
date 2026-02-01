"use client";
import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";
import ProfileMenu from "../ui/ProfileMenu";
import useUserStore from "@/store/userStore";

const Header = () => {
  const router = useRouter();
  const { items } = useCartStore();
  const { query, setQuery } = useProductStore();
  const { user } = useUserStore();

  const [localQuery, setLocalQuery] = useState(query);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const goToBag = () => router.push("/shopping-bag");

  useEffect(() => {
    const timer = setTimeout(() => setQuery(localQuery), 300);
    return () => clearTimeout(timer);
  }, [localQuery, setQuery]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-18 flex items-center justify-between px-6 z-50 shadow-sm"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Link href="/shop" className="relative h-11 w-35 shrink-0">
        <Image
          src="/Lakadel2.png"
          alt="Lakadel logo"
          fill
          priority
          className="object-contain"
        />
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative flex items-center group">
          <IoSearchOutline className="absolute left-3 w-5 h-5 text-foreground/50 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-40 md:w-85 pl-10 pr-4 py-2 border border-foreground/20 rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all duration-300"
          />
        </div>

        <button
          onClick={goToBag}
          className="p-2 rounded-full relative cursor-pointer hover:bg-foreground/10 transition-colors"
          aria-label="View Cart"
        >
          {items.length > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-background bg-foreground rounded-full">
              {items.length}
            </span>
          )}
          <IoBagOutline className="w-6 h-6" />
        </button>

        <div className="relative" ref={menuRef}>
          {user?.image ? (
            <Image
              src={user.image}
              alt="Profile Image"
              width={32}
              height={32}
              className="rounded-full cursor-pointer hover:bg-foreground/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
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
    </nav>
  );
};

export default Header;
