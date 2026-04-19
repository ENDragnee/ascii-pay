import { PrismaClient } from "../src/generated/prisma/client";

export async function SeedBusinessData(prisma: PrismaClient, agencyId: string) {
  console.log("📦 Seeding Products and Customers...");

  // 1. Seed Products
  const products = [
    { name: "Monthly Water Bill", price: 150.0 },
    { name: "Solar Maintenance", price: 450.0 },
    { name: "Community Tax", price: 50.0 },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        ...prod,
        agencyId,
      },
    });
  }

  // 2. Seed Recurring Customers
  const customers = [
    { name: "Kebede Kasahun", phone: "251922334455", defaultAmount: 150.0 },
    { name: "Chala Tolosa", phone: "251933445566", defaultAmount: 50.0 },
    { name: "Fatuma Ahmed", phone: "251944556677", defaultAmount: 450.0 },
  ];

  for (const cust of customers) {
    await prisma.customer.create({
      data: {
        ...cust,
        agencyId,
      },
    });
  }
}
