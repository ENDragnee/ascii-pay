import { PrismaClient } from "../src/generated/prisma/client";

export async function SeedPermissionsAndRoles(
  prisma: PrismaClient,
): Promise<void> {
  console.log("🔑 Seeding Permissions and Roles...");

  // 1. All possible permissions for the system
  const allPermissionNames = [
    "view-dashboard",
    "manage-agency",
    "manage-products",
    "manage-customers",
    "initiate-payment",
    "view-reports",
    "manage-users",
  ];

  // 2. Upsert permissions and build a fresh map from the DB to ensure IDs are correct
  for (const name of allPermissionNames) {
    await prisma.permission.upsert({
      where: { guardName: name },
      update: {},
      create: { guardName: name },
    });
  }

  const dbPermissions = await prisma.permission.findMany();
  const permissionMap = new Map(dbPermissions.map((p) => [p.guardName, p.id]));

  // 3. Define Role structures
  const rolesToSeed = [
    {
      name: "SUPER_ADMIN",
      perms: allPermissionNames,
    },
    {
      name: "AGENT_OWNER",
      perms: [
        "view-dashboard",
        "manage-products",
        "manage-customers",
        "initiate-payment",
        "view-reports",
      ],
    },
    {
      name: "AGENT_STAFF",
      perms: ["view-dashboard", "manage-customers", "initiate-payment"],
    },
  ];

  // 4. Upsert Roles and link Permissions via the PermissionRole join table
  for (const roleData of rolesToSeed) {
    const role = await prisma.role.upsert({
      where: { guardName: roleData.name },
      update: {},
      create: { guardName: roleData.name },
    });

    for (const permName of roleData.perms) {
      const permissionId = permissionMap.get(permName);

      if (!permissionId) {
        console.warn(`⚠️ Permission not found in map: ${permName}`);
        continue;
      }

      // Populate the join table
      await prisma.permissionRole.upsert({
        where: {
          permissionId_roleId: {
            permissionId: permissionId,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          permissionId: permissionId,
          roleId: role.id,
        },
      });
    }
  }

  const count = await prisma.permissionRole.count();
  console.log(`✅ Permission mapping complete. Total relationships: ${count}`);
}
