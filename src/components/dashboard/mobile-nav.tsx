"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User as NextAuthUser } from "next-auth";
import { dashboardConfig } from "@/config/dashboard-config";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import * as Icons from "lucide-react";

interface MobileNavProps {
  user: NextAuthUser;
}

/**
 * MobileTopNav: Top bar for mobile view
 */
export function MobileTopNav({ user }: MobileNavProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="font-mono text-lg font-black uppercase tracking-tighter">
        Ascii_Pay
      </span>
      <div className="scale-90">
        <UserNav user={user} />
      </div>
    </div>
  );
}

/**
 * MobileBottomBar: Persistent bottom navigation
 */
export function MobileBottomBar({ user }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-16 items-center justify-around px-2">
      {dashboardConfig.slice(0, 4).map((item) => {
        if (item.permission && !user.permissions?.includes(item.permission)) {
          return null;
        }

        const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ElementType;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {IconComponent && <IconComponent className="h-5 w-5" />}
            <span className="font-mono text-[8px] font-bold uppercase tracking-tighter">
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
