import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileTopNav, MobileBottomBar } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <Sidebar user={session.user} />
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile Top Header */}
        <header className="flex h-16 items-center border-b px-4 md:hidden bg-card">
          <MobileTopNav user={session.user} />
        </header>

        <main className="flex-1 overflow-x-hidden bg-background p-4 md:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="sticky bottom-0 z-50 border-t bg-card md:hidden">
          <MobileBottomBar user={session.user} />
        </nav>
      </div>
    </div>
  );
}
