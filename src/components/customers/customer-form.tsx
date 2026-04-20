"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus } from "lucide-react";
import apiClient from "@/lib/axios-client";
import { toast } from "sonner";

interface CustomerFormProps {
  onSuccess: () => void;
  controlledOpen?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
}

export function CustomerForm({
  onSuccess,
  controlledOpen,
  onOpenChangeAction
}: CustomerFormProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Determine if the component is being controlled by a parent or using internal state
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const SetOpen = (val: boolean) => {
    if (isControlled && onOpenChangeAction) {
      onOpenChangeAction(val);
    } else {
      setInternalOpen(val);
    }
  };

  async function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      defaultAmount: formData.get("defaultAmount")
        ? parseFloat(formData.get("defaultAmount") as string)
        : null,
    };

    try {
      await apiClient.post("/agent/customers", payload);
      toast.success("CUSTOMER_REGISTERED", {
        description: `${payload.name} added to secure ledger.`,
      });

      SetOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("REGISTRATION_FAILED", {
        description: "Verify network connection or phone unique constraint."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={SetOpen}>
      {/* 
          Only show the trigger button if the component is NOT controlled. 
          On the dashboard, the 'Quick Action' button acts as the trigger.
      */}
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="rounded-none border-2 font-mono text-[10px] uppercase tracking-widest h-10 px-4">
            <UserPlus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="rounded-none border-4 border-primary bg-background font-mono sm:max-w-[425px] p-0 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="bg-primary p-6 text-primary-foreground">
          <DialogTitle className="uppercase font-black text-xl flex items-center gap-2 tracking-tighter">
            <Plus className="h-5 w-5" /> New Entry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={HandleSubmit} className="grid gap-6 p-6">
          <div className="grid gap-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest">
              Full Name
            </Label>
            <Input
              name="name"
              placeholder="KEBEDE KASAHUN"
              required
              disabled={isLoading}
              className="rounded-none border-2 h-12 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest">
              Mobile Number (09/07...)
            </Label>
            <Input
              name="phone"
              placeholder="0911223344"
              required
              disabled={isLoading}
              className="rounded-none border-2 h-12 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest">
              Standard Billing (Optional)
            </Label>
            <Input
              name="defaultAmount"
              type="number"
              placeholder="150"
              disabled={isLoading}
              className="rounded-none border-2 h-12 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-none border-2 h-14 uppercase font-black tracking-[0.2em] mt-2 transition-all active:translate-x-1 active:translate-y-1"
          >
            {isLoading ? "Writing_Data..." : "Commit to Directory"}
          </Button>

          <p className="text-[8px] text-center uppercase opacity-50 font-bold">
            Secure Agency Entry Terminal
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
