"use client";

import { Product } from "@/types";
import { ProductForm } from "./product-form";
import { Trash2 } from "lucide-react";
import apiClient from "@/lib/axios-client";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  async function DeleteProduct() {
    if (!confirm("Delete this product?")) return;

    try {
      await apiClient.delete(`/agent/products/${product.id}`);
      toast.success("Product deleted");
      onUpdate();
    } catch {
      toast.error("Failed to delete product");
    }
  }

  return (
    <div className="group flex flex-col justify-between border-2 border-primary bg-card p-4 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <div>
        <div className="mb-2 flex items-start justify-between">
          <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
            Service
          </span>
          <button onClick={DeleteProduct} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
        <h3 className="font-mono text-sm font-bold uppercase tracking-tighter line-clamp-2">
          {product.name}
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="font-mono text-xs font-black">
          {product.price.toLocaleString()} <span className="text-[10px]">ETB</span>
        </span>
        <ProductForm product={product} onSuccess={onUpdate} />
      </div>
    </div>
  );
}
