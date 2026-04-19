"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import apiClient from "@/lib/axios-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["agent-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/agent/stats");
      return response.data;
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text={`Welcome back, ${stats?.agencyName || "Agent"}`}
      />

      {/* 2-Column Grid for Mobile, 4-Column for Desktop */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <>
            <MetricCard
              label="Wallet Balance"
              value={`${stats.walletBalance.toLocaleString()} ETB`}
              description="Current available funds"
              trend="neutral"
            />
            <MetricCard
              label="Total Revenue"
              value={`${stats.totalRevenue.toLocaleString()} ETB`}
              description="Successfully processed"
              trend="up"
            />
            <MetricCard
              label="Customers"
              value={stats.totalCustomers}
              description="Recurring directory"
            />
            <MetricCard
              label="Services"
              value={stats.activeProducts}
              description="Active products"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border-2 p-6 bg-card">
          <h2 className="font-mono text-sm font-bold uppercase mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <button className="border-2 p-4 font-mono text-[10px] uppercase font-bold hover:bg-primary hover:text-primary-foreground transition-all">
              New Request
            </button>
            <button className="border-2 p-4 font-mono text-[10px] uppercase font-bold hover:bg-primary hover:text-primary-foreground transition-all">
              Add Customer
            </button>
          </div>
        </div>

        <div className="border-2 p-6 bg-card">
          <h2 className="font-mono text-sm font-bold uppercase mb-4">System Status</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs uppercase">USSD Gateway: Operational</span>
          </div>
        </div>
      </div>
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
