"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { TransactionList } from "@/components/transactions/transaction-list";
import apiClient from "@/lib/axios-client";
import { TransactionWithRelations } from "@/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function HistoryPage() {
  const { data: transactions, isLoading, refetch } = useQuery<TransactionWithRelations[]>({
    queryKey: ["transaction-history"],
    queryFn: async () => {
      const res = await apiClient.get("/agent/transactions");
      return res.data;
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Audit History"
        text="View and export all past USSD transactions."
      >
        <Button variant="outline" className="rounded-none border-2 font-mono text-[10px] uppercase">
          <Download className="mr-2 h-3 w-3" /> Export CSV
        </Button>
      </DashboardHeader>

      <div className="bg-card">
        <TransactionList
          transactions={transactions || []}
          isLoading={isLoading}
          onRefreshAction={refetch}
        />
      </div>
    </DashboardShell>
  );
}
