import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";

export async function GET() {
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { agencyId: session.user.agencyId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, price } = await req.json();

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      agencyId: session.user.agencyId,
    },
  });

  return NextResponse.json(product);
}
