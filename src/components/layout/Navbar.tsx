"use client";

import { Home, Cpu, FolderGit2, MessageSquare, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", icon: Home, id: "hero" },
  { name: "System", icon: Cpu, id: "command-center" },
  { name: "Work", icon: FolderGit2, id: "work" },
  { name: "Guestbook", icon: MessageSquare, id: "guestbook" },
];

export function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 rounded-full border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => scrollTo(item.id)}
            className="group relative p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.name}
            </span>
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-2" />
        <div className="px-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase">
            Online
          </span>
        </div>
      </div>
    </div>
  );
}
