import { NextRequest } from "next/server";
import { GetApiSession } from "@/lib/server-auth";
import { eventEmitter, EVENTS } from "@/lib/events";
import { TransactionWithRelations } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await GetApiSession();

  if (!session?.user?.agencyId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const agencyId = session.user.agencyId;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Type-safe event dispatcher
      const SendEvent = (event: string, data: TransactionWithRelations) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      // Listeners with explicit types
      const OnTransactionUpdate = (data: TransactionWithRelations) => {
        if (data.agencyId === agencyId) {
          SendEvent(EVENTS.TRANSACTION_UPDATED, data);
        }
      };

      const OnTransactionCreate = (data: TransactionWithRelations) => {
        if (data.agencyId === agencyId) {
          SendEvent(EVENTS.TRANSACTION_CREATED, data);
        }
      };

      eventEmitter.on(EVENTS.TRANSACTION_UPDATED, OnTransactionUpdate);
      eventEmitter.on(EVENTS.TRANSACTION_CREATED, OnTransactionCreate);

      req.signal.addEventListener("abort", () => {
        eventEmitter.off(EVENTS.TRANSACTION_UPDATED, OnTransactionUpdate);
        eventEmitter.off(EVENTS.TRANSACTION_CREATED, OnTransactionCreate);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
