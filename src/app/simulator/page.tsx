"use client";

import * as React from "react";
import { EVENTS } from "@/lib/events";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiClient from "@/lib/axios-client";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { SetActiveTx, DecrementTimer, ClearUssd } from "@/lib/redux/slices/ussd-slice";
import { TransactionWithRelations } from "@/types";

export default function SimulatorPage() {
  const dispatch = useAppDispatch();
  const { activeTx, timeLeft } = useAppSelector((state) => state.ussdSlice);
  const [pin, setPin] = React.useState("");

  /**
   * HandleProcessPayment: Finalizes the transaction
   * Path corrected from "/api/simulator/..." to "/simulator/..."
   */
  const HandleProcessPayment = React.useCallback(async (status: "SUCCESS" | "FAILED") => {
    if (!activeTx) return;

    try {
      // FIX: Removed redundant '/api' prefix as it is already in the axios baseURL
      await apiClient.patch(`/simulator/transactions/${activeTx.id}`, { status });

      dispatch(ClearUssd());
      setPin("");

      if (status === "SUCCESS") {
        toast.success("PAYMENT_AUTHORIZED");
      } else {
        toast.error("SESSION_TERMINATED");
      }
    } catch (err) {
      console.error("Gateway Error:", err);
      toast.error("COMMUNICATION_ERROR");
    }
  }, [activeTx, dispatch]);

  // 1. SSE Listener
  React.useEffect(() => {
    const eventSource = new EventSource("/api/agent/transactions/stream");

    const HandleNewTx = (e: MessageEvent) => {
      try {
        const tx = JSON.parse(e.data) as TransactionWithRelations;
        dispatch(SetActiveTx(tx));
        setPin("");
        toast.info("INCOMING_PUSH", { description: tx.agency.name });
      } catch (err) {
        console.error("Parse Error", err);
      }
    };

    eventSource.addEventListener(EVENTS.TRANSACTION_CREATED, HandleNewTx as EventListener);

    return () => {
      eventSource.removeEventListener(EVENTS.TRANSACTION_CREATED, HandleNewTx as EventListener);
      eventSource.close();
    };
  }, [dispatch]);

  // 2. Timer Logic: Hits the DB automatically on 0
  React.useEffect(() => {
    if (!activeTx) return;

    const timer = setInterval(() => {
      if (timeLeft > 0) {
        dispatch(DecrementTimer());
      } else {
        // This triggers the DB update automatically
        HandleProcessPayment("FAILED");
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
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-zinc-900" />

        <div className="relative mx-auto h-55 w-full border-10 border-zinc-400 bg-zinc-300 p-2 shadow-inner overflow-hidden">
          <div className="flex h-full flex-col bg-[#879173] p-2 text-zinc-900 antialiased font-bold">
            <div className="flex justify-between text-[9px] uppercase border-b border-zinc-900/20 pb-1">
              <span>📶 ASCII</span>
              <span className={timeLeft < 10 ? "text-red-800 animate-pulse" : ""}>
                {timeLeft}S
              </span>
              <div className="h-2 w-3 border border-zinc-900" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              {activeTx ? (
                <div className="w-full space-y-2">
                  <p className="text-[10px] uppercase leading-tight">
                    {activeTx.agency.name} <br />
                    Amt: {activeTx.amount} ETB
                  </p>

                  <Input
                    type="password"
                    readOnly
                    value={pin}
                    className="h-7 rounded-none border-2 border-zinc-900 bg-transparent text-center text-zinc-900 placeholder:text-zinc-800/30 font-black"
                    placeholder="****"
                  />

                  <div className="flex justify-between text-[7px] uppercase pt-1">
                    <span className={pin.length === 4 ? "underline" : "opacity-30"}>[OK]</span>
                    <span className="underline">[CANCEL]</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 opacity-40">
                  <p className="text-[10px] uppercase">Ready_</p>
                  <p className="text-[7px] uppercase">Waiting for Push...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 px-4">
          <div className="flex justify-between mb-6">
            <button
              onClick={() => pin.length === 4 && HandleProcessPayment("SUCCESS")}
              disabled={!activeTx || pin.length < 4}
              className="h-8 w-14 rounded-full bg-zinc-800 shadow-[0_4px_0_0_#1a1a1a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-30"
            />
            <button
              onClick={() => HandleProcessPayment("FAILED")}
              disabled={!activeTx}
              className="h-8 w-14 rounded-full bg-zinc-800 shadow-[0_4px_0_0_#1a1a1a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-30"
            />
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "#"].map((n) => (
              <button
                key={n}
                onClick={() => HandleKeypad(n)}
                className="flex h-11 items-center justify-center rounded-xl bg-zinc-800 text-xs font-black text-zinc-400 shadow-[0_4px_0_0_#1a1a1a] active:translate-y-0.5 active:shadow-[0_2px_0_0_#1a1a1a] transition-all"
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
