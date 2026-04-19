"use client";

import { TransactionWithRelations } from "@/types";
import { StatusBadge } from "./status-badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionListProps {
  transactions: TransactionWithRelations[];
  isLoading: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
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
      <div className="hidden md:grid grid-cols-5 bg-muted p-4 font-mono text-[10px] font-bold uppercase tracking-widest border-b-2">
        <span>Customer</span>
        <span>Service</span>
        <span>Amount</span>
        <span>Status</span>
        <span className="text-right">Time</span>
      </div>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex flex-col justify-between border-2 border-primary p-4 font-mono md:grid md:grid-cols-5 md:items-center md:border-0 md:border-b last:md:border-b-0 md:hover:bg-muted/50 transition-colors"
        >
          {/* Mobile Label / Customer Name */}
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
          <div className="mt-2 md:mt-0 text-right md:text-right">
            <span className="text-[8px] opacity-60">
              {format(new Date(tx.createdAt), "HH:mm:ss")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
