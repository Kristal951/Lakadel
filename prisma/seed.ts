import prisma, { pool } from "@/lib/prisma";

async function main() {
  console.log("Emptying database...");
  await prisma.product.deleteMany();

  console.log("Seeding products...");
  const products = [
    {
      name: "Classic White Tee",
      description: "Premium cotton white t-shirt",
      price: 12000,
      imageUrl:
        "https://res.cloudinary.com/dgvk232bh/image/upload/v1769074305/IMG_9_jzqj6l.jpg",
      filters: ["tops", "t-shirts"],
      colors: ["white"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Black Essential Tee",
      description: "Minimal black t-shirt",
      price: 12000,
      imageUrl:
        "https://res.cloudinary.com/dgvk232bh/image/upload/v1769074304/IMG_3_wotuzk.jpg",
      filters: ["tops", "t-shirts"],
      colors: ["black"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Luxury Polo Shirt",
      description: "Tailored polo with premium finish",
      price: 18000,
      imageUrl:
        "https://res.cloudinary.com/dgvk232bh/image/upload/v1769074304/IMG_8_avl6dj.jpg",
      filters: ["tops", "polo"],
      colors: ["navy", "white"],
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Slim Fit Jeans",
      description: "Dark wash slim-fit jeans",
      price: 25000,
      imageUrl:
        "https://res.cloudinary.com/dgvk232bh/image/upload/v1769074304/IMG_4_dko6jk.jpg",
      filters: ["bottoms", "jeans"],
      colors: ["blue"],
      sizes: ["30", "32", "34", "36"],
    },
    {
      name: "Tailored Trousers",
      description: "Formal tailored trousers",
      price: 30000,
      imageUrl:
        "https://res.cloudinary.com/dgvk232bh/image/upload/v1769074290/IMG_5_y7frd2.jpg",
      filters: ["bottoms", "trousers"],
      colors: ["black", "grey"],
      sizes: ["30", "32", "34", "36"],
    },
  ];

  await prisma.product.createMany({
    data: products,
  });

  console.log(`✅ ${products.length} products seeded successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); 
  });
