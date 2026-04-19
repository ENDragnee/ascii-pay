"use client";

import { TransactionWithRelations } from "@/types";
import { StatusBadge } from "./status-badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/axios-client";
import { toast } from "sonner";
import { XCircle, RefreshCcw } from "lucide-react";

interface TransactionListProps {
  transactions: TransactionWithRelations[];
  isLoading: boolean;
  onRefreshAction: () => void;
}

export function TransactionList({
  transactions,
  isLoading,
  onRefreshAction
}: TransactionListProps) {

  async function HandleCancelAction(id: string) {
    try {
      await apiClient.patch(`/agent/transactions/${id}/cancel`);
      toast.success("TRANSACTION_CANCELLED");
      onRefreshAction();
    } catch {
      toast.error("CANCEL_FAILED");
    }
  }

  async function HandleRetryAction(id: string) {
    try {
      await apiClient.post(`/agent/transactions/${id}/retry`);
      toast.success("USSD_RE_PUSHED", { description: "Timer reset on device." });
      onRefreshAction();
    } catch {
      toast.error("RETRY_FAILED");
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full border-2 rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:border-2">
      {/* Desktop Header Row */}
      <div className="hidden md:grid grid-cols-6 bg-muted p-4 font-mono text-[10px] font-bold uppercase tracking-widest border-b-2">
        <span>Customer</span>
        <span>Service</span>
        <span>Amount</span>
        <span>Status</span>
        <span>Time</span>
        <span className="text-right">Actions</span>
      </div>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex flex-col justify-between border-2 border-primary p-4 font-mono md:grid md:grid-cols-6 md:items-center md:border-0 md:border-b last:md:border-b-0 md:hover:bg-muted/50 transition-colors"
        >
          {/* Customer */}
          <div className="flex flex-col">
            <span className="md:hidden text-[7px] uppercase opacity-50 font-bold">Customer</span>
            <span className="text-[10px] font-black uppercase tracking-tighter truncate">
              {tx.customer.name}
            </span>
          </div>

          {/* Service */}
          <div className="mt-2 md:mt-0 flex flex-col">
            <span className="md:hidden text-[7px] uppercase opacity-50 font-bold">Service</span>
            <span className="text-[9px] uppercase truncate">
              {tx.product?.name || "DIRECT_PAY"}
            </span>
          </div>

          {/* Amount */}
          <div className="mt-2 md:mt-0 flex flex-col">
            <span className="md:hidden text-[7px] uppercase opacity-50 font-bold">Amount</span>
            <span className="text-sm font-black tracking-tighter">
              {tx.amount.toLocaleString()} <span className="text-[8px]">ETB</span>
            </span>
          </div>

          {/* Status */}
          <div className="mt-4 md:mt-0">
            <StatusBadge status={tx.status} />
          </div>

          {/* Time */}
          <div className="mt-2 md:mt-0">
            <span className="text-[8px] opacity-60">
              {format(new Date(tx.createdAt), "HH:mm:ss")}
            </span>
          </div>

          {/* ACTIONS: Only show if PENDING */}
          <div className="mt-4 md:mt-0 flex justify-end gap-2">
            {tx.status === "PENDING" ? (
              <>
                <button
                  onClick={() => HandleRetryAction(tx.id)}
                  className="border-2 border-primary p-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Retry Push"
                >
                  <RefreshCcw className="h-3 w-3" />
                </button>
                <button
                  onClick={() => HandleCancelAction(tx.id)}
                  className="border-2 border-red-600 p-1 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  title="Cancel Request"
                >
                  <XCircle className="h-3 w-3" />
                </button>
              </>
            ) : (
              <span className="text-[7px] uppercase font-bold opacity-30 italic">LOCKED</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
