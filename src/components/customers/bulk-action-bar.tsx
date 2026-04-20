"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { ClearSelection } from "@/lib/redux/slices/customer-selection-slice";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios-client";
import { Product } from "@/types";
import { BulkPaymentDialog } from "./bulk-payment-dialog";

interface BulkActionBarProps {
  selectedCount: number;
}

export function BulkActionBar({ selectedCount }: BulkActionBarProps) {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.customerSelection.selectedIds);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Fetch products so the agent can choose what to bill the group for
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/agent/products");
      return res.data;
    },
  });

  return (
    <>
      <div className="fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between border-4 border-primary bg-background p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_oklch(0.922_0_0)] md:bottom-8 md:left-72 md:right-8">
        <div className="flex flex-col font-mono">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground underline decoration-primary underline-offset-4">
            Batch_Active
          </span>
          <span className="text-sm font-black uppercase tracking-tighter">
            {selectedCount} Selected
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => dispatch(ClearSelection())}
            className="rounded-none border-2 h-10 px-3 font-mono text-[10px] uppercase font-bold"
          >
            <X className="mr-2 h-3 w-3" /> <span className="hidden md:inline">Clear</span>
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-none border-2 h-10 px-4 font-mono text-[10px] uppercase font-bold tracking-widest"
          >
            <Send className="mr-2 h-3 w-3" /> Bulk USSD
          </Button>
        </div>
      </div>

      <BulkPaymentDialog
        open={isDialogOpen}
        onOpenChangeAction={setIsDialogOpen}
        selectedIds={selectedIds}
        products={products || []}
      />
    </>
  );
}
