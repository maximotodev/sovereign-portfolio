import { BentoGrid, BentoItem } from "@/components/BentoGrid";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Bitcoin,
  Terminal,
  Network,
  Code2,
  Server,
  Shield,
} from "lucide-react";
import { Icons } from "@/components/Icons";
import AIChat from "@/components/AIChat";
import NostrFeed from "@/components/NostrFeed";
import NodeStatus from "@/components/NodeStatus";
import TipModal from "@/components/TipModal";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="font-bold tracking-tight text-xl">
            MAXIMOTO<span className="text-orange-500">.DEV</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
            >
              {/* Use Icons.gitHub instead of Github */}
              <Icons.gitHub className="mr-2 h-4 w-4" /> GitHub
            </Button>
            <TipModal>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white border-none">
                <Bitcoin className="mr-2 h-4 w-4" /> Tip Sats
              </Button>
            </TipModal>
          </div>
        </div>
      </header>

      <div className="p-8 pt-12">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            SOVEREIGN <br /> ARCHITECTURE.
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
            Full Stack Engineer building censorship-resistant applications on
            Bitcoin, Lightning, and Nostr.
          </p>
          <div className="flex gap-4 mt-8">
            <TipModal>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 rounded-lg">
                <Bitcoin className="mr-2 h-5 w-5" /> Lightning Tip
              </Button>
            </TipModal>
            <Button
              variant="outline"
              className="border-neutral-700 text-black hover:bg-neutral-800 px-8 py-6 rounded-lg"
            >
              {/* Use Icons.gitHub instead of Github */}
              <Icons.gitHub className="mr-2 h-5 w-5" /> View Code
            </Button>
          </div>
        </div>

        {/* The Grid */}
        <BentoGrid>
          {/* 1. AI Assistant (Tall Item) */}
          <BentoItem
            title="Interactive Resume"
            description="Ask the AI about my skills, experience, and projects."
            header={
              <div className="h-full min-h-[400px] w-full">
                <AIChat />
              </div>
            }
            className="md:col-span-2 md:row-span-2 bg-transparent border-none p-0 shadow-none hover:shadow-none hover:translate-y-0"
            icon={<Cpu className="h-4 w-4 text-neutral-500" />}
          />

          {/* 2. Node Status */}
          <BentoItem
            title="RaspiBlitz Full Node"
            description="Self-hosted infrastructure validating the Bitcoin blockchain."
            // NEW: Live Component
            header={
              <div className="h-full w-full">
                <NodeStatus />
              </div>
            }
            className="md:col-span-1"
            icon={<Server className="h-4 w-4 text-orange-500" />}
          />

          {/* 3. Nostr Identity */}
          <BentoItem
            title="Nostr Identity"
            description="Censorship-resistant social protocol."
            // NEW: Live Component
            header={
              <div className="h-full w-full">
                <NostrFeed />
              </div>
            }
            className="md:col-span-1"
            icon={<Shield className="h-4 w-4 text-purple-500" />}
          />

          {/* 4. Tech Stack */}
          <BentoItem
            title="Tech Stack"
            description="Next.js 15, TypeScript, Rust, Docker, Tailwind."
            header={
              <div className="h-24 w-full bg-neutral-800/50 rounded-lg animate-pulse" />
            }
            className="md:col-span-1"
            icon={<Code2 className="h-4 w-4 text-blue-500" />}
          />

          {/* 5. Recent Projects (Wide) */}
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
    </main>
  );
}
