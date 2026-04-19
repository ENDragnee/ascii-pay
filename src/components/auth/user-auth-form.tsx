"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function UserAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function OnSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };

    const result = await signIn("credentials", {
      email: target.email.value,
      password: target.password.value,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      return toast.error("ACCESS DENIED", {
        description: "Credentials do not match our records.",
      });
    }

    toast.success("ACCESS GRANTED", {
      description: "Initializing agent dashboard...",
    });

    router.push(searchParams.get("from") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="grid gap-8">
      <form onSubmit={OnSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label className="font-mono text-xs font-bold uppercase tracking-[0.2em]" htmlFor="email">
              Terminal ID (Email)
            </Label>
            <Input
              id="email"
              placeholder="agent@ascii.com"
              type="email"
              disabled={isLoading}
              required
              className="h-14 rounded-none border-2 border-primary bg-background px-4 font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="grid gap-3">
            <Label className="font-mono text-xs font-bold uppercase tracking-[0.2em]" htmlFor="password">
              Secure Key (Password)
            </Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              required
              className="h-14 rounded-none border-2 border-primary bg-background px-4 font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            disabled={isLoading}
            className="mt-2 h-16 rounded-none border-2 border-primary bg-primary font-mono text-sm font-bold uppercase tracking-[0.3em] text-primary-foreground hover:bg-background hover:text-primary transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isLoading ? "Validating..." : "Enter Terminal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
