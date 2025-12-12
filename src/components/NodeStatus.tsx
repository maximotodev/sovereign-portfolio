"use client";

import { useEffect, useState } from "react";
import { Server, Activity, ShieldCheck } from "lucide-react";

export default function NodeStatus() {
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);

  useEffect(() => {
    // Fetch live data from Mempool.space API
    const fetchData = async () => {
      try {
        const heightRes = await fetch(
          "https://mempool.space/api/blocks/tip/height"
        );
        const height = await heightRes.text();

        const feesRes = await fetch(
          "https://mempool.space/api/v1/fees/recommended"
        );
        const feesData = await feesRes.json();

        setBlockHeight(Number(height));
        setFees(feesData.hourFee);
      } catch (e) {
        console.error("Mempool API error", e);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-orange-950/20 rounded-lg border border-orange-500/10 p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Pulse Effect */}
      <div className="absolute top-0 right-0 p-3">
        <div className="relative">
          <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-orange-500 mb-1">
          <Server size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Mainnet
          </span>
        </div>
        <div className="text-xs text-orange-400/60 font-mono">
          RaspiBlitz v1.11
        </div>
      </div>

      <div className="space-y-4 z-10 mt-4">
        <div>
          <div className="text-4xl font-mono font-bold text-white tracking-tighter">
            {blockHeight ? blockHeight.toLocaleString() : "Syncing..."}
          </div>
          <div className="text-[10px] text-neutral-500 uppercase font-mono mt-1">
            Current Block Height
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-neutral-900/50 rounded p-2 border border-neutral-800">
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-1">
              <Activity size={10} /> Fees
            </div>
            <div className="text-sm font-mono text-orange-400">
              {fees} sat/vB
            </div>
          </div>
          <div className="bg-neutral-900/50 rounded p-2 border border-neutral-800">
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-1">
              <ShieldCheck size={10} /> Uptime
            </div>
            <div className="text-sm font-mono text-green-400">99.9%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
