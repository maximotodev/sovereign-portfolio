import { Icons } from "@/components/Icons";
import TipModal from "@/components/TipModal";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo / Name */}
        <div className="font-bold tracking-tight text-lg md:text-xl select-none truncate">
          MAXIMOTO<span className="text-orange-500">.DEV</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* GitHub Link: Hidden on small mobile, visible on tablet+ */}
          <a
            href="https://github.com/maximotodev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <Icons.gitHub className="h-4 w-4" />
            <span>GITHUB</span>
          </a>

          <span className="hidden sm:inline text-neutral-800">|</span>

          {/* Node Status: Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-mono text-green-500">
              NODE ONLINE
            </span>
          </div>

          <span className="hidden md:inline text-neutral-800">|</span>

          {/* Tip Button: Visible everywhere */}
          <TipModal>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white border-none font-bold text-xs md:text-sm px-3 md:px-4"
            >
              Tip Sats
            </Button>
          </TipModal>
        </div>
      </div>
    </header>
  );
}
