"use client";

import Image from "next/image";
import { useEffect, useState, use } from "react"; // Added use here
import { IoBagOutline } from "react-icons/io5";
import useProductStore from "@/store/productStore";
import Spinner from "@/components/ui/spinner";
import EmptyState from "@/components/ui/EmptyState";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/hooks/useToast";
import PriceContainer from "@/components/shop/PriceContainer";
import useUserStore from "@/store/userStore";
import { CartItem } from "@/store/types";

type ProductPageProps = {
  params: Promise<{ id: string }>; 
};

export default function ProductPage({ params }: ProductPageProps) {
  // 1. Unwrap the params immediately using React 'use'
  const { id } = use(params);

  const { fetchProducts, getProductById, loading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>("");
  const [selectedColor, setSelectedColor] = useState<string | null>("");
  const { currency } = useUserStore();

  const handleAddToCart = () => {
    if (!product) return;
    const item: CartItem = {
      id: product.id,
      quantity: 1,
      selectedSize,
      selectedColor,
    };
    addToCart(item);
    showToast("Item added to cart!", "success");
  };

  // 2. Simplified logic: Fetch product whenever 'id' changes
  useEffect(() => {
    if (!id) return;

    const p = getProductById(id);
    if (p) {
      setProduct(p);
    } else {
      fetchProducts().then(() => {
        const fetched = getProductById(id);
        if (fetched) setProduct(fetched);
      });
    }
  }, [id, fetchProducts, getProductById]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || null);
      setSelectedColor(product.colors?.[0]?.name || null);
    }
  }, [product]);

  if (loading || !product)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner w="10" h="10" />
      </div>
    );

  if (error) return <EmptyState text={error} />;

  return (
    <section className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ... rest of your JSX remains the same ... */}
      <div className="flex flex-col gap-8">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
        {/* Gallery Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img: string) => (
              <div
                key={img}
                className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                  selectedImage === img
                    ? "border-(--accent,#B10E0E)"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="opacity-70">{product.description}</p>
        </div>

        <PriceContainer price={product.price} currency={currency} textSize="xl" />

        {product.sizes?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-medium">Available Sizes:</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border transition font-medium ${
                    selectedSize === size
                      ? "bg-(--accent,#B10E0E) text-white border-transparent"
                      : "border-foreground text-foreground hover:border-(--accent,#B10E0E)"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-medium">Available Colors:</p>
            <div className="flex gap-2">
              {product.colors.map((color: any) => (
                <button
                  key={color.hex}
                  style={{ backgroundColor: color.hex }}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    selectedColor === color.name ? "border-(--accent,#B10E0E)" : "border-transparent"
                  }`}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className="mt-6 py-3 flex items-center justify-center gap-2 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--accent,#B10E0E)" }}
        >
          <IoBagOutline size={24} />
          Add to Bag
        </button>
      </div>
    </section>
  );
}