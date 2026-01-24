"use client";
import { Trash2 } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
};

export default function ShoppingBag() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "White Cotton Shirt",
      price: 30000,
      quantity: 1,
      size: "XL",
      color: "White",
      image: "/assets/IMG_3.jpg",
    },
    {
      id: "2",
      name: "Black Trousers",
      price: 45000,
      quantity: 2,
      size: "M",
      color: "Black",
      image: "/assets/IMG_4.jpg",
    },
  ]);

  // Remove item
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <section className="max-w-8xl mx-auto py-10 px-6 md:px-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-foreground">
        Your Shopping Bag
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-xl text-gray-500">Your shopping bag is empty.</p>
      ) : (
        <div className="w-full grid md:grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center gap-8 p-4 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="relative w-full md:w-100 aspect-square rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2 w-full">
                  <h2 className="font-semibold text-2xl text-foreground">
                    {item.name}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-foreground/70">
                    <p>
                      <span className="font-medium">Size:</span> {item.size}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {item.color}
                    </p>
                  </div>

                  <p className="text-xl font-semibold mt-2 text-foreground">
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-4 py-1 border rounded-md cursor-pointer hover:bg-[var(--foreground)/10] transition"
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-4 py-1 border rounded-md cursor-pointer hover:bg-[var(--foreground)/10] transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => console.log("favorite", item.id)}
                      className="p-2 rounded-full hover:bg-foreground/30  cursor-pointer transition text-red-500"
                    >
                      <CiHeart className="w-6 h-6" />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-full hover:bg-foreground/30 cursor-pointer transition text-gray-500"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 p-6 rounded-xl shadow-lg border border-gray-100 h-max">
            <h2 className="text-2xl font-semibold text-foreground">
              Order Summary
            </h2>
            <div className="flex justify-between text-lg text-foreground/70">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg text-foreground/70">
              <span>Shipping</span>
              <span>₦0</span>
            </div>
            <div className="flex justify-between font-semibold text-xl mt-2 text-foreground)">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button className="mt-6 w-full py-3 cursor-pointer bg-(--accent,#B10E0E) text-white font-semibold rounded-lg hover:bg-[#a30c0c] transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
