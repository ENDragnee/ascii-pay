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
    include: {
      customer: true,
      agency: true,
      product: true,
    },
  });

  eventEmitter.emit(EVENTS.TRANSACTION_UPDATED, transaction);

  return NextResponse.json(transaction);
}
