import ProductCard from "@/components/shop/ProductCard";

export default function Shop() {
  const dummyProductsData = [
    {
      id: 2,
      label: "White Shirt",
      imageSrc: "/assets/IMG_3.jpg",
      priceTag: 30,
    },
    {
      id: 3,
      label: "Black Shirt",
      imageSrc: "/assets/IMG_4.jpg",
      priceTag: 40,
    },
    {
      id: 4,
      label: "Second White Shirt Image",
      imageSrc: "/assets/IMG_5.jpg",
      priceTag: 50,
    },
    {
      id: 7,
      label: "Mara Top",
      imageSrc: "/assets/IMG_8.jpg",
      priceTag: 80,
    },
    {
      id: 8,
      label: "Tayson Shirt",
      imageSrc: "/assets/IMG_9.jpg",
      priceTag: 90,
    },
    {
      id: 9,
      label: "Fuckin Awesome Shirt",
      imageSrc: "/assets/IMG_10.jpg",
      priceTag: 100,
    },
  ];
  return (
    <div className="w-full flex flex-col h-full">
      <div className="grid grid-cols-3">
        {dummyProductsData.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            SRC={product.imageSrc}
            label={product.label}
            price={product.priceTag}
          />
        ))}
      </div>
    </div>
  );
}
