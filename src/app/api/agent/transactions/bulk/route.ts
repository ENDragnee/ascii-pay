import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetApiSession } from "@/lib/server-auth";
import { eventEmitter, EVENTS } from "@/lib/events";
import { TransactionWithRelations } from "@/types";

export async function POST(req: Request) {
  const session = await GetApiSession();

  // 1. Strict Guard: Extract agencyId early
  const agencyId = session?.user?.agencyId;
  const userId = session?.user?.id;

  if (!agencyId || !userId) {
    return NextResponse.json(
      { error: "Unauthorized: Missing Agency Context" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { customerIds, amount, productId } = body;

  try {
    // 2. Map the creation promises
    const transactionOperations = customerIds.map((id: string) =>
      prisma.transaction.create({
        data: {
          amount: parseFloat(amount),
          status: "PENDING",
          agencyId: agencyId, // Now definitively a string
          customerId: id,
          productId: productId || null,
        },
        include: {
          customer: true,
          agency: true,
          product: true,
        },
      }),
    );

    // 3. Execute the batch
    const results = await prisma.$transaction(transactionOperations);

    // 4. Broadcast events via SSE
    results.forEach((tx) => {
      // Cast to the shared interface to ensure type safety in the emitter
      eventEmitter.emit(
        EVENTS.TRANSACTION_CREATED,
        tx as TransactionWithRelations,
      );
    });

    return NextResponse.json({
      success: true,
      count: results.length,
    });
  } catch (error) {
    console.error("Bulk Transaction Error:", error);
    return NextResponse.json(
      { error: "Batch processing failed" },
      { status: 500 },
    );
  }
}
