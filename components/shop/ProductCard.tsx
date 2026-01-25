import useCartStore from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FiArrowUpLeft } from "react-icons/fi";
import { useToast } from "@/hooks/useToast";

export default function ProductCard({
  id,
  label,
  SRC,
  price,
  quantity = 1,
  selectedSize,
  selectedColor,
}: {
  id: string;
  label: string;
  SRC: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}) {
  const { addToCart } = useCartStore();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    const item = {
      id,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
    };
    addToCart(item);
    showToast("Item added to cart!", "success");
  };

  return (
    <div className="group relative cursor-pointer p-4 flex flex-col gap-3">
      <div className="relative w-full aspect-3/3 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={SRC}
          alt={label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute p-4 inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
          <div className="w-full h-max flex justify-end">
            <button className="p-1 rounded-full cursor-pointer hover:bg-[#f9fafb]/30">
              <CiHeart className="w-10 h-10 text-white" />
            </button>
          </div>
          <div className="w-full flex justify-between items-center">
            <Link
              href={`/products/${id}`}
              className="p-2 cursor-pointer gap-1 rounded-3xl text-sm bg-white/30 text-white flex"
            >
              <FiArrowUpLeft className="w-5 h-5" /> Products Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="p-2 cursor-pointer gap-1 rounded-3xl text-sm bg-white text-black flex"
            >
              <IoBagOutline className="w-5 h-5" /> Add to bag
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base text-foreground font-semibold tracking-wide">
          {label}
        </h3>
        <p className="text-base text-foreground/80">
          ${price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
