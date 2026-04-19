import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";
import { eventEmitter, EVENTS } from "@/lib/events";

export async function GET() {
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: { agencyId: session.user.agencyId },
    include: {
      customer: true,
      product: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const session = await GetApiSession();
  if (!session?.user?.agencyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { customerId, productId, amount } = await req.json();

  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      status: "PENDING",
      agencyId: session.user.agencyId,
      customerId,
      productId,
    },
    include: {
      customer: true,
      agency: true,
    },
  });

  // Emit the event for the Simulator to catch
  eventEmitter.emit(EVENTS.TRANSACTION_CREATED, transaction);

  return NextResponse.json(transaction);
}
