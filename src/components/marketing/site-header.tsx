import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-mono text-xl font-bold tracking-tighter uppercase">
            Ascii_Pay
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/signin">
            <Button className="font-mono text-xs uppercase tracking-widest rounded-none border-2 h-10 px-6">
              Agent Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
