import { SiteHeader } from "@/components/marketing/site-header";
import { MetricCard, FeatureItem } from "@/components/marketing/landing-sections";
import { Button } from "@/components/ui/button";
import { Zap, Users, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="container px-4 md:px-8 pt-20 pb-16">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex border-2 border-primary bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-primary-foreground">
              Now Live in Ethiopia
            </div>
            <h1 className="font-mono text-5xl font-black uppercase tracking-tighter md:text-8xl leading-[0.9]">
              Hard Cash <br />
              Meet <span className="text-muted-foreground underline decoration-primary underline-offset-8">Soft Data</span>
            </h1>
            <p className="max-w-2xl font-mono text-lg text-muted-foreground leading-relaxed">
              Empowering rural agents to collect payments digitally. Send USSD push requests to any phone, collect from Telebirr or Banks, and track everything in real-time.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signin">
                <Button size="lg" className="h-16 px-10 font-mono text-sm uppercase tracking-[0.2em] rounded-none border-2">
                  Launch Agent Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="container px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Coverage"
              value="98%"
              description="Functional across all Ethio-Telecom & Safaricom regions."
            />
            <MetricCard
              label="Processing"
              value="2.4s"
              description="Average time for USSD push delivery to rural devices."
            />
            <MetricCard
              label="Settlement"
              value="INSTANT"
              description="Immediate ledger updates for agent wallet balances."
            />
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="container px-4 md:px-8 py-20 border-t border-dashed">
          <div className="mb-12">
            <h2 className="font-mono text-3xl font-bold uppercase tracking-tighter">Core Capabilities</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureItem
              icon={Zap}
              title="USSD Push"
              description="Initiate payments from your dashboard that trigger a PIN prompt on the customer's phone."
            />
            <FeatureItem
              icon={Users}
              title="Agent CRM"
              description="Manage recurring rural customers with saved phone numbers and historical billing data."
            />
            <FeatureItem
              icon={Smartphone}
              title="Bulk Billing"
              description="Send automated payment requests to hundreds of customers in one click."
            />
            <FeatureItem
              icon={ShieldCheck}
              title="Safe Settle"
              description="Direct integration with Telebirr and local wallets ensures zero-trust security."
            />
          </div>
        </section>

        {/* HOW IT WORKS / USSD SIMULATOR */}
        <section className="container px-4 md:px-8 py-20 bg-muted/30 border-y">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-mono text-4xl font-bold uppercase tracking-tighter leading-none">
                Simple for Agents. <br /> Effortless for Clients.
              </h2>
              <ul className="space-y-4 font-mono text-sm uppercase tracking-wide">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center border-2 border-primary font-bold">1</span>
                  Select customer from your directory
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center border-2 border-primary font-bold">2</span>
                  Send automated payment request
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center border-2 border-primary font-bold">3</span>
                  Customer approves via USSD on their phone
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center border-2 border-primary font-bold">4</span>
                  Funds settle in your Agency account
                </li>
              </ul>
            </div>

            {/* VIRTUAL PHONE PREVIEW */}
            <div className="relative mx-auto w-full max-w-[300px] border-[6px] border-primary p-4 bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between font-mono text-[8px] mb-8 uppercase">
                <span>Ethio Telecom</span>
                <span>12:45 PM</span>
              </div>
              <div className="border-2 border-primary p-4 space-y-4">
                <p className="font-mono text-xs font-bold leading-tight uppercase">
                  Ascii Pay Request:
                  Abebe Hub requests 250 ETB for Fertilizer.
                </p>
                <div className="space-y-1 font-mono text-[10px] uppercase">
                  <p>1. Confirm Payment</p>
                  <p>2. View Details</p>
                  <p>3. Decline</p>
                </div>
              </div>
              <div className="mt-8 border-t-2 pt-4">
                <div className="h-1 w-12 bg-primary mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container px-4 md:px-8 py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
          <div className="space-y-4">
            <span className="font-mono text-xl font-bold tracking-tighter uppercase">Ascii_Pay</span>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed text-muted-foreground">
              A fintech experiment bridge digital infrastructure with rural accessibility requirements.
            </p>
          </div>
          <div className="flex gap-12 font-mono text-[10px] uppercase tracking-widest">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-foreground">Platform</span>
              <Link href="/signin">Dashboard</Link>
              <Link href="/">Agents</Link>
              <Link href="/">API</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-foreground">Legal</span>
              <Link href="/">Privacy</Link>
              <Link href="/">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
