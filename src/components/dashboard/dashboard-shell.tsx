import * as React from "react";
import { cn } from "@/lib/utils";

type DashboardShellProps = React.HTMLAttributes<HTMLDivElement>;

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div
      className={cn("grid items-start gap-8 pb-20 md:pb-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-2 md:flex-row md:items-center md:justify-between">
      <div className="grid gap-1">
        <h1 className="font-mono text-2xl font-bold tracking-tighter uppercase md:text-3xl">
          {heading}
        </h1>
        {text && (
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-tight">
            {text}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
