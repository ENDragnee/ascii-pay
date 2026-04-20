"use client";

import * as React from "react";
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
import { SendHorizontal, Info } from "lucide-react";

interface InitiatePaymentDialogProps {
  customer: Customer;
  products: Product[];
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function InitiatePaymentDialog({
  customer,
  products,
  open,
  onOpenChangeAction,
}: InitiatePaymentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");

  // Logic to determine amount: Selected product price OR customer's default bill
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const finalAmount = selectedProduct?.price ?? customer.defaultAmount ?? 0;

  async function HandleSendRequest() {
    if (finalAmount <= 0) {
      toast.error("INVALID AMOUNT", { description: "Please select a product or set a default amount." });
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/agent/transactions", {
        customerId: customer.id,
        productId: selectedProductId || null,
        amount: finalAmount,
      });

      toast.success("USSD PUSH DISPATCHED", {
        description: `Request for ${finalAmount} ETB sent to ${customer.phone}`,
      });

      onOpenChangeAction(false);
    } catch (error) {
      toast.error("NETWORK ERROR", {
        description: "Failed to reach the USSD Gateway.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="p-0 rounded-none border-4 border-primary bg-background font-mono sm:max-w-[425px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_oklch(0.922_0_0)]">
        <DialogHeader className="bg-primary p-6 text-primary-foreground">
          <DialogTitle className="uppercase font-black text-2xl tracking-tighter flex items-center gap-2">
            <SendHorizontal className="h-6 w-6" />
            Push Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Recipient Snapshot */}
          <div className="border-2 border-primary p-4 bg-muted/20 relative">
            <div className="absolute -top-2 -right-2 bg-primary text-[8px] text-white px-2 py-0.5 font-bold uppercase tracking-widest">
              Recipient
            </div>
            <p className="text-sm font-black uppercase tracking-tight">{customer.name}</p>
            <p className="text-xs text-muted-foreground">{customer.phone}</p>
          </div>

          {/* Product Selection */}
          <div className="grid gap-3">
            <Label className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
              <Info className="h-3 w-3" /> Select Service/Bill
            </Label>
            <Select onValueChange={setSelectedProductId}>
              <SelectTrigger className="rounded-none border-2 border-primary h-12 font-bold uppercase text-[10px] tracking-widest">
                <SelectValue placeholder="CHOOSE SERVICE..." />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-primary font-mono uppercase text-[10px]">
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                    {p.name} — {p.price} ETB
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Final Review */}
          <div className="flex justify-between items-end border-t-2 border-dashed pt-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase text-muted-foreground">Total Charge</span>
              <span className="text-3xl font-black tracking-tighter">
                {finalAmount.toLocaleString()} <span className="text-xs">ETB</span>
              </span>
            </div>
          </div>

          <Button
            disabled={isLoading || finalAmount === 0}
            onClick={HandleSendRequest}
            className="w-full h-16 rounded-none border-2 border-primary bg-primary font-mono text-sm font-black uppercase tracking-[0.3em] text-primary-foreground hover:bg-background hover:text-primary transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isLoading ? "INITIATING..." : "DISPATCH USSD"}
          </Button>

          <p className="text-center text-[8px] uppercase tracking-tighter text-muted-foreground">
            Transaction will be logged as PENDING until customer approval.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
