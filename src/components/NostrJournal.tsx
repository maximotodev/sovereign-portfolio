"use client";
import { useEffect,useState } from "react";
import { SimplePool } from "nostr-tools";
import ReactMarkdown from "react-markdown";
import { ArrowUpRight, FilePenLine, Radio, ShieldCheck } from "lucide-react";
import { RELAYS,selectArticles,type Article } from "@/lib/nostr-publishing";
import { IDENTITY } from "@/lib/portfolio-data";
export default function NostrJournal(){
 const [articles,setArticles]=useState<Article[]>([]);
 const [status,setStatus]=useState<"loading"|"ready"|"empty"|"error">("loading");
 const [selected,setSelected]=useState<string|null>(null);
 useEffect(()=>{let active=true;const pool=new SimplePool();(async()=>{try {
   const events=await pool.querySync(RELAYS,{kinds:[30023],authors:[IDENTITY.pubkey],limit:60},{maxWait:6500});
   if(active){const found=selectArticles(events);setArticles(found);setStatus(found.length?"ready":"empty");}
 } catch {if(active)setStatus("error");} finally {pool.close(RELAYS);}})();return()=>{active=false;pool.close(RELAYS);};},[]);
 return <section id="writing" className="cp-section cp-journal"><div className="cp-section-top"><span className="cp-kicker"><Radio size={13}/> 03 / SIGNED TRANSMISSIONS</span><a className="cp-minilink" href="/studio">OPEN EDITORIAL STUDIO <ArrowUpRight size={14}/></a></div>
 <div className="cp-section-intro"><div><h2>Published with <em>proof.</em></h2><p>Writing is portable. NIP-23 events are signed, verified against my public key, and retrieved from independent relays. A relay cannot impersonate the author.</p></div><span className="cp-section-asterisk">✳</span></div>
 <div className="cp-journal-shell">{status==="loading"?<p className="cp-muted">QUERYING PUBLIC RELAYS · VERIFYING SIGNATURES…</p>:status==="error"?<p className="cp-muted">RELAYS UNAVAILABLE. <a href="/studio">EXPLORE THE PUBLISHING WORKFLOW ↗</a></p>:status==="empty"?<div className="cp-journal-empty"><span><FilePenLine size={24}/></span><strong>Awaiting first signed dispatch.</strong><p>No verified NIP-23 articles found for this identity on the configured relays. Nothing is fabricated to fill the feed.</p><a href="/studio">EXPLORE THE STUDIO ↗</a></div>:articles.map((a,i)=><article className="cp-journal-item" key={a.identifier}><div className="cp-journal-meta"><span>{String(i+1).padStart(2,"0")}</span><span>{new Date(a.createdAt*1000).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span><span className="cp-verified"><ShieldCheck size={12}/> SIGNATURE VERIFIED</span></div><div className="cp-journal-text"><h3>{a.title}</h3><p>{a.summary}</p><div className="cp-journal-actions"><button onClick={()=>setSelected(selected===a.id?null:a.id)} aria-expanded={selected===a.id}>{selected===a.id?"CLOSE ARTICLE":"READ ARTICLE"} ↗</button><a href={a.url} target="_blank" rel="noopener noreferrer">NOSTR ADDRESS ↗</a></div>{selected===a.id&&<div className="cp-article-prose prose prose-invert max-w-none"><ReactMarkdown skipHtml>{a.content}</ReactMarkdown></div>}</div></article>)}</div>
 <div className="cp-journal-footer"><span>IDENTITY-FIRST · NO PLATFORM LOCK-IN</span><span>READ-ONLY · NO SIGNING KEY IN FRONTEND</span></div></section>;
}
