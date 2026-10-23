"use client";
import { useState } from "react";
import Link from "next/link";
import { SimplePool, verifyEvent, type Event } from "nostr-tools";
import { ArrowLeft, ArrowUpRight, Bot, CheckCircle2, Copy, FileText, KeyRound, LockKeyhole, Radio, Send, ShieldAlert } from "lucide-react";
import { cleanSlug, RELAYS } from "@/lib/nostr-publishing";
import { IDENTITY } from "@/lib/portfolio-data";

type Signer = { getPublicKey:()=>Promise<string>; signEvent:(event:{kind:number;created_at:number;tags:string[][];content:string})=>Promise<Event> };
declare global { interface Window { nostr?:Signer } }
const MAX=120000;
export default function Studio(){
 const [title,setTitle]=useState("");const [summary,setSummary]=useState("");const [body,setBody]=useState("");
 const [identifier,setIdentifier]=useState("");const [pubkey,setPubkey]=useState("");const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");const [ack,setAck]=useState(false);const [receipt,setReceipt]=useState<{id:string;relays:string[]}|null>(null);
 const slug=cleanSlug(identifier||title);
 const words=body.trim()?body.trim().split(/\s+/).length:0;
 const checks=[{label:"Article title",valid:title.trim().length>=5&&title.length<=160},{label:"Stable identifier",valid:slug.length>0},{label:"Body content",valid:body.trim().length>=40&&body.length<=MAX},{label:"Summary",valid:summary.trim().length>=20&&summary.length<=280},{label:"NIP-07 identity matches Maximoto",valid:pubkey===IDENTITY.pubkey}];
 const ready=checks.every(c=>c.valid)&&ack;
 const makeEvent=()=>({kind:30023,created_at:Math.floor(Date.now()/1000),tags:[["d",slug],["title",title.trim()],["summary",summary.trim()],["published_at",String(Math.floor(Date.now()/1000))]],content:body});
 async function connect(){setNotice("");try{if(!window.nostr)throw Error("No NIP-07 browser signer detected. Install a compatible signer or use a supported external CMS.");const k=await window.nostr.getPublicKey();setPubkey(k);if(k!==IDENTITY.pubkey)setNotice("Signer identity mismatch. Switch the extension to Maximoto's published key.");else setNotice("Signer identity verified. Nothing has been signed.");}catch(e){setNotice(e instanceof Error?e.message:"Signer unavailable.");}}
 async function copyEvent(){try{await navigator.clipboard.writeText(JSON.stringify(makeEvent(),null,2));setNotice("Unsigned NIP-23 template copied. No keys or signatures exported.");}catch{setNotice("Clipboard unavailable.");}}
 async function publish(){
 if(!ready||busy)return;setBusy(true);setReceipt(null);setNotice("");
 const pool=new SimplePool();
 try{
   const signer=window.nostr;
   if(!signer)throw Error("NIP-07 signer not available.");
   const livePubkey=await signer.getPublicKey();
   if(livePubkey!==IDENTITY.pubkey)throw Error("Active signer does not match Maximoto's verified public key.");
   const expected=makeEvent();
   const event=await signer.signEvent(expected);
   const sameTags=JSON.stringify(event.tags)===JSON.stringify(expected.tags);
   if(event.pubkey!==IDENTITY.pubkey||event.kind!==expected.kind||event.created_at!==expected.created_at||!verifyEvent(event)||!sameTags||event.content!==expected.content)throw Error("Signer output did not pass integrity, author, or exact payload checks.");
   const results=await Promise.allSettled(pool.publish(RELAYS,event));
   const accepted=results.flatMap((r,i)=>r.status==="fulfilled"?[RELAYS[i]]:[]);
   if(!accepted.length)throw Error("No relay confirmed publication. The signed event may need to be republished.");
   setReceipt({id:event.id,relays:accepted});
   setNotice("NIP-23 event accepted by "+accepted.length+" relay(s). Independently check read-back before announcing.");
 }catch(e){setNotice(e instanceof Error?e.message:"Publication failed.");}
 finally{pool.close(RELAYS);setBusy(false);}
 }
 return <main className="cp-root cp-studio"><div className="cp-grain" aria-hidden="true"/><div className="cp-wrap"><header className="cp-head"><Link href="/" className="cp-brand"><span className="cp-mark">M<span>✳</span></span><span>MAXIMOTO <small>/ EDITORIAL NODE</small></span></Link><Link href="/" className="cp-header-link"><ArrowLeft size={15}/> BACK TO WORK</Link></header>
 <div className="cp-studio-hero"><div className="cp-eyebrow"><span className="cp-dot"/> PRIVATE AUTHORING WORKSPACE / HUMAN-IN-THE-LOOP</div><h1>Ideas are cheap.<br/><em>Sign the work.</em></h1><p>A Nostr-native editorial workbench. Draft offline in your browser, check readiness, then explicitly authorize your own NIP-07 signer. No private keys are requested or stored. This is a focused editor—not a replacement for Bitkarrot&apos;s organizational CMS.</p><div className="cp-note"><LockKeyhole size={17}/> Content remains in browser component state until you sign and publish it. Reloading discards the draft. Export before leaving.</div></div>
 <div className="cp-studio-grid"><div className="cp-editor">
 <div className="cp-panel-heading"><span>01 / DOCUMENT COMPOSER</span><span>LOCAL DRAFT</span></div>
 <label htmlFor="story-title">ARTICLE TITLE</label><input id="story-title" maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="A case for sovereign software"/>
 <label htmlFor="story-slug">STABLE NIP-23 IDENTIFIER (D-TAG)</label><input id="story-slug" maxLength={80} value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder={cleanSlug(title)||"article-identifier"}/><p className="cp-helper">Address preview: {slug||"—"} · Keep the same identifier when updating an existing article.</p>
 <label htmlFor="story-summary">SUMMARY</label><textarea id="story-summary" rows={3} maxLength={280} value={summary} onChange={e=>setSummary(e.target.value)} placeholder="What will readers learn?" />
 <label htmlFor="story-body">MARKDOWN BODY</label><textarea id="story-body" rows={16} maxLength={MAX} value={body} onChange={e=>setBody(e.target.value)} placeholder={"## Thesis\n\nMake the claim. Show the evidence. Link the code."}/>
 <div className="cp-editor-footer"><span>{words} WORDS · {body.length.toLocaleString()} / {MAX.toLocaleString()} CHARACTERS</span><button onClick={copyEvent}><Copy size={13}/> COPY EVENT TEMPLATE</button></div>
 </div><aside className="cp-review"><div className="cp-panel-heading"><span>02 / REVIEW & AUTHORITY</span><span>DEFAULT DENY</span></div><div className="cp-studio-aside-intro"><Bot size={23}/><h2>Agentic by design.<br/><em>Human by default.</em></h2><p>Agents may suggest structure, improve readability, and propose references. They cannot bypass ownership, approval, or the signer. AI-generated text is untrusted until reviewed.</p></div><div className="cp-checks">{checks.map(c=><div key={c.label} className={c.valid?"is-good":""}>{c.valid?<CheckCircle2 size={15}/>:<span className="cp-open-circle"/>}{c.label}</div>)}</div>
 <button className="cp-connect" onClick={connect}><KeyRound size={17}/>{pubkey===IDENTITY.pubkey?"VERIFIED SIGNER CONNECTED":"VERIFY NIP-07 SIGNER"}</button>
 <p className="cp-pubkey">{pubkey?pubkey.slice(0,16)+"…"+pubkey.slice(-10):"No signer connected"}</p>
 <label className="cp-approve"><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/><span>I reviewed this exact content and explicitly authorize its public, irreversible distribution to configured Nostr relays.</span></label>
 <button className="cp-publish" disabled={!ready||busy} onClick={publish}><Send size={16}/>{busy?"PUBLISHING…":"SIGN & PUBLISH TO NOSTR"} <ArrowUpRight size={15}/></button>
 {notice&&<p className="cp-notice" role="status">{notice}</p>}
 {receipt&&<div className="cp-receipt"><CheckCircle2 size={18}/><strong>Relay acknowledgement</strong><p>Event {receipt.id.slice(0,18)}… accepted by {receipt.relays.join(", ")}.</p><a href={"https://njump.me/"+receipt.id} target="_blank" rel="noopener noreferrer">OPEN EVENT ↗</a></div>}
 <div className="cp-security"><ShieldAlert size={17}/><span>EDITORIAL GATE: No nsec paste. No server-held keys. No delegated AI signing. No automatic publication. A relay ACK is not proof of global propagation.</span></div></aside></div>
 <section className="cp-studio-bottom"><div><span className="cp-kicker"><Radio size={13}/> NOSTR CMS COMPATIBILITY</span><h2>Bring your own publishing stack.</h2><p>This editor emits NIP-23 kind 30023 with a stable d-tag. For rich media, team roles, Blossom files, drafts and scheduling, evaluate <a href="https://github.com/bitkarrot/nostr-cms" target="_blank" rel="noopener noreferrer">Bitkarrot&apos;s Nostr CMS ↗</a> in a separate deployment after security review.</p></div><div><span className="cp-kicker"><FileText size={13}/> REVIEW CONTRACT</span><p>Draft → Editorial checks → Manual signer approval → Cryptographic validation → Relay ACK → Independent read-back. Human review is mandatory at the signing boundary.</p></div></section>
 <footer className="cp-foot"><span>MAXIMOTO © {new Date().getFullYear()}</span><span>CODE IS SPEECH. PROOF IS PORTABLE.</span></footer></div></main>;
}
