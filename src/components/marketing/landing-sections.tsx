import { LucideIcon } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  description: string;
}

export function MetricCard({ label, value, description }: MetricProps) {
  return (
    <div className="border-2 p-6 flex flex-col gap-2 bg-card">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <span className="font-mono text-4xl font-black tracking-tighter">{value}</span>
      <p className="font-mono text-xs uppercase leading-tight text-muted-foreground">{description}</p>
    </div>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureItem({ title, description, icon: Icon }: FeatureProps) {
  return (
    <div className="group relative border-2 p-8 transition-all hover:bg-primary hover:text-primary-foreground">
      <Icon className="mb-4 h-8 w-8 transition-transform group-hover:scale-110" />
      <h3 className="font-mono text-lg font-bold uppercase tracking-tight mb-2">{title}</h3>
      <p className="font-mono text-sm leading-relaxed opacity-80">{description}</p>
    </div>
  );
}
