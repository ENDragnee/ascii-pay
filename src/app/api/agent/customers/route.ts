import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";

export async function GET() {
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({
    where: { agencyId: session.user.agencyId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, defaultAmount } = body;

  const customer = await prisma.customer.create({
    data: {
      name,
      phone,
      defaultAmount: defaultAmount ? parseFloat(defaultAmount) : null,
      agencyId: session.user.agencyId,
    },
  });

  return NextResponse.json(customer);
}
