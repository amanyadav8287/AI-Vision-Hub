import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { MobileNavigation } from "./MobileNavigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream/40">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-24 md:pb-12">{children}</main>
      <MobileNavigation />
    </div>
  );
}
