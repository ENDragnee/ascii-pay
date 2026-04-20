"use client";

import * as React from "react";
import { EVENTS } from "@/lib/events";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiClient from "@/lib/axios-client";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
  PushToQueue,
  ProcessNextInQueue,
  DecrementTimer,
  ClearActiveTx
} from "@/lib/redux/slices/ussd-slice";
import { TransactionWithRelations } from "@/types";

export default function SimulatorPage() {
  const dispatch = useAppDispatch();
  const { activeTx, queue, timeLeft } = useAppSelector((state) => state.ussdSlice);
  const [pin, setPin] = React.useState("");

  /**
   * Sequential Logic: If nothing is on screen but items are in queue, process next
   */
  React.useEffect(() => {
    if (!activeTx && queue.length > 0) {
      dispatch(ProcessNextInQueue());
    }
  }, [activeTx, queue, dispatch]);

  const HandleProcessPayment = React.useCallback(async (status: "SUCCESS" | "FAILED") => {
    if (!activeTx) return;
    try {
      // Standardized API path (no double /api)
      await apiClient.patch(`/simulator/transactions/${activeTx.id}`, { status });
      dispatch(ClearActiveTx());
      setPin("");

      if (status === "SUCCESS") {
        toast.success("PAYMENT_SENT", { description: `Processed ${activeTx.amount} ETB` });
      }
    } catch (err) {
      console.error("Gateway Error", err);
      toast.error("COMMUNICATION_ERROR");
    }
  }, [activeTx, dispatch]);

  // 1. SSE Listener: Adds incoming transactions to the queue
  React.useEffect(() => {
    const eventSource = new EventSource("/api/agent/transactions/stream");

    const HandleIncoming = (e: MessageEvent) => {
      try {
        const tx = JSON.parse(e.data) as TransactionWithRelations;
        dispatch(PushToQueue(tx));
        toast.info("QUEUED_REQUEST", { description: `From: ${tx.agency.name}` });
      } catch (err) {
        console.error("Parse Error", err);
      }
    };

    eventSource.addEventListener(EVENTS.TRANSACTION_CREATED, HandleIncoming as EventListener);
    return () => eventSource.close();
  }, [dispatch]);

  // 2. 30s Timer Heartbeat
  React.useEffect(() => {
    if (!activeTx) return;

    const timer = setInterval(() => {
      if (timeLeft > 0) {
        dispatch(DecrementTimer());
      } else {
        HandleProcessPayment("FAILED");
        toast.error("USSD_TIMEOUT", { description: "Session expired." });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTx, timeLeft, dispatch, HandleProcessPayment]);

  const HandleKeypad = (val: string | number) => {
    if (!activeTx) return;
    if (typeof val === "number" && pin.length < 4) setPin((p) => p + val);
    if (val === "C") setPin((p) => p.slice(0, -1));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-mono select-none">
      <div className="relative w-75 rounded-[60px] bg-slate-700 p-4 pb-12 border-x-10 border-slate-800 shadow-2xl">

        {/* Hardware Elements */}
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-zinc-900" />

        {/* NOKIA SCREEN */}
        <div className="relative mx-auto h-55 w-full border-10 border-zinc-400 bg-zinc-300 p-2 shadow-inner overflow-hidden">
          <div className="flex h-full flex-col bg-[#879173] p-2 text-zinc-900 antialiased font-bold">

            {/* Status Bar */}
            <div className="flex justify-between text-[9px] uppercase border-b border-zinc-900/20 pb-1">
              <span>📶 ASCII</span>
              {queue.length > 0 && <span className="animate-pulse">Q:{queue.length}</span>}
              <span>{timeLeft}S</span>
            </div>

            {/* Display Logic */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              {activeTx ? (
                <div className="w-full space-y-1">
                  <p className="text-[10px] uppercase leading-tight truncate">
                    {activeTx.agency.name}
                  </p>
                  <p className="text-[12px] font-black">{activeTx.amount} ETB</p>

                  <Input
                    type="password"
                    readOnly
                    value={pin}
                    className="h-7 rounded-none border-2 border-zinc-900 bg-transparent text-center text-zinc-900 placeholder:text-zinc-800/20"
                    placeholder="****"
                  />

                  <div className="flex justify-between text-[7px] uppercase pt-1">
                    <span className={pin.length === 4 ? "underline font-black" : "opacity-30"}>[OK]</span>
                    <span className="underline">[EXIT]</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 opacity-40">
                  <p className="text-[10px] uppercase">READY_</p>
                  <p className="text-[7px] uppercase tracking-tighter">Waiting for Remote...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PHYSICAL BUTTONS */}
        <div className="mt-8 px-4">
          <div className="flex justify-between mb-6">
            {/* Left Nav (OK) */}
            <button
              onClick={() => pin.length === 4 && HandleProcessPayment("SUCCESS")}
              disabled={!activeTx || pin.length < 4}
              className="h-8 w-14 rounded-full bg-zinc-800 shadow-[0_4px_0_0_#1a1a1a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-20"
            />
            {/* Right Nav (Cancel) */}
            <button
              onClick={() => HandleProcessPayment("FAILED")}
              disabled={!activeTx}
              className="h-8 w-14 rounded-full bg-zinc-800 shadow-[0_4px_0_0_#1a1a1a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-20"
            />
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "#"].map((n) => (
              <button
                key={n}
                onClick={() => HandleKeypad(n)}
                className="flex h-10 items-center justify-center rounded-xl bg-zinc-800 text-xs font-black text-zinc-400 shadow-[0_3px_0_0_#1a1a1a] active:translate-y-0.5 active:shadow-none"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
