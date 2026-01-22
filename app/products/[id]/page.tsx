"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoBagOutline } from "react-icons/io5";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params);

  const product = {
    id,
    name: "White Shirt",
    price: 30000,
    description: "Premium cotton shirt tailored for comfort and elegance.",
    images: ["/assets/IMG_3.jpg", "/assets/IMG_4.jpg", "/assets/IMG_5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Red", hex: "#B10E0E" },
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].hex);

  return (
    <section className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="flex flex-col gap-8">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((img) => (
            <div
              key={img}
              className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                selectedImage === img
                  ? "border-[var(--accent, #B10E0E)]"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {product.name}
          </h1>
          <p
            className="text-gray-600"
            style={{ color: "var(--foreground)", opacity: 0.7 }}
          >
            {product.description}
          </p>
        </div>

        <p
          className="text-xl font-medium"
          style={{ color: "var(--foreground)" }}
        >
          ₦{product.price.toLocaleString()}
        </p>

        <div className="flex flex-col gap-2">
          <p className="font-medium" style={{ color: "var(--foreground)" }}>
            Available Sizes:
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  className={`px-4 py-2 border cursor-pointer rounded-full transition font-medium ${
                    isSelected
                      ? "bg-(--accent,#B10E0E) text-white border-transparent"
                      : "bg-transparent border-foreground text-foreground hover:border-(--accent,#B10E0E)"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium" style={{ color: "var(--foreground)" }}>
            Available Colors:
          </p>
          <div className="flex gap-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color.hex;
              return (
                <button
                  key={color.hex}
                  className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${
                    isSelected
                      ? "border-(--accent,#B10E0E)"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.hex)}
                />
              );
            })}
          </div>
        </div>

        <button
          className="mt-6 py-3 flex cursor-pointer items-center justify-center gap-2 rounded-full text-white transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--accent, #B10E0E)",
          }}
          disabled={!selectedSize}
        >
          <IoBagOutline size="24"/>
          Add to Bag
        </button>
      </div>
    </section>
  );
}
