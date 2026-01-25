"use client";

import { useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import Spinner from "@/components/ui/spinner";
import useProductStore from "@/store/productStore";
import EmptyState from "@/components/ui/EmptyState";
import SortButton from "@/components/shop/SortButton";

export default function Shop() {
  const { loading, error, fetchProducts, filteredAndSearchedProducts } =
    useProductStore();

  // Get combined filtered + searched products
  const productsToShow = filteredAndSearchedProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="w-full h-full flex items-center flex-col justify-center">
        <EmptyState
          retry
          text="Failed to get products"
          onClick={fetchProducts}
          buttonText="Retry"
        />
      </div>
    );
  }

  if (productsToShow.length === 0) {
    return <EmptyState text="No products match your filters or search." />;
  }

  return (
    <div className="w-full flex flex-col h-full p-4">
      <SortButton />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {productsToShow.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            SRC={product.images[0]}
            label={product.name}
            price={product.price}
            selectedColor={product.colors[0]?.name}
            selectedSize={product.sizes[0]}
            quantity={1}
            description={product.description}
          />
        ))}
      </div>
    </div>
  );
}
