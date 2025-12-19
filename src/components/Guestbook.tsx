"use client";

import { useEffect, useState, useRef } from "react";
import {
  Send,
  MessageSquare,
  User,
  Shield,
  Zap,
  Lock,
  Database,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SimplePool, nip19, getPublicKey, finalizeEvent } from "nostr-tools";

const RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.primal.net",
  "wss://nos.lol",
];

type Note = {
  id: number;
  content: string;
  created_at: string;
  username: string;
  avatar?: string; // New field
  pubkey?: string;
};

type AuthMode = "guest" | "extension" | "nsec";

export default function Guestbook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Identity State
  const [authMode, setAuthMode] = useState<AuthMode>("guest");
  const [displayName, setDisplayName] = useState("");
  const [nsec, setNsec] = useState("");
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    fetchMessages();
    setTimeout(() => {
      if ((window as any).nostr) setHasExtension(true);
    }, 1000);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/guestbook");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setNotes(data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // Helper: Fetch Name/Avatar from Nostr Relays
  const fetchNostrProfile = async (pubkey: string) => {
    const pool = new SimplePool();
    try {
      const event = await pool.get(RELAYS, {
        authors: [pubkey],
        kinds: [0], // Metadata Event
      });

      if (event) {
        const content = JSON.parse(event.content);
        return {
          name:
            content.name ||
            content.display_name ||
            content.nip05 ||
            "Nostr User",
          avatar: content.picture || content.image || null,
        };
      }
    } catch (e) {
      console.warn("Failed to fetch Nostr profile", e);
    }
    return { name: "Nostr User", avatar: null };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Validation
    if (authMode === "guest" && !displayName.trim()) {
      alert("Please enter a display name.");
      return;
    }
    if (authMode === "nsec" && !nsec.trim()) {
      alert("Please enter your nsec key.");
      return;
    }

    setIsSending(true);
    let nostrData = null;
    let finalUsername = authMode === "guest" ? displayName : "Anon";
    let finalAvatar = null;

    try {
      // --- MODE: EXTENSION ---
      if (authMode === "extension") {
        try {
          const nostr = (window as any).nostr;
          if (!nostr) throw new Error("No extension");

          const pubkey = await nostr.getPublicKey();

          // 1. Fetch Profile Data FIRST
          const profile = await fetchNostrProfile(pubkey);
          finalUsername = profile.name;
          finalAvatar = profile.avatar;

          // 2. Sign Event
          const eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
              ["t", "maximoto-guestbook"],
              ["r", window.location.href],
            ],
            content: input,
            pubkey,
          };

          const signedEvent = await nostr.signEvent(eventTemplate);
          const pool = new SimplePool();
          pool.publish(RELAYS, signedEvent);

          nostrData = {
            pubkey: signedEvent.pubkey,
            nostr_event_id: signedEvent.id,
            signature: signedEvent.sig,
          };
        } catch (e) {
          console.warn("Extension signing failed/rejected. Using fallback.");
          finalUsername = "Anonymous";
        }
      }

      // --- MODE: NSEC ---
      if (authMode === "nsec") {
        try {
          const { type, data: secretBytes } = nip19.decode(nsec);
          if (type !== "nsec") throw new Error("Invalid nsec");

          const secretKey = secretBytes as Uint8Array;
          const pubkey = getPublicKey(secretKey);

          // 1. Fetch Profile
          const profile = await fetchNostrProfile(pubkey);
          finalUsername = profile.name;
          finalAvatar = profile.avatar;

          // 2. Sign
          const eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["t", "maximoto-guestbook"]],
            content: input,
          };

          const signedEvent = finalizeEvent(eventTemplate, secretKey);
          const pool = new SimplePool();
          pool.publish(RELAYS, signedEvent);

          nostrData = {
            pubkey: signedEvent.pubkey,
            nostr_event_id: signedEvent.id,
            signature: signedEvent.sig,
          };
          setNsec("");
        } catch (e) {
          alert("Invalid Private Key.");
          setIsSending(false);
          return;
        }
      }

      // --- SAVE TO DB ---
      await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: input,
          username: finalUsername, // Now contains real name or Guest name
          avatar: finalAvatar, // Now contains real avatar url
          ...nostrData,
        }),
      });

      setInput("");
      fetchMessages();
    } catch (err) {
      console.error("Post error", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-neutral-200 text-sm">
            Community Ledger
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
          <Database className="w-3 h-3 text-blue-500" />
          {notes.length} SIGNALS
        </div>
      </div>

      {/* Messages Feed */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center opacity-50 space-y-2">
              <MessageSquare className="w-8 h-8 text-neutral-600" />
              <p className="text-neutral-500 text-xs">No signals yet.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2"
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden
                  ${
                    note.pubkey
                      ? "border-purple-500/30"
                      : "border-neutral-700 bg-neutral-800"
                  }`}
                >
                  {note.avatar ? (
                    <img
                      src={note.avatar}
                      alt={note.username}
                      className="w-full h-full object-cover"
                    />
                  ) : note.pubkey ? (
                    <Zap className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                  ) : (
                    <User className="w-4 h-4 text-neutral-500" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold ${
                        note.pubkey ? "text-purple-400" : "text-neutral-300"
                      }`}
                    >
                      {note.username}
                    </span>
                    {note.pubkey && (
                      <span className="text-[9px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">
                        VERIFIED
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-600 ml-auto">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed break-words">
                    {note.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Auth Tabs & Inputs */}
      <div className="bg-neutral-900 border-t border-neutral-800">
        <Tabs
          defaultValue="guest"
          value={authMode}
          onValueChange={(v) => setAuthMode(v as AuthMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-neutral-950 border-b border-neutral-800 h-9 rounded-none">
            <TabsTrigger
              value="guest"
              className="text-xs data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Guest
            </TabsTrigger>
            <TabsTrigger
              value="extension"
              className="text-xs data-[state=active]:bg-purple-900/20 data-[state=active]:text-purple-300"
            >
              {hasExtension ? "Extension" : "Nostr Ext"}
            </TabsTrigger>
            <TabsTrigger
              value="nsec"
              className="text-xs data-[state=active]:bg-orange-900/20 data-[state=active]:text-orange-300"
            >
              Keys
            </TabsTrigger>
          </TabsList>

          <div className="p-3">
            <TabsContent value="guest" className="mt-0">
              <Input
                placeholder="Display Name (e.g. Pico)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-8 text-xs bg-neutral-950 border-neutral-800 text-white"
              />
            </TabsContent>

            <TabsContent value="extension" className="mt-0">
              <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-900/10 p-2 rounded border border-purple-500/20">
                <Shield className="w-3 h-3" />
                {hasExtension
                  ? "Ready to sign with browser extension."
                  : "No extension detected."}
              </div>
            </TabsContent>

            <TabsContent value="nsec" className="mt-0 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-orange-500">
                <Lock className="w-3 h-3" /> Key stays in RAM only.
              </div>
              <Input
                type="password"
                placeholder="nsec1..."
                value={nsec}
                onChange={(e) => setNsec(e.target.value)}
                className="h-8 text-xs font-mono bg-neutral-950 border-orange-900/30"
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Send Bar */}
        <div className="p-3 pt-0 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your message..."
            className="bg-neutral-950 border-neutral-800 text-white focus-visible:ring-neutral-700"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            disabled={isSending}
            size="icon"
            className={`shrink-0 text-white transition-all ${
              authMode === "guest"
                ? "bg-neutral-700 hover:bg-neutral-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : authMode === "guest" ? (
              <Send className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4 fill-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
