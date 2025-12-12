"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Copy, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

// Your Address
const MY_LIGHTNING_ADDRESS = "icyfireant7@primal.net";

export default function TipModal({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Copy function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(MY_LIGHTNING_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-neutral-950 border border-neutral-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
            Value for Value
          </DialogTitle>
          {/* 2. ADD DESCRIPTION TO FIX CONSOLE WARNING */}
          <DialogDescription className="text-neutral-400">
            Support the project via Lightning Network.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          {/* QR Code Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white p-4 rounded-lg">
              {/* 3. FIX: Remove 'lightning:' prefix for the QR code value. 
                  Most wallets prefer the raw text "user@domain.com" to resolve it. */}
              <QRCode value={MY_LIGHTNING_ADDRESS} size={200} level="M" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-neutral-400 text-sm">
              Scan with any Lightning Wallet
            </p>
            <p className="font-mono text-orange-500 font-bold bg-orange-950/30 px-3 py-1 rounded border border-orange-500/20 select-all">
              {MY_LIGHTNING_ADDRESS}
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy Address"}
            </Button>

            {/* Keep 'lightning:' here, as this triggers the app to open */}
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() =>
                (window.location.href = `lightning:${MY_LIGHTNING_ADDRESS}`)
              }
            >
              <Zap className="w-4 h-4 mr-2 fill-white" />
              Open Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
