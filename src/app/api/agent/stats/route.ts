import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";

export async function GET() {
  const session = await GetApiSession();

  // If session is null, proxy.ts usually catches this,
  // but we check again for type safety
  if (!session?.user?.agencyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agencyId = session.user.agencyId;

  try {
    const [productCount, customerCount, agencyData, transactionStats] =
      await Promise.all([
        prisma.product.count({ where: { agencyId } }),
        prisma.customer.count({ where: { agencyId } }),
        prisma.agency.findUnique({
          where: { id: agencyId },
          select: { balance: true, name: true },
        }),
        prisma.transaction.aggregate({
          where: { agencyId, status: "SUCCESS" },
          _sum: { amount: true },
        }),
      ]);

    return NextResponse.json({
      agencyName: agencyData?.name || "Unknown Agency",
      walletBalance: agencyData?.balance || 0,
      totalRevenue: transactionStats._sum.amount || 0,
      activeProducts: productCount,
      totalCustomers: customerCount,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
