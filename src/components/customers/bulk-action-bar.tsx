"use client";

import { useAppDispatch } from "@/hooks/use-redux";
import { ClearSelection } from "@/lib/redux/slices/customer-selection-slice";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
}

export function BulkActionBar({ selectedCount }: BulkActionBarProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center justify-between border-4 border-primary bg-background p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_oklch(0.922_0_0)] md:bottom-8 md:left-72 md:right-8">
      <div className="flex flex-col font-mono">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Selection Active</span>
        <span className="text-sm font-black uppercase tracking-tighter">
          {selectedCount} Customers Selected
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => dispatch(ClearSelection())}
          className="rounded-none border-2 h-10 px-3 md:px-6 font-mono text-[10px] uppercase font-bold"
        >
          <X className="mr-2 h-3 w-3" /> <span className="hidden md:inline">Cancel</span>
        </Button>
        <Button className="rounded-none border-2 h-10 px-4 md:px-8 font-mono text-[10px] uppercase font-bold tracking-widest">
          <Send className="mr-2 h-3 w-3" /> Bulk USSD Request
        </Button>
      </div>
    </div>
  );
}
