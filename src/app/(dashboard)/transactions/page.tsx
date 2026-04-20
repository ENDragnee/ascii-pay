"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { TransactionList } from "@/components/transactions/transaction-list";
import apiClient from "@/lib/axios-client";
import { TransactionWithRelations } from "@/types";
import { EVENTS } from "@/lib/events";
import { toast } from "sonner";

export default function TransactionsPage() {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, refetch } = useQuery<TransactionWithRelations[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await apiClient.get("/agent/transactions");
      return res.data;
    },
  });

  // Listen for Real-time SSE updates
  React.useEffect(() => {
    const eventSource = new EventSource("/api/agent/transactions/stream");

    const HandleUpdate = (e: MessageEvent) => {
      const updatedTx = JSON.parse(e.data) as TransactionWithRelations;

      // Update the local cache immediately
      queryClient.setQueryData(["transactions"], (old: TransactionWithRelations[] | undefined) => {
        if (!old) return [updatedTx];
        return old.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx));
      });

      if (updatedTx.status === "SUCCESS") {
        toast.success("PAYMENT RECEIVED", {
          description: `${updatedTx.customer.name} paid ${updatedTx.amount} ETB`,
        });
      }
    };

    eventSource.addEventListener(EVENTS.TRANSACTION_UPDATED, HandleUpdate as EventListener);

    return () => {
      eventSource.removeEventListener(EVENTS.TRANSACTION_UPDATED, HandleUpdate as EventListener);
      eventSource.close();
    };
  }, [queryClient]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Ledger"
        text="Real-time USSD transaction tracking terminal."
      />

      <TransactionList
        transactions={transactions || []}
        isLoading={isLoading}
        onRefreshAction={refetch}
      />
    </DashboardShell>
  );
}
