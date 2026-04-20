"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer, Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/axios-client";
import { toast } from "sonner";
import { SendHorizontal, User, Package } from "lucide-react";

interface GlobalPaymentDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function GlobalPaymentDialog({ open, onOpenChangeAction }: GlobalPaymentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => (await apiClient.get("/agent/customers")).data,
    enabled: open,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => (await apiClient.get("/agent/products")).data,
    enabled: open,
  });

  const customer = customers?.find((c) => c.id === selectedCustomerId);
  const product = products?.find((p) => p.id === selectedProductId);
  const amount = product?.price ?? customer?.defaultAmount ?? 0;

  async function HandleSubmit() {
    if (!selectedCustomerId) return toast.error("SELECT_CUSTOMER");

    setIsLoading(true);
    try {
      await apiClient.post("/agent/transactions", {
        customerId: selectedCustomerId,
        productId: selectedProductId || null,
        amount,
      });
      toast.success("USSD_PUSH_SENT");
      onOpenChangeAction(false);
      setSelectedCustomerId("");
      setSelectedProductId("");
    } catch {
      toast.error("PUSH_FAILED");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="rounded-none border-4 border-primary bg-background font-mono p-0 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="bg-primary p-6 text-primary-foreground">
          <DialogTitle className="uppercase font-black text-xl tracking-tighter flex items-center gap-2">
            <SendHorizontal className="h-5 w-5" /> Quick Dispatch
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="grid gap-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <User className="h-3 w-3" /> 1. Select Recipient
            </Label>
            <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
              <SelectTrigger className="rounded-none border-2 border-primary h-12 uppercase text-[10px] font-bold">
                <SelectValue placeholder="SEARCH CUSTOMERS..." />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-primary font-mono uppercase">
                {customers?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Package className="h-3 w-3" /> 2. Select Service
            </Label>
            <Select onValueChange={setSelectedProductId} value={selectedProductId}>
              <SelectTrigger className="rounded-none border-2 border-primary h-12 uppercase text-[10px] font-bold">
                <SelectValue placeholder="CHOOSE PRODUCT..." />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-primary font-mono uppercase">
                {products?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} - {p.price} ETB</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t-2 border-dashed pt-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase">Total Charge:</span>
            <span className="text-2xl font-black">{amount.toLocaleString()} ETB</span>
          </div>

          <Button
            disabled={isLoading || !selectedCustomerId || amount <= 0}
            onClick={HandleSubmit}
            className="w-full h-14 rounded-none border-2 border-primary bg-primary font-mono text-sm font-black uppercase tracking-[0.2em]"
          >
            {isLoading ? "PUSHING..." : "SEND USSD NOW"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
