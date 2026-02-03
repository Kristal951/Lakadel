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
import { Product } from "@/store/types";
import { useState } from "react";

export default function ProductCard({
  id,
  name,
  images,
  price,
  sizes,
  colors,
  description,
}: Product) {
  const { addToCart } = useCartStore();
  const { showToast } = useToast();
  const { currency } = useUserStore();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stops the image overlay from toggling when clicking button
    const selectedSize = sizes?.[0] ?? undefined;
    const selectedColor = colors?.[0]?.name ?? undefined;

    const item = { id, quantity: 1, selectedSize, selectedColor };
    addToCart(item);
    showToast("Item added to bag!", "success");
  };

  return (
    <div className="group relative flex flex-col gap-3 p-0 mb-6 md:mb-0 md:p-4 transition-all duration-300">
      {/* Image Wrapper */}
      <div 
        onClick={() => setShowOverlay((prev) => !prev)}
        className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
      >
        <Image
          src={images[0]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className={`
          absolute inset-0 p-4 bg-black/40 flex flex-col justify-between transition-opacity duration-300
          ${showOverlay ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}
        `}>
          <div className="flex justify-end">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <CiHeart className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          <div className="flex flex-row gap-2 items-center justify-between">
            <Link
              href={`/products/${id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-auto text-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg text-white text-[10px] md:text-xs font-bold border border-white/20 hover:bg-white/40 transition-all flex items-center justify-center gap-1"
            >
              <FiArrowUpLeft className="w-4 h-4" /> Details
            </Link>
            
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-white text-black text-[10px] md:text-xs font-bold hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-xl"
            >
              <IoBagOutline className="w-4 h-4" /> Add to bag
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-1 space-y-1">
        <h3 className="text-sm md:text-base font-serif font-bold text-foreground leading-tight line-clamp-1">
          {name}
        </h3>
        <p className="text-xs text-foreground/60 line-clamp-1">
          {description}
        </p>
        <div className="pt-1">
          <PriceContainer price={price} currency={currency} />
        </div>
      </div>
    </div>
  );
}