"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";

const Header = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const goToBag = () => router.push("/shopping-bag");

  return (
    <div
      className="fixed top-0 left-0 right-0 h-18 flex items-center justify-between px-6 z-50"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Link href="/shop" className="relative h-11 w-35">
        <Image
          src="/Lakadel2.png"
          alt="Lakadel logo"
          fill
          priority
          className="object-contain"
        />
      </Link>

      <div className="flex items-center gap-4">
        <div ref={searchRef} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="
        absolute right-0 top-1/2 transform -translate-y-1/2
        w-64 md:w-80 px-4 py-2
        border border-foreground/30 placeholder:text-foreground/50
        rounded-full bg-background
        focus:outline-none focus:ring-2 focus:ring-foreground
        transition-all duration-300
        z-50
      "
          />

          <button
            className="
      p-2 rounded-full
      hover:bg-gray-200/50
      active:scale-95
      transition transform
      cursor-pointer
      z-50
    "
          >
            <IoSearchOutline className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <button
          onClick={goToBag}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
        >
          <IoBagOutline className="w-6 h-6" />
        </button>

        <button
          onClick={() => console.log("profile")}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
        >
          <CgProfile className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
