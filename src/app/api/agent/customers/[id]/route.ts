import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";
import { RequestParams } from "@/types";

export async function PATCH(req: Request, { params }: RequestParams) {
  const { id } = await params;
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone, defaultAmount } = await req.json();

  const customer = await prisma.customer.update({
    where: { id, agencyId: session.user.agencyId },
    data: {
      name,
      phone,
      defaultAmount: defaultAmount ? parseFloat(defaultAmount) : null,
    },
  });

  return NextResponse.json(customer);
}

export async function DELETE(_req: Request, { params }: RequestParams) {
  const { id } = await params;
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.customer.delete({
    where: { id, agencyId: session.user.agencyId },
  });

  return NextResponse.json({ success: true });
}
