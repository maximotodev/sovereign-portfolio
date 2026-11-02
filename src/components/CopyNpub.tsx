"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { IDENTITY } from "@/lib/portfolio-data";

export function CopyNpub() {
 const [copied,setCopied]=useState(false);
 async function copy(){
   try { await navigator.clipboard.writeText(IDENTITY.npub);setCopied(true); }
   catch {setCopied(false);}
 }
 return <button type="button" onClick={copy} aria-label="Copy my Nostr public key" style={{display:"inline-flex",alignItems:"center",gap:9,border:"1px solid #494842",padding:"12px 15px",background:"transparent",color:"inherit",fontSize:12,fontFamily:"var(--font-mono),monospace",minHeight:44}}>
 {copied?<Check size={15}/>:<Copy size={15}/>} {copied?"Copied npub":"Copy npub"}
 </button>;
}
