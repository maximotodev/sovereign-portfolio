"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error(response.statusText);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      const aiMessageId = (Date.now() + 1).toString();
      let aiContent = "";

      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, role: "assistant", content: "" },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        aiContent += chunkValue;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: aiContent } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat Error:", error);
      // alert("Failed to connect to AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // UPDATED: Full height container with glass effect
    <div className="flex flex-col h-full min-h-[450px] w-full bg-neutral-950/80 border border-neutral-800 rounded-xl overflow-hidden relative shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 rounded-md border border-orange-500/20">
            <Sparkles className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <span className="text-sm font-bold text-neutral-200 block">
              AI Resume Agent
            </span>
            <span className="text-[10px] text-neutral-500 font-mono uppercase">
              Llama-3-8B • Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-neutral-950/50" ref={scrollRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-60">
              <Terminal className="w-10 h-10 text-neutral-700" />
              <p className="text-sm text-neutral-500">
                System Ready. Ask about Diego's node.
              </p>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                  m.role === "user"
                    ? "bg-neutral-800 border-neutral-700"
                    : "bg-orange-950/30 border-orange-500/30"
                }`}
              >
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-neutral-400" />
                ) : (
                  <Bot className="w-4 h-4 text-orange-500" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 text-sm max-w-[85%] leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-neutral-800 text-white border border-neutral-700"
                    : "bg-neutral-900/80 text-neutral-300 border border-neutral-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2 items-center text-neutral-500 text-xs ml-2 animate-pulse">
              <Bot className="w-3 h-3" />
              <span>Generating response...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 bg-neutral-900 border-t border-neutral-800 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-orange-500/50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          className="bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
