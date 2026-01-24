import ProductCard from "@/components/shop/ProductCard";
import prisma from "@/lib/prisma";
import { BiSort } from "react-icons/bi";

export default async function Shop() {
  const products = await prisma.product.findMany();
  console.log(products);

  return (
    <div className="w-full flex flex-col h-full p-4">
      {/* Sort Button */}
      <div className="w-full flex justify-end mb-4">
        <button
          style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer text-foreground hover:bg-gray-200 transition"
        >
          <BiSort className="w-5 h-5" />
          <p className="text-sm">Sort by</p>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            SRC={product.imageUrl}
            label={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
