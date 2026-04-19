"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User as NextAuthUser } from "next-auth";
import { dashboardConfig } from "@/config/dashboard-config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserNav } from "./user-nav";
import * as Icons from "lucide-react";

interface SidebarProps {
  user: NextAuthUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-8 px-2">
        <span className="font-mono text-xl font-black uppercase tracking-tighter">
          Ascii_Pay
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {dashboardConfig.map((item) => {
          // Type-safe permission check using our extended User type
          if (item.permission && !user.permissions?.includes(item.permission)) {
            return null;
          }

          const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ElementType;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center border-2 border-transparent px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all",
                pathname === item.href
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-primary hover:bg-muted"
              )}
            >
              {IconComponent && <IconComponent className="mr-3 h-4 w-4" />}
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 border-t pt-4">
        <div className="flex items-center justify-between px-2">
          <span className="font-mono text-[10px] uppercase text-muted-foreground">Appearance</span>
          <ThemeToggle />
        </div>
        <UserNav user={user} />
      </div>
    </div>
  );
}
