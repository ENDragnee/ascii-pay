"use client";

import * as React from "react";
import { Product } from "@/types";
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
import { Plus, Edit2 } from "lucide-react";
import apiClient from "@/lib/axios-client";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  async function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      price: formData.get("price"),
    };

    try {
      if (product) {
        await apiClient.patch(`/agent/products/${product.id}`, data);
        toast.success("Product Updated");
      } else {
        await apiClient.post("/agent/products", data);
        toast.success("Product Created");
      }
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Operation failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none border">
            <Edit2 className="h-3 w-3" />
          </Button>
        ) : (
          <Button className="rounded-none border-2 font-mono text-[10px] uppercase tracking-widest">
            <Plus className="mr-2 h-3 w-3" /> Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-none border-4 border-primary bg-background font-mono sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-tighter font-black">
            {product ? "Edit Service" : "New Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={HandleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[10px] uppercase tracking-widest">Name</Label>
            <Input id="name" name="name" defaultValue={product?.name} required className="rounded-none border-2" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price" className="text-[10px] uppercase tracking-widest">Price (ETB)</Label>
            <Input id="price" name="price" type="number" defaultValue={product?.price} required className="rounded-none border-2" />
          </div>
          <Button disabled={isLoading} className="rounded-none border-2 uppercase font-bold tracking-[0.2em]">
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
