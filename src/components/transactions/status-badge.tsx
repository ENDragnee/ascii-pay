import { TransactionStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const Styles: Record<TransactionStatus, string> = {
    PENDING: "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10",
    PROCESSING: "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-500/10 animate-pulse",
    SUCCESS: "border-green-600 text-green-700 bg-green-50 dark:bg-green-600/10",
    FAILED: "border-red-600 text-red-700 bg-red-50 dark:bg-red-600/10",
  };

  return (
    <div className={cn(
      "inline-flex items-center border-2 px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-widest",
      Styles[status]
    )}>
      {status}
    </div>
  );
}
