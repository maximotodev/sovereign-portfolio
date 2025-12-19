"use client";

import { Icons } from "@/components/Icons";
import TipModal from "@/components/TipModal";
import { Button } from "@/components/ui/button";
import { Bitcoin, ArrowRight, Terminal } from "lucide-react";

export default function IntroCard() {
  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div>
        <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-[10px] sm:text-xs font-medium text-orange-500 mb-4 backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
          SOVEREIGN WEB
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white leading-tight">
          Engineering <br />
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600 bg-clip-text text-transparent">
            Freedom.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed max-w-lg">
          We architect censorship-resistant infrastructure and intelligent
          agents. From Bitcoin consensus layers to self-hosted AI pipelines.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <TipModal>
            <Button className="h-10 px-6 bg-white text-black hover:bg-neutral-200 font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Bitcoin className="mr-2 h-4 w-4 text-orange-600" />
              Partner
            </Button>
          </TipModal>

          <a
            href="https://github.com/maximotodev/sovereign-portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="h-10 px-6 border-neutral-700 text-white hover:bg-neutral-800 text-sm group"
            >
              <Icons.gitHub className="mr-2 h-4 w-4 group-hover:text-white" />
              Code
              <ArrowRight className="ml-2 w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Button>
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono border-t border-neutral-800 pt-4">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            <span>Full Stack</span>
          </div>
          <div className="w-1 h-1 bg-neutral-700 rounded-full" />
          <div>Rust / TS / Python</div>
        </div>
      </div>
    </div>
  );
}
