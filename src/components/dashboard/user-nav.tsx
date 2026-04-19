"use client";

import { signOut } from "next-auth/react";
import type { User as NextAuthUser } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";

interface UserNavProps {
  user: NextAuthUser;
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-full justify-start rounded-none border-2 border-primary px-2 font-mono transition-all hover:bg-accent"
        >
          <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="ml-3 flex flex-col items-start text-left overflow-hidden">
            <p className="text-[10px] font-bold leading-none uppercase truncate w-full">
              {user.name || "Agent User"}
            </p>
            <p className="text-[8px] leading-none text-muted-foreground uppercase mt-1">
              Terminal ID: {user.id.slice(-6)}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-none border-2 border-primary font-mono uppercase" align="end" forceMount>
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground">
          {user.email}
        </div>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-[10px] font-bold">Terminate Session</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
