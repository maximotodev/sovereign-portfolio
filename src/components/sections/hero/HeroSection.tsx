import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-[80vh] flex flex-col justify-center items-center text-center relative overflow-hidden pt-20"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-600/20 rounded-[100%] blur-[120px] opacity-20 pointer-events-none" />

      <FadeIn>
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-xs font-mono text-orange-200 tracking-wider">
            MAXIMOTO LABS
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white max-w-4xl mx-auto leading-tight">
          Architecting <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            Sovereignty.
          </span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Full Stack Engineering meets Cypherpunk Philosophy. Building
          censorship-resistant infrastructure, AI agents, and Bitcoin consensus
          layers.
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest">
            Scroll to Initialize System
          </p>
          <ArrowDown className="w-4 h-4 text-neutral-600 animate-bounce" />
        </div>
      </FadeIn>
    </section>
  );
}
