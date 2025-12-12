"use client";

import { useEffect, useState } from "react";
import { SimplePool } from "nostr-tools";
import { Network, Terminal } from "lucide-react";

// 1. RELAYS: The servers we ask for data
const RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.primal.net",
  "wss://nos.lol",
];

// 2. PUBKEY: Use yours! (This is Jack Dorsey's hex for testing)
// Convert your npub to hex here: https://nostrcheck.me/converter/
const MY_PUBKEY =
  "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2";

export default function NostrFeed() {
  const [content, setContent] = useState<string>("Scanning relays...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pool = new SimplePool();
    let isMounted = true;

    const fetchNostr = async () => {
      try {
        // Query for the latest Kind 1 (Text Note)
        const event = await pool.get(RELAYS, {
          authors: [MY_PUBKEY],
          kinds: [1],
        });

        if (isMounted && event) {
          setContent(event.content);
        } else if (isMounted) {
          setContent("No recent notes found.");
        }
      } catch (err) {
        console.error("Nostr Error:", err);
        if (isMounted) setContent("Relay connection failed.");
      } finally {
        if (isMounted) setLoading(false);
        // pool.close(RELAYS); // Cleanup connection
      }
    };

    fetchNostr();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full w-full bg-purple-900/10 border border-purple-500/20 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative Background */}
      <div className="absolute -right-4 -top-4 text-purple-500/10 group-hover:text-purple-500/20 transition-all duration-500">
        <Network size={100} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-2 h-2 rounded-full ${
              loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <span className="text-xs font-mono text-purple-300 uppercase tracking-widest">
            {loading ? "Connecting..." : "Nostr Network"}
          </span>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-neutral-300 font-mono leading-relaxed line-clamp-3">
            {content}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] text-purple-400/60 font-mono">
        <Terminal size={12} />
        <span>Signed via Schnorr</span>
      </div>
    </div>
  );
}
