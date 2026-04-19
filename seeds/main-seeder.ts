import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { SeedPermissionsAndRoles } from "./permission-role-seeder";
import { SeedAgenciesAndUsers } from "./agency-user-seeder";
import { SeedBusinessData } from "./business-data-seeder";

async function Main(): Promise<void> {
  console.log("🏁 Starting Global Seed using Singleton...");

  try {
    // No 'as any' needed, types are now correctly inferred
    await SeedPermissionsAndRoles(prisma);

    const { agencyId } = await SeedAgenciesAndUsers(prisma);

    await SeedBusinessData(prisma, agencyId);

    console.log("✨ Seeding completed successfully.");
  } catch (error) {
    console.error("❌ Seeding failed during execution:", error);
    process.exit(1);
  }
}

Main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // The extended client retains the $disconnect method
    await prisma.$disconnect();
  });
