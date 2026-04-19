import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";
import { eventEmitter, EVENTS } from "@/lib/events";
import { RequestParams, TransactionWithRelations } from "@/types";

export async function POST(_req: Request, { params }: RequestParams) {
  const { id } = await params;
  const session = await GetApiSession();

  if (!session?.user?.agencyId)
    return new Response("Unauthorized", { status: 401 });

  // Update the timestamp so it appears at the top again
  const transaction = await prisma.transaction.update({
    where: { id, agencyId: session.user.agencyId },
    data: { createdAt: new Date(), status: "PENDING" },
    include: { agency: true, customer: true, product: true },
  });

  // RE-EMIT Creation event to trigger the Simulator Nokia UI
  eventEmitter.emit(
    EVENTS.TRANSACTION_CREATED,
    transaction as TransactionWithRelations,
  );

  return NextResponse.json(transaction);
}
