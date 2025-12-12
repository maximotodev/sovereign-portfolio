import { Icons } from "@/components/Icons";
import TipModal from "@/components/TipModal";
import { Button } from "@/components/ui/button";
import { Bitcoin } from "lucide-react";

export function Hero() {
  return (
    <div className="max-w-7xl mx-auto mb-16 pt-8 md:pt-12 px-2">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-600 bg-clip-text text-transparent">
        SOVEREIGN <br /> ARCHITECTURE.
      </h1>
      <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
        Full Stack Engineer building censorship-resistant applications on
        Bitcoin, Lightning, and Nostr.
      </p>

      <div className="flex flex-wrap gap-4 mt-8">
        <TipModal>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 rounded-lg text-lg">
            <Bitcoin className="mr-2 h-5 w-5" /> Lightning Tip
          </Button>
        </TipModal>

        {/* 2. UPDATED LINK: Source Code Link */}
        <a
          href="https://github.com/maximotodev/sovereign-portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-orange-400 px-8 py-6 rounded-lg text-lg"
          >
            <Icons.gitHub className="mr-2 h-5 w-5" /> Source Code
          </Button>
        </a>
      </div>
    </div>
  );
}
