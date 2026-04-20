"use client";

import * as React from "react";
import { EVENTS } from "@/lib/events";
import { toast } from "sonner";
import apiClient from "@/lib/axios-client";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { DecrementTimer, ClearActiveTx, PushToQueue, ProcessNextInQueue } from "@/lib/redux/slices/ussd-slice";
import { TransactionWithRelations } from "@/types";
import { SignalHigh, BatteryFull, Volume2 } from "lucide-react";

export default function SimulatorPage() {
  const dispatch = useAppDispatch();
  const { activeTx, queue, timeLeft } = useAppSelector((state) => state.ussdSlice);
  const [pin, setPin] = React.useState("");
  const [currentTime, setCurrentTime] = React.useState("");

  // Live Clock for the Status Bar
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sequential Queue Processing
  React.useEffect(() => {
    if (!activeTx && queue.length > 0) {
      dispatch(ProcessNextInQueue());
    }
  }, [activeTx, queue, dispatch]);

  const HandleProcessPayment = React.useCallback(async (status: "SUCCESS" | "FAILED") => {
    if (!activeTx) return;
    try {
      await apiClient.patch(`/simulator/transactions/${activeTx.id}`, { status });
      dispatch(ClearActiveTx());
      setPin("");
      if (status === "SUCCESS") toast.success("PAYMENT_SENT", { description: "Verified via Tecno." });
    } catch (err) {
      toast.error("COMMUNICATION_ERROR");
    }
  }, [activeTx, dispatch]);

  // SSE Listener
  React.useEffect(() => {
    const eventSource = new EventSource("/api/agent/transactions/stream");
    const HandleIncoming = (e: MessageEvent) => {
      try {
        const tx = JSON.parse(e.data) as TransactionWithRelations;
        dispatch(PushToQueue(tx));
      } catch (err) {
        console.error("Parse Error", err);
      }
    };
    eventSource.addEventListener(EVENTS.TRANSACTION_CREATED, HandleIncoming as EventListener);
    return () => eventSource.close();
  }, [dispatch]);

  // 30s Timer Heartbeat
  React.useEffect(() => {
    if (!activeTx) return;
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        dispatch(DecrementTimer());
      } else {
        HandleProcessPayment("FAILED");
        toast.error("USSD_TIMEOUT");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTx, timeLeft, dispatch, HandleProcessPayment]);

  // Keypad & Hardware Logic
  const HandleKeypad = (val: string | number) => {
    if (!activeTx) return;
    if (typeof val === "number" && pin.length < 4) setPin((p) => p + val);
    if (val === "*") setPin((p) => p + "*");
    if (val === "#") setPin((p) => p + "#");
  };

  // Right Soft Key Logic: Acts as 'Clear/Backspace' if typing, otherwise 'Cancel'
  const HandleRightSoftKey = () => {
    if (!activeTx) return;
    if (pin.length > 0) {
      setPin((p) => p.slice(0, -1)); // Backspace
    } else {
      HandleProcessPayment("FAILED"); // Cancel Transaction
    }
  };

  // Left Soft Key Logic: Submit (Requires 4 digits)
  const HandleLeftSoftKey = () => {
    if (activeTx && pin.length === 4) {
      HandleProcessPayment("SUCCESS");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-4 font-sans select-none">
      {/* TECNO PHONE CHASSIS */}
      <div className="relative w-[320px] rounded-[30px] bg-[#4da8da] p-3 pb-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-blue-300/30 overflow-hidden ring-4 ring-zinc-800/10">

        {/* EARPIECE & CAMERA MOCK */}
        <div className="flex justify-center items-center gap-4 mb-4 mt-2">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-800/50 shadow-inner" />
          <div className="h-1.5 w-16 rounded-full bg-zinc-900 shadow-inner" />
        </div>

        {/* SCREEN BEZEL */}
        <div className="relative mx-auto h-[320px] w-full bg-black p-1.5 rounded-t-2xl rounded-b-md shadow-inner">

          {/* ACTUAL SCREEN */}
          <div
            className="relative flex h-full w-full flex-col overflow-hidden bg-zinc-900"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* STATUS BAR */}
            <div className="flex justify-between items-center px-1.5 py-1 text-white bg-black/30 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-1">
                <SignalHigh className="h-3 w-3" />
                <span className="text-[9px] font-medium leading-none">Ethio telecom</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-3 w-3" />
                <span className="text-[9px] font-medium leading-none">{currentTime}</span>
                <BatteryFull className="h-3 w-3" />
              </div>
            </div>

            {/* SCREEN IDLE STATE (If no USSD) */}
            {!activeTx && (
              <div className="absolute top-12 w-full text-center text-white drop-shadow-md">
                <h1 className="text-4xl font-light">{currentTime.split(' ')[0]}</h1>
                <p className="text-[10px] uppercase font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                {queue.length > 0 && (
                  <div className="mt-4 inline-block bg-blue-500/80 px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                    {queue.length} USSD In Queue
                  </div>
                )}
              </div>
            )}

            {/* USSD PROMPT OVERLAY */}
            {activeTx && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-10">
                <div className="w-full bg-white rounded shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                  <div className="bg-blue-600 px-3 py-1.5 flex justify-between items-center text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider">USSD Request</span>
                    <span className={`text-[10px] font-bold ${timeLeft < 10 ? 'text-red-300 animate-pulse' : ''}`}>{timeLeft}s</span>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="text-[13px] leading-tight text-zinc-900">
                      <span className="font-bold">{activeTx.agency.name}</span> is requesting a payment of <span className="font-bold text-blue-600">{activeTx.amount} ETB</span>.
                    </p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Enter 4-Digit PIN</label>
                      <input
                        type="password"
                        readOnly
                        value={pin}
                        className="w-full border-b-2 border-blue-600 bg-zinc-50 px-2 py-1 text-center text-lg font-mono tracking-widest text-zinc-900 focus:outline-none"
                        placeholder="****"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-100 px-2 py-1.5 flex justify-between border-t border-zinc-200">
                    <span className="text-[9px] font-bold text-blue-600 uppercase">{pin.length === 4 ? "OK" : ""}</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">{pin.length > 0 ? "Clear" : "Cancel"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM SCREEN SOFT KEY LABELS (Visible when idle) */}
            {!activeTx && (
              <div className="absolute bottom-1 w-full px-2 flex justify-between text-white drop-shadow-md">
                <span className="text-[10px] font-medium">Menu</span>
                <span className="text-[10px] font-medium">Contacts</span>
              </div>
            )}
          </div>
        </div>

        {/* BRANDING */}
        <div className="text-center my-3">
          <span className="text-white text-sm font-bold tracking-widest opacity-90 drop-shadow-sm">
            TECNO
          </span>
        </div>

        {/* FLAT KEYPAD AREA */}
        <div className="bg-[#5ab6e6] rounded-xl overflow-hidden border border-[#3e93c2] shadow-inner">

          {/* NAVIGATION KEYS */}
          <div className="flex justify-between items-center p-2 border-b border-[#3e93c2]/50">
            {/* Left Keys */}
            <div className="flex flex-col gap-2 w-16">
              <button onClick={HandleLeftSoftKey} className="h-6 bg-[#4da8da] rounded border-b-2 border-[#3a8eb8] active:translate-y-0.5 active:border-0 shadow-sm flex items-center justify-center">
                <div className="w-6 h-0.5 bg-white/70 rounded-full" />
              </button>
              <button className="h-6 bg-[#4da8da] rounded border-b-2 border-[#3a8eb8] active:translate-y-0.5 active:border-0 shadow-sm flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-[1.5px] border-green-500/80 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-green-500/80 rounded-full transform -rotate-45" />
                </div>
              </button>
            </div>

            {/* D-PAD */}
            <div className="relative w-16 h-16 bg-[#4da8da] rounded-xl border-2 border-blue-200/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center active:scale-95 transition-transform">
              <div className="w-8 h-8 bg-[#3a8eb8] rounded-md shadow-inner" />
            </div>

            {/* Right Keys */}
            <div className="flex flex-col gap-2 w-16">
              <button onClick={HandleRightSoftKey} className="h-6 bg-[#4da8da] rounded border-b-2 border-[#3a8eb8] active:translate-y-0.5 active:border-0 shadow-sm flex items-center justify-center">
                <div className="w-6 h-0.5 bg-white/70 rounded-full" />
              </button>
              <button onClick={() => HandleProcessPayment("FAILED")} className="h-6 bg-[#4da8da] rounded border-b-2 border-[#3a8eb8] active:translate-y-0.5 active:border-0 shadow-sm flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-[1.5px] border-red-500/80 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-red-500/80 rounded-full transform rotate-45" />
                </div>
              </button>
            </div>
          </div>

          {/* NUMBER PAD */}
          <div className="grid grid-cols-3">
            {[
              { num: 1, sub: ".," }, { num: 2, sub: "ABC" }, { num: 3, sub: "DEF" },
              { num: 4, sub: "GHI" }, { num: 5, sub: "JKL" }, { num: 6, sub: "MNO" },
              { num: 7, sub: "PQRS" }, { num: 8, sub: "TUV" }, { num: 9, sub: "WXYZ" },
              { num: "*", sub: "A/a" }, { num: 0, sub: "±" }, { num: "#", sub: "🗣" },
            ].map((btn, i) => (
              <button
                key={btn.num}
                onClick={() => HandleKeypad(btn.num)}
                className={`flex flex-col items-center justify-center h-12 bg-transparent text-white active:bg-[#3a8eb8]/50 transition-colors
                  ${i % 3 !== 2 ? 'border-r border-[#3e93c2]/50' : ''} 
                  ${i < 9 ? 'border-b border-[#3e93c2]/50' : ''}
                `}
              >
                <span className="text-sm font-bold leading-none mt-1">{btn.num}</span>
                <span className="text-[7px] text-white/70 tracking-widest mt-0.5">{btn.sub}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
