import { PrismaClient } from "../src/generated/prisma/client";
import { HashPassword } from "../src/lib/password-utils";

export async function SeedAgenciesAndUsers(prisma: PrismaClient) {
  console.log("🏢 Seeding Agencies and Users...");

  const hashedPassword = await HashPassword("password123");

  // 1. Create Demo Agency
  const demoAgency = await prisma.agency.upsert({
    where: { id: "cl-demo-agency" },
    update: {},
    create: {
      id: "cl-demo-agency",
      name: "Ascii Pay Rural Hub",
      phone: "251911000000",
      balance: 5000.5,
    },
  });

  // 2. Create Agent Owner
  const owner = await prisma.user.upsert({
    where: { email: "owner@ascii.com" },
    update: {},
    create: {
      name: "Abebe Owner",
      email: "owner@ascii.com",
      password: hashedPassword,
      agencyId: demoAgency.id,
    },
  });

  // 3. Assign AGENT_OWNER Role
  const ownerRole = await prisma.role.findUnique({
    where: { guardName: "AGENT_OWNER" },
  });
  if (ownerRole) {
    await prisma.roleUser.upsert({
      where: { userId_roleId: { userId: owner.id, roleId: ownerRole.id } },
      update: {},
      create: { userId: owner.id, roleId: ownerRole.id },
    });
  }

  return { agencyId: demoAgency.id };
}
