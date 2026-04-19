import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/provider/root-provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Ascii Pay",
  description: "Fintech solution for rural agent payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${jetbrainsMono.variable} font-mono antialiased min-h-screen bg-background text-foreground overflow-x-hidden`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
