"use client";

import * as React from "react";
import { Product } from "@/types";
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
import { useAppDispatch } from "@/hooks/use-redux";
import { ClearSelection } from "@/lib/redux/slices/customer-selection-slice";
import { Layers } from "lucide-react";

interface BulkPaymentDialogProps {
  selectedIds: string[];
  products: Product[];
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function BulkPaymentDialog({
  selectedIds,
  products,
  open,
  onOpenChangeAction,
}: BulkPaymentDialogProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function HandleBulkPush() {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      await apiClient.post("/agent/transactions/bulk", {
        customerIds: selectedIds,
        productId: selectedProduct.id,
        amount: selectedProduct.price,
      });

      toast.success("BULK_PUSH_INITIALIZED", {
        description: `Sent USSD requests to ${selectedIds.length} customers.`,
      });

      dispatch(ClearSelection());
      onOpenChangeAction(false);
    } catch (error) {
      toast.error("BULK_REQUEST_FAILED");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="rounded-none border-4 border-primary bg-background font-mono sm:max-w-[425px] p-0 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="bg-primary p-6 text-primary-foreground">
          <DialogTitle className="uppercase font-black text-xl flex items-center gap-2">
            <Layers className="h-5 w-5" /> Batch Process
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="border-2 border-primary p-4 bg-muted/20">
            <p className="text-[10px] font-bold uppercase opacity-60">Target Size</p>
            <p className="text-sm font-black uppercase">{selectedIds.length} Recipients</p>
          </div>

          <div className="grid gap-3">
            <Label className="text-[10px] font-bold uppercase">Select Service to Bill</Label>
            <Select onValueChange={setSelectedProductId}>
              <SelectTrigger className="rounded-none border-2 border-primary h-12">
                <SelectValue placeholder="CHOOSE PRODUCT..." />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-primary font-mono uppercase">
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.price} ETB)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            disabled={isLoading || !selectedProductId}
            onClick={HandleBulkPush}
            className="w-full h-16 rounded-none border-2 border-primary bg-primary font-mono text-sm font-black uppercase tracking-[0.3em] transition-all active:translate-x-1 active:translate-y-1"
          >
            {isLoading ? "PROVISING QUEUE..." : "START BULK USSD"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
