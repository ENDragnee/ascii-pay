import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventEmitter, EVENTS } from "@/lib/events";
import { RequestParams } from "@/types";

export async function PATCH(req: Request, { params }: RequestParams) {
  const { id } = await params;
  const { status } = await req.json();

  const transaction = await prisma.transaction.update({
    where: { id },
    data: { status },
    include: { agency: true },
  });

  // Emit event so the Agent Dashboard knows the user paid!
  eventEmitter.emit(EVENTS.TRANSACTION_UPDATED, transaction);

  return NextResponse.json(transaction);
}
