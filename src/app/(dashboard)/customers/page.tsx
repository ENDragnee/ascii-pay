"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { CustomerCard } from "@/components/customers/customer-card";
import { BulkActionBar } from "@/components/customers/bulk-action-bar";
import { CustomerForm } from "@/components/customers/customer-form";
import apiClient from "@/lib/axios-client";
import { useAppSelector } from "@/hooks/use-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/types"; // Imported Customer type

export default function CustomersPage() {
  const selectedIds = useAppSelector((state) => state.customerSelection.selectedIds);

  const { data: customers, isLoading, refetch } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await apiClient.get("/agent/customers");
      return response.data;
    },
  });

  return (
    <DashboardShell className="relative">
      <DashboardHeader
        heading="Directory"
        text="Recurring customers for your agency."
      >
        <CustomerForm onSuccess={refetch} />
      </DashboardHeader>

      {/* 2-Column Mobile Grid Rule */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full border-2 rounded-none" />
          ))
        ) : (
          customers?.map((customer: Customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onUpdateAction={refetch} // Fixed prop name to match component
            />
          ))
        )}
      </div>

      {/* Bulk Action Bar (Only shows when customers are selected) */}
      {selectedIds.length > 0 && <BulkActionBar selectedCount={selectedIds.length} />}
    </DashboardShell>
  );
}
