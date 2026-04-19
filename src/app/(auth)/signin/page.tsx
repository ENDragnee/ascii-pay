import { UserAuthForm } from "@/components/auth/user-auth-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center p-4">
      {/* Top Right Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2 md:top-8 md:right-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px]">
        <div className="flex flex-col space-y-3 text-center">
          <div className="mx-auto border-4 border-primary bg-primary p-2 text-primary-foreground mb-2">
            <span className="font-mono text-2xl font-black uppercase tracking-tighter">Ascii</span>
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tighter uppercase md:text-4xl">
            Agent Access
          </h1>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Authorized Personnel Only — Secure Terminal
          </p>
        </div>

        <div className="border-3 border-primary bg-card p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_oklch(0.922_0_0)]">
          <UserAuthForm />
        </div>

        <div className="flex flex-col gap-4 px-8 text-center">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-tighter leading-relaxed">
            Trouble logging in? Contact your <br />
            <span className="text-primary underline underline-offset-2">Regional Agency Supervisor</span>
          </p>
        </div>
      </div>
    </div>
  );
}
