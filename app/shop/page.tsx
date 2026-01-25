"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import Spinner from "@/components/ui/spinner";
import useProductStore from "@/store/productStore";
import EmptyState from "@/components/ui/EmptyState";
import SortButton from "@/components/shop/SortButton";

export default function Shop() {
  const { products, loading, query, error, fetchProducts, filteredProducts } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return(
      <div className="w-full h-full flex items-center flex-col justify-center">
        <EmptyState retry text="Failed to get Products" onClick={fetchProducts} buttonText="Go to Shop"/>
      </div>
    )
  }

  if (products.length === 0) {
    return <EmptyState text="No product found" />;
  }

  const filtered = filteredProducts();

  return (
    <div className="w-full flex flex-col h-full p-4">
      <SortButton />

      {filtered.length === 0 && !loading && (
        <EmptyState text="No products match your filters" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            SRC={product.images[0]}
            label={product.name}
            price={product.price}
             selectedColor={product.colors[0].name}
            selectedSize={product.sizes[0]}
            quantity={1}
          />
        ))}
      </div>
    </div>
  );
}
