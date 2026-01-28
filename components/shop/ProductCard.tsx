"use client";
import useCartStore from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FiArrowUpLeft } from "react-icons/fi";
import { useToast } from "@/hooks/useToast";
import useUserStore from "@/store/userStore";
import PriceContainer from "./PriceContainer";
import { useState } from "react";

export default function ProductCard({
  id,
  label,
  SRC,
  price,
  quantity = 1,
  selectedSize,
  selectedColor,
  description,
}: {
  id: string;
  label: string;
  SRC: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  description: string;
}) {
  const { addToCart } = useCartStore();
  const { showToast } = useToast();
  const { currency } = useUserStore();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item = {
      id,
      quantity,
      selectedSize,
      selectedColor,
    };
    addToCart(item);
    showToast("Item added to cart!", "success");
  };

  return (
    <div className="group relative flex flex-col gap-3 w-full max-w-sm mx-auto pb-6">
      <div
        onClick={() => setShowDetails((prev) => !prev)}
        className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 touch-manipulation"
      >
        <Image
          src={SRC}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex flex-col justify-between p-4
            ${showDetails ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}
          `}
        >
          <div className="w-full flex justify-end">
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <CiHeart className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </button>
          </div>

          <div className="w-full flex justify-between items-center">
            <Link
              href={`/products/${id}`}
              className="px-3 py-2 rounded-full text-xs sm:text-sm bg-white/20 text-white flex items-center gap-2 justify-center"
            >
              <FiArrowUpLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Product details
            </Link>

            <button
              onClick={handleAddToCart}
              className="px-3 py-2 rounded-full text-xs sm:text-sm bg-white text-black flex items-center gap-2 justify-center"
            >
              <IoBagOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              Add to bag
            </button>
          </div>
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col gap-1 mt-1">
        <h3 className="text-lg md:text-xl text-foreground font-bold tracking-tight truncate">
          {label}
        </h3>
        <p className="text-sm md:text-base text-foreground/60 line-clamp-1">
          {description}
        </p>
        <div className="mt-1">
          <PriceContainer price={price} currency={currency} />
        </div>
      </div>
    </div>
  );
}
