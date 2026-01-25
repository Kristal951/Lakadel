import ProductCard from "@/components/shop/ProductCard";

export default function ProductPage() {
  const dummyProductsData = [
    {
      id: "2",
      label: "White Shirt",
      imageSrc: "/assets/IMG_3.jpg",
      priceTag: 30,
    },
    {
      id: "3",
      label: "Black Shirt",
      imageSrc: "/assets/IMG_4.jpg",
      priceTag: 40,
    },
    {
      id: "4",
      label: "Second White Shirt Image",
      imageSrc: "/assets/IMG_5.jpg",
      priceTag: 50,
    },
    {
      id: "7",
      label: "Mara Top",
      imageSrc: "/assets/IMG_8.jpg",
      priceTag: 80,
    },
    {
      id: "8",
      label: "Tayson Shirt",
      imageSrc: "/assets/IMG_9.jpg",
      priceTag: 90,
    },
    {
      id: "9",
      label: "Fuckin Awesome Shirt",
      imageSrc: "/assets/IMG_10.jpg",
      priceTag: 100,
    },
  ];

  return (
    <section className="w-full flex flex-col gap-8 px-4">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="text-5xl text-foreground font-semibold tracking-tight">
          Our Products
        </h2>
        <p className="text-sm text-foreground">
          Discover all our top-notch products
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {dummyProductsData.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            SRC={product.imageSrc}
            label={product.label}
            price={product.priceTag}
            selectedColor={product.colors[0].name}
            selectedSize={product.sizes[0]}
            quantity={1}
          />
        ))}
      </div>
    </section>
  );
}
