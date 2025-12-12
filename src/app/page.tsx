import { Metadata } from "next";
import { BentoGrid, BentoItem } from "@/components/BentoGrid";
import { Cpu, Server, Shield, Code2 } from "lucide-react";
import AIChat from "@/components/AIChat";
import NostrFeed from "@/components/NostrFeed";
import NodeStatus from "@/components/NodeStatus";
import TechCloud from "@/components/TechCloud"; // Ensure this is imported

// Layout & Sections
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { BlogPreview } from "@/components/sections/BlogPreview";

export const metadata: Metadata = {
  title: "Maximoto | Sovereign Engineer",
  description:
    "Full Stack Portfolio featuring Bitcoin, Nostr, and AI integrations.",
  openGraph: {
    title: "Maximoto.dev",
    description: "Building sovereign infrastructure.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* 1. Header (Sticky) */}
      <Header />

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-24 pb-20">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. The Live Dashboard (Bento Grid) */}
        <section id="dashboard" className="scroll-mt-24">
          <h2 className="text-xl font-mono text-neutral-500 mb-6 uppercase tracking-widest pl-2 border-l-2 border-orange-500">
            System Status
          </h2>

          <BentoGrid>
            {/* AI Assistant (Main Focus) */}
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

            {/* Tech Stack (Moved to bottom wide slot to replace the removed Project card) */}
            <BentoItem
              title="Full Stack Arsenal"
              description="Next.js 16, TypeScript, Rust, Docker, Tailwind."
              // Made taller for better 3D visibility
              header={
                <div className="h-full min-h-[250px] w-full flex items-center justify-center overflow-hidden">
                  <TechCloud />
                </div>
              }
              className="md:col-span-3 bg-neutral-900/50"
              icon={<Code2 className="h-4 w-4 text-blue-500" />}
            />
          </BentoGrid>
        </section>

        {/* 4. Projects Showcase (Divider added) */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

        <div id="projects" className="scroll-mt-24">
          <Projects />
        </div>

        {/* 5. Knowledge & Proof (Grid Layout) */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

        <div id="blog" className="grid lg:grid-cols-3 gap-12">
          {/* Blog takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <BlogPreview />
          </div>

          {/* Certs take 1/3 width on large screens (Sidebar style) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Certifications />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-900 text-center text-neutral-600 text-xs font-mono">
        <p>BUILT WITH NEXT.JS • BITCOIN • NOSTR</p>
        <p className="mt-2">SOVEREIGN ARCHITECTURE</p>
      </footer>
    </main>
  );
}
