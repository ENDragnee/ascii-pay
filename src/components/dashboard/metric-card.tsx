import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ label, value, description, trend }: MetricCardProps) {
  return (
    <div className="group border-2 border-primary bg-card p-4 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <h3 className="mt-2 font-mono text-xl font-black tracking-tighter md:text-2xl">
        {value}
      </h3>
      {description && (
        <p className="mt-1 font-mono text-[8px] uppercase leading-none text-muted-foreground">
          {description}
        </p>
      )}
      {trend && (
        <div className={cn(
          "mt-2 h-1 w-full",
          trend === "up" ? "bg-green-500" : trend === "down" ? "bg-red-500" : "bg-muted"
        )} />
      )}
    </div>
  );
}
