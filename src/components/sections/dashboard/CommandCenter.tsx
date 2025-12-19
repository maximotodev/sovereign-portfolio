import { BentoGrid, BentoItem } from "@/components/BentoGrid";
import AIChat from "@/components/AIChat";
import NodeStatus from "@/components/NodeStatus";
import TechCloud from "@/components/TechCloud";
import GithubMetrics from "@/components/GithubMetrics";
import { Cpu, Server, Code2, Activity } from "lucide-react";

export function CommandCenter() {
  return (
    <section id="command-center" className="py-24 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 border-l-2 border-orange-500 pl-6">
          <h2 className="text-3xl font-bold text-white mb-2">Command Center</h2>
          <p className="text-neutral-400">
            Live telemetry from my sovereign infrastructure.
          </p>
        </div>

        <BentoGrid>
          {/* 1. The Brain (AI) - Primary Focus */}
          <BentoItem
            title="Neural Interface (RAG)"
            description="Llama-3 model with access to my database."
            header={
              <div className="h-full min-h-[450px] w-full">
                <AIChat />
              </div>
            }
            className="md:col-span-2 md:row-span-2 bg-neutral-900/50"
            icon={<Cpu className="h-4 w-4 text-purple-500" />}
          />

          {/* 2. The Heartbeat (Node) */}
          <BentoItem
            title="Consensus Layer"
            description="RaspiBlitz Mainnet Node."
            header={
              <div className="h-full w-full">
                <NodeStatus />
              </div>
            }
            className="md:col-span-1"
            icon={<Server className="h-4 w-4 text-orange-500" />}
          />

          {/* 3. The Arsenal (Tech Cloud) */}
          <BentoItem
            title="Tech Arsenal"
            description="Languages & Frameworks."
            header={
              <div className="h-full min-h-[200px] flex items-center justify-center overflow-hidden">
                <TechCloud />
              </div>
            }
            className="md:col-span-1"
            icon={<Code2 className="h-4 w-4 text-blue-500" />}
          />

          {/* 4. The Output (GitHub) - Wide Bottom */}
          <BentoItem
            title="Engineering Velocity"
            description="Code shipping metrics."
            header={<GithubMetrics />}
            className="md:col-span-3 bg-neutral-900/50"
            icon={<Activity className="h-4 w-4 text-green-500" />}
          />
        </BentoGrid>
      </div>
    </section>
  );
}
