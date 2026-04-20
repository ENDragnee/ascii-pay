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
}

export function CustomerForm({ onSuccess }: CustomerFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  async function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      defaultAmount: formData.get("defaultAmount"),
    };

    try {
      await apiClient.post("/agent/customers", data);
      toast.success("CUSTOMER ADDED", {
        description: `${data.name} is now in your directory.`,
      });
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("ERROR", { description: "Failed to save customer." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-none border-2 font-mono text-[10px] uppercase tracking-widest h-10 px-4">
          <UserPlus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none border-4 border-primary bg-background font-mono sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="bg-primary p-6 text-primary-foreground">
          <DialogTitle className="uppercase tracking-tighter font-black text-xl flex items-center gap-2">
            <Plus className="h-5 w-5" /> New Entry
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={HandleSubmit} className="grid gap-6 p-6">
          <div className="grid gap-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest">Full Name</Label>
            <Input name="name" placeholder="KEBEDE KASAHUN" required className="rounded-none border-2 h-12" />
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest">Phone (e.g. 0911...)</Label>
            <Input name="phone" placeholder="0911223344" required className="rounded-none border-2 h-12" />
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest">Default Bill (Optional)</Label>
            <Input name="defaultAmount" type="number" placeholder="150" className="rounded-none border-2 h-12" />
          </div>
          <Button disabled={isLoading} className="rounded-none border-2 h-14 uppercase font-black tracking-[0.2em] mt-2">
            {isLoading ? "Writing to Ledger..." : "Save to Directory"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
