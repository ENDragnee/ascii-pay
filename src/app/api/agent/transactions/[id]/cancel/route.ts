import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";
import { eventEmitter, EVENTS } from "@/lib/events";
import { RequestParams, TransactionWithRelations } from "@/types";

export async function PATCH(_req: Request, { params }: RequestParams) {
  const { id } = await params;
  const session = await GetApiSession();

  if (!session?.user?.agencyId)
    return new Response("Unauthorized", { status: 401 });

  const transaction = await prisma.transaction.update({
    where: { id, agencyId: session.user.agencyId },
    data: { status: "FAILED" },
    include: { agency: true, customer: true, product: true },
  });

  // Emit update so Simulator clears its active state
  eventEmitter.emit(
    EVENTS.TRANSACTION_UPDATED,
    transaction as TransactionWithRelations,
  );

  return NextResponse.json(transaction);
}
