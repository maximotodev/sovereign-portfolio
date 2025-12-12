import { Metadata } from "next";
import { BentoGrid, BentoItem } from "@/components/BentoGrid";
import { Cpu, Server, Shield, Code2, Terminal } from "lucide-react";
import AIChat from "@/components/AIChat";
import NostrFeed from "@/components/NostrFeed";
import NodeStatus from "@/components/NodeStatus";

// New Component Imports
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";

// 3. OPTIMIZATION: Metadata for SEO
export const metadata: Metadata = {
  title: "הַלְּלוּ יָהּ | Sovereign Engineer",
  description:
    "Full Stack Portfolio featuring Bitcoin, Nostr, and AI integrations.",
  openGraph: {
    title: "Maximoto.dev",
    description: "Building sovereign infrastructure.",
    type: "website",
    // images: ['/og-image.png'], // Add an image to your public folder later
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* 1. Refactored Header */}
      <Header />

      <div className="p-6 md:p-8">
        {/* 2. Refactored Hero */}
        <Hero />

        {/* The Grid (Kept logic here for now as it holds the main widgets) */}
        <BentoGrid>
          {/* AI Assistant */}
          <BentoItem
            title="Interactive Resume"
            description="Ask the Llama-3 AI about my skills and experience."
            header={
              <div className="h-full min-h-[400px] w-full">
                <AIChat />
              </div>
            }
            className="md:col-span-2 md:row-span-2 bg-transparent border-none p-0 shadow-none hover:shadow-none hover:translate-y-0"
            icon={<Cpu className="h-4 w-4 text-neutral-500" />}
          />

          {/* Node Status */}
          <BentoItem
            title="RaspiBlitz Node"
            description="Live Mainnet data."
            header={
              <div className="h-full w-full">
                <NodeStatus />
              </div>
            }
            className="md:col-span-1"
            icon={<Server className="h-4 w-4 text-orange-500" />}
          />

          {/* Nostr Identity */}
          <BentoItem
            title="Nostr Identity"
            description="Censorship-resistant notes."
            header={
              <div className="h-full w-full">
                <NostrFeed />
              </div>
            }
            className="md:col-span-1"
            icon={<Shield className="h-4 w-4 text-purple-500" />}
          />

          {/* Tech Stack */}
          <BentoItem
            title="Tech Stack"
            description="Next.js 16, TypeScript, Rust, Docker, Tailwind."
            header={
              <div className="h-24 w-full bg-neutral-800/50 rounded-lg animate-pulse" />
            }
            className="md:col-span-1"
            icon={<Code2 className="h-4 w-4 text-blue-500" />}
          />

          {/* Recent Projects */}
          <BentoItem
            title="Latest Project: LN-Visualizer"
            description="Real-time visualization of Lightning Network gossip traffic using Rust and WebSocket."
            header={
              <div className="h-40 w-full bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg border border-neutral-700" />
            }
            className="md:col-span-3"
            icon={<Terminal className="h-4 w-4 text-green-500" />}
          />
        </BentoGrid>
      </div>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-neutral-600 text-xs font-mono">
        <p>BUILT WITH NEXT.JS • BITCOIN • NOSTR</p>
      </footer>
    </main>
  );
}
