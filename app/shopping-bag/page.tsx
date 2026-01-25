"use client";

import { Trash2 } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import EmptyState from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { IoBagOutline } from "react-icons/io5";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ShoppingBag({ products }: { products: Product[] }) {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();

  const goToShop = () => router.push("/shop");

  const cartItems = items
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) return null;

      return {
        ...cartItem,
        product,
      };
    })
    .filter(Boolean) as {
    id: string;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    product: Product;
  }[];

  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.quantity * i.product.price,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <section className="max-w-8xl mx-auto py-10 px-6 md:px-10 flex items-center justify-center">
        <EmptyState
          text="Your cart is empty"
          Icon={IoBagOutline}
          retry={false}
          buttonText="Start shopping"
          onClick={goToShop}
        />
      </section>
    );
  }

  return (
    <section className="max-w-8xl mx-auto py-10 px-6 md:px-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-10">
        Your Shopping Bag
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="col-span-2 flex flex-col gap-6">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
              className="flex gap-6 p-4 rounded-xl border shadow"
            >
              <div className="relative w-40 aspect-square rounded-xl overflow-hidden">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{item.product.name}</h2>

                <div className="text-sm opacity-70 mt-1">
                  {item.selectedSize && <>Size: {item.selectedSize}</>}
                  {item.selectedColor && <> • Color: {item.selectedColor}</>}
                </div>

                <p className="text-xl font-semibold mt-2">
                  ₦{item.product.price.toLocaleString()}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1,
                        item.selectedColor,
                        item.selectedSize,
                      )
                    }
                    className="px-3 border rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1,
                        item.selectedColor,
                        item.selectedSize,
                      )
                    }
                    className="px-3 border rounded"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="text-red-500">
                    <CiHeart size={22} />
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.selectedColor,
                        item.selectedSize,
                      )
                    }
                    className="text-gray-500"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl border shadow h-max">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Shipping</span>
            <span>₦0</span>
          </div>

          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>

          <button className="mt-6 w-full py-3 rounded-lg bg-black text-white">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
