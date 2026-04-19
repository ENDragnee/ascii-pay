import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";
import { RequestParams } from "@/types";

export async function PATCH(req: Request, { params }: RequestParams) {
  const { id } = await params;
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, price } = await req.json();

  const product = await prisma.product.update({
    where: { id, agencyId: session.user.agencyId },
    data: { name, price: parseFloat(price) },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: RequestParams) {
  const { id } = await params;
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({
    where: { id, agencyId: session.user.agencyId },
  });

  return NextResponse.json({ success: true });
}
