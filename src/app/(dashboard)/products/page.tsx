"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { ProductCard } from "@/components/products/product-card";
import { ProductForm } from "@/components/products/product-form";
import apiClient from "@/lib/axios-client";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const { data: products, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get("/agent/products");
      return response.data;
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Product Catalog"
        text="Define the services and goods you bill for via USSD."
      >
        <ProductForm onSuccess={refetch} />
      </DashboardHeader>

      {/* 2-Column Mobile Grid Rule Applied */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-none border-2" />
          ))
        ) : products?.length === 0 ? (
          <div className="col-span-full border-2 border-dashed p-12 text-center">
            <p className="font-mono text-xs uppercase text-muted-foreground">
              No products found. Add your first service above.
            </p>
          </div>
        ) : (
          products?.map((product) => (
            <ProductCard key={product.id} product={product} onUpdate={refetch} />
          ))
        )}
      </div>
    </DashboardShell>
  );
}
