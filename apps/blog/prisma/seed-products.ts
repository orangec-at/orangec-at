import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Vintage Bookmark",
      description: "A classic leather bookmark for your digital archives.",
      price: 0,
      pointPrice: 50,
      category: "bookmark",
      isRare: false,
    },
    {
      name: "Silver Quill",
      description: "Enhance your marginalia with this rare silver quill icon.",
      price: 0,
      pointPrice: 200,
      category: "stationery",
      isRare: true,
    },
    {
      name: "Midnight Member (Monthly)",
      description: "Get full access to all archives and private threads.",
      price: 9.99,
      pointPrice: 0,
      category: "membership",
      isRare: true,
    },
    {
      name: "Lifetime Archivist",
      description: "Forever access to the library and special recognition.",
      price: 49.99,
      pointPrice: 0,
      category: "membership",
      isRare: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s/g, "-") },
      update: product,
      create: {
        id: product.name.toLowerCase().replace(/\s/g, "-"),
        ...product,
      },
    });
  }

  console.log("Seed completed: Products added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
