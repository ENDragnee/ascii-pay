"use client";

import * as React from "react";
import { EVENTS } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/axios-client";
import { TransactionWithRelations } from "@/types";

export default function SimulatorPage() {
  const [activeTx, setActiveTx] = React.useState<TransactionWithRelations | null>(null);

  React.useEffect(() => {
    const eventSource = new EventSource("/api/agent/transactions/stream");

    // Type-safe message handling
    const HandleNewTransaction = (e: MessageEvent) => {
      try {
        const tx = JSON.parse(e.data) as TransactionWithRelations;
        setActiveTx(tx);
        toast.info("NEW USSD PUSH RECEIVED", {
          description: `From: ${tx.agency.name}`,
        });
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.addEventListener(EVENTS.TRANSACTION_CREATED, HandleNewTransaction as EventListener);

    return () => {
      eventSource.removeEventListener(EVENTS.TRANSACTION_CREATED, HandleNewTransaction as EventListener);
      eventSource.close();
    };
  }, []);

  async function ProcessPayment(status: "SUCCESS" | "FAILED") {
    if (!activeTx) return;

    try {
      await apiClient.patch(`/api/simulator/transactions/${activeTx.id}`, { status });
      setActiveTx(null);
      toast.success(status === "SUCCESS" ? "PAYMENT AUTHORIZED" : "REQUEST REJECTED");
    } catch {
      toast.error("COMMUNICATION ERROR", {
        description: "Could not reach payment gateway.",
      });
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 p-4 selection:bg-primary">
      {/* Neo-Brutalist Nokia Style Phone */}
      <div className="w-full max-w-[320px] border-[8px] border-zinc-800 bg-zinc-900 p-6 shadow-[20px_20px_0px_0px_rgba(255,255,255,0.05)]">
        <div className="mb-10 flex justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <span>Ethio_Telecom</span>
          <div className="flex gap-1">
            <div className="h-2 w-1 bg-zinc-500" />
            <div className="h-2 w-1 bg-zinc-500" />
            <div className="h-2 w-1 bg-zinc-700" />
          </div>
        </div>

        {activeTx ? (
          <div className="space-y-6 border-3 border-primary bg-zinc-100 p-5 text-zinc-900 shadow-[6px_6px_0px_0px_#000]">
            <div className="space-y-2">
              <p className="font-mono text-[10px] font-black uppercase tracking-tighter opacity-50">
                Incoming_Request
              </p>
              <p className="font-mono text-sm font-black uppercase leading-tight">
                {activeTx.agency.name} requests {activeTx.amount.toLocaleString()} ETB.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => ProcessPayment("SUCCESS")}
                className="h-12 w-full rounded-none bg-zinc-900 font-mono text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800"
              >
                1. Pay with Telebirr
              </Button>
              <Button
                variant="outline"
                onClick={() => ProcessPayment("FAILED")}
                className="h-12 w-full rounded-none border-2 border-zinc-900 bg-transparent font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-200"
              >
                2. Decline
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center border-2 border-dashed border-zinc-800 text-center">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 animate-pulse">
              Listening_For <br /> USSD_Push...
            </p>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-2">
          <div className="h-1 w-16 rounded-full bg-zinc-800" />
          <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-zinc-700">
            Ascii_Hardware_v1
          </span>
        </div>
      </div>
    </div>
  );
}
