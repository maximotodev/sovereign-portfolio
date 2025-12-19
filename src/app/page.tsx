import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/hero/HeroSection";
import { CommandCenter } from "@/components/sections/dashboard/CommandCenter";
import { WorkSection } from "@/components/sections/work/WorkSection";
import Guestbook from "@/components/Guestbook";
import NostrFeed from "@/components/NostrFeed";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Maximoto | Sovereign Engineer",
  description:
    "Full Stack Portfolio featuring Bitcoin, Nostr, and AI integrations.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-orange-500 selection:text-white">
      {/* Navigation Layer */}
      <Header />
      <Navbar />

      {/* Act I: The Identity */}
      <HeroSection />

      {/* Act II: The System */}
      <div className="relative z-10 bg-neutral-950 shadow-2xl rounded-t-[3rem] border-t border-white/5 mt-[-50px]">
        <CommandCenter />

        {/* Act III: The Work */}
        <WorkSection />

        {/* Act IV: The Connection */}
        <section
          id="guestbook"
          className="py-24 max-w-7xl mx-auto px-6 scroll-mt-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Guestbook UI */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Public Square
                  </h2>
                  <p className="text-sm text-neutral-500 font-mono">
                    NOSTR PROTOCOL • NIP-07
                  </p>
                </div>
              </div>
              <Guestbook />
            </div>

            {/* Right: Nostr Feed & Context */}
            <div className="space-y-8">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  Why this matters
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  This guestbook is a demonstration of <b>Sovereign Data</b>.
                  When you sign a message here, you own it. It is
                  cryptographically signed by your keypair, not stored in a
                  siloed database.
                </p>
              </div>

              {/* Reuse Nostr Feed here as a "Live Updates" widget */}
              <div className="h-64">
                <NostrFeed />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-neutral-900 text-center">
          <div className="text-4xl font-bold tracking-tighter text-neutral-800 mb-4 select-none">
            MAXIMOTO
          </div>
          <p className="text-neutral-600 text-xs font-mono">
            SOVEREIGN ARCHITECTURE © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
