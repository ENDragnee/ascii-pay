"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import apiClient from "@/lib/axios-client";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerForm } from "@/components/customers/customer-form";
import { GlobalPaymentDialog } from "@/components/transactions/global-payment-dialog";
import { Plus, SendHorizontal } from "lucide-react";

export default function AgentDashboardPage() {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["agent-stats"],
    queryFn: async () => (await apiClient.get("/agent/stats")).data,
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text={`Terminal Session Active: ${stats?.agencyName || "..."}`}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <>
            <MetricCard label="Wallet Balance" value={`${stats.walletBalance.toLocaleString()} ETB`} description="Current available funds" trend="neutral" />
            <MetricCard label="Total Revenue" value={`${stats.totalRevenue.toLocaleString()} ETB`} description="Processed today" trend="up" />
            <MetricCard label="Customers" value={stats.totalCustomers} description="Directory size" />
            <MetricCard label="Services" value={stats.activeProducts} description="Active catalog" />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border-2 p-6 bg-card">
          <h2 className="font-mono text-sm font-bold uppercase mb-4 underline decoration-primary underline-offset-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex flex-col items-center justify-center border-2 border-primary p-6 font-mono text-[10px] uppercase font-black hover:bg-primary hover:text-primary-foreground transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <SendHorizontal className="mb-2 h-5 w-5" />
              New Request
            </button>
            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="flex flex-col items-center justify-center border-2 border-primary p-6 font-mono text-[10px] uppercase font-black hover:bg-primary hover:text-primary-foreground transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="mb-2 h-5 w-5" />
              Add Customer
            </button>
          </div>
        </div>

        <div className="border-2 p-6 bg-card flex flex-col justify-between">
          <h2 className="font-mono text-sm font-bold uppercase mb-4 underline decoration-primary underline-offset-4">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse border-2 border-white shadow-sm" />
              <span className="font-mono text-[10px] font-bold uppercase">USSD Gateway: Operational</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
              <span className="font-mono text-[10px] font-bold uppercase">Database: Synchronized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Dialog Triggers managed by state */}
      <GlobalPaymentDialog
        open={isPaymentModalOpen}
        onOpenChangeAction={setIsPaymentModalOpen}
      />

      {/* 
        The CustomerForm was previously built to trigger itself via button. 
        Since we want to trigger it from the 'Quick Action' button above, 
        we ensure the component can be controlled.
      */}
      <CustomerForm
        onSuccess={() => {
          refetch();
          setIsCustomerModalOpen(false);
        }}
        controlledOpen={isCustomerModalOpen}
        onOpenChangeAction={setIsCustomerModalOpen}
      />
    </DashboardShell>
  );
}

function StatsSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-none border-2" />
      ))}
    </>
  );
}
