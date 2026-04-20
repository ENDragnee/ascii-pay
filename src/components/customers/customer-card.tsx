"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { ToggleSelection } from "@/lib/redux/slices/customer-selection-slice";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Customer, Product } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, SendHorizontal, Edit } from "lucide-react";
import apiClient from "@/lib/axios-client";
import { toast } from "sonner";
import { InitiatePaymentDialog } from "../transactions/initiate-payment-dialog";
import { useQuery } from "@tanstack/react-query";

interface CustomerCardProps {
  customer: Customer;
  onUpdateAction: () => void;
}

export function CustomerCard({ customer, onUpdateAction }: CustomerCardProps) {
  const [payDialogOpen, setPayDialogOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.customerSelection.selectedIds);
  const isSelected = selectedIds.includes(customer.id);

  // Fetch products for the dropdown in the payment dialog
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/agent/products");
      return res.data;
    }
  });

  async function DeleteCustomer(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Remove customer?")) return;
    try {
      await apiClient.delete(`/agent/customers/${customer.id}`);
      toast.success("CUSTOMER REMOVED");
      onUpdateAction();
    } catch {
      toast.error("DELETE FAILED");
    }
  }

  return (
    <>
      <div
        onClick={() => dispatch(ToggleSelection(customer.id))}
        className={cn(
          "group flex flex-col justify-between cursor-pointer border-2 p-4 transition-all font-mono min-h-[160px]",
          isSelected
            ? "border-primary bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]"
            : "border-muted bg-card hover:border-primary"
        )}
      >
        <div className="flex items-start justify-between">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => dispatch(ToggleSelection(customer.id))}
            className={cn("border-2 rounded-none", isSelected ? "border-background bg-background text-primary" : "border-primary")}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="opacity-60 hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-2 font-mono uppercase text-[10px]">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-3 w-3" /> Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={DeleteCustomer} className="text-destructive">
                <Trash2 className="mr-2 h-3 w-3" /> Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2">
          <h3 className="text-xs font-black uppercase tracking-tighter truncate">{customer.name}</h3>
          <p className="text-[10px] opacity-70 tracking-tighter">{customer.phone}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPayDialogOpen(true);
            }}
            className={cn(
              "flex-1 border-2 py-2 font-mono text-[9px] font-black uppercase tracking-widest transition-all",
              isSelected
                ? "border-background bg-background text-primary hover:bg-transparent hover:text-background"
                : "border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary"
            )}
          >
            <SendHorizontal className="mr-1 inline h-3 w-3" /> Collect
          </button>
        </div>
      </div>

      <InitiatePaymentDialog
        customer={customer}
        products={products || []}
        open={payDialogOpen}
        onOpenChangeAction={setPayDialogOpen}
      />
    </>
  );
}
