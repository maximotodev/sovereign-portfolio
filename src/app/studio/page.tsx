"use client";

import {useRef,useState} from "react";
import ReactMarkdown from "react-markdown";
import {SimplePool,verifyEvent,type Event} from "nostr-tools";
import {ArrowRight,ArrowUpRight,BookOpen,Check,CheckCircle2,ClipboardCheck,Download,ExternalLink,Eye,FileJson,KeyRound,LockKeyhole,PenLine,Radio,ShieldCheck} from "lucide-react";
import {AgentReview} from "@/components/editorial/AgentReview";
import {NewstrComposer} from "@/components/editorial/FreedomSignalComposer";
import {DraftTransfer} from "@/components/editorial/DraftTransfer";
import {makeDraft,validateDraft,copyDraft,snapshotEqual,draftSha256,editorialIssues,type EditorialDraft,type EditorialSnapshot} from "@/lib/editorial-state";
import {cleanSlug,RELAYS} from "@/lib/nostr-publishing";
import {newsletterChecks,newstrTags} from "@/lib/freedom-signal";
import {IDENTITY} from "@/lib/portfolio-data";
import styles from "./studio-v3.module.css";
import {SiteNavigation} from "@/components/layout/SiteNavigation";

type Signer={getPublicKey:()=>Promise<string>;signEvent:(event:{kind:number;created_at:number;tags:string[][];content:string})=>Promise<Event>};
declare global{interface Window{nostr?:Signer}}
type Stage="write"|"review"|"sign";
type Receipt={id:string;relays:string[];confirmed:boolean};
const MAX=120000;
const stages:{key:Stage;label:string;description:string}[]=[
 {key:"write",label:"Write",description:"Draft and edit"},
 {key:"review",label:"Review",description:"Verify and freeze"},
 {key:"sign",label:"Publish",description:"Sign and confirm"},
];

export default function Studio(){
 const [title,setTitle]=useState("");
 const [identifier,setIdentifier]=useState("");
 const [summary,setSummary]=useState("");
 const [body,setBody]=useState("");
 const [pubkey,setPubkey]=useState("");
 const [busy,setBusy]=useState(false);
 const [stage,setStage]=useState<Stage>("write");
 const [preview,setPreview]=useState(false);
 const [notice,setNotice]=useState("");
 const [review,setReview]=useState<EditorialSnapshot|null>(null);
 const [ack,setAck]=useState(false);
 const [receipt,setReceipt]=useState<Receipt|null>(null);
 const fileInput=useRef<HTMLInputElement>(null);

 const slug=cleanSlug(identifier||title);
 const draft=makeDraft(title,slug,summary,body);
 const isNewsletter=slug.startsWith("newstr-")||/^newstr/i.test(title);
 const newsletterIssues=isNewsletter?newsletterChecks(draft):[];
 const editorial=editorialIssues(draft,pubkey===IDENTITY.pubkey);
 const allChecks=[...editorial.map(x=>({label:x.label,valid:x.valid,detail:x.detail})),...newsletterIssues.map(x=>({label:x.label,valid:x.valid,detail:x.detail}))];
 const passes=allChecks.every(x=>x.valid);
 const reviewed=review!==null&&snapshotEqual(draft,review)&&review.approvedPubkey===IDENTITY.pubkey;
 const ready=passes&&reviewed&&ack&&!busy;
 const wordCount=body.trim()?body.trim().split(/\s+/).length:0;
 const validCount=allChecks.filter(x=>x.valid).length;
 const label=receipt?.confirmed?"Published & verified":receipt?"Relay acknowledged":reviewed?"Approved snapshot":passes?"Ready for review":"Editing draft";
 
 function invalidate(){
   setReview(null);
   setAck(false);
   setReceipt(null);
 }
 function updateField(field:"title"|"identifier"|"summary"|"content",value:string){
   if(field==="title")setTitle(value);
   if(field==="identifier")setIdentifier(value);
   if(field==="summary")setSummary(value);
   if(field==="content")setBody(value);
   invalidate();
 }
 function replaceDraft(next:EditorialDraft){
   setTitle(next.title);setIdentifier(next.identifier);setSummary(next.summary);setBody(next.content);
   invalidate();setStage("write");setNotice("Unsigned draft loaded. Check every field; prior approval was not transferred.");
 }
 function downloadDraft(){
   try{
     const blob=new Blob([JSON.stringify(draft,null,2)],{type:"application/json"});
     const url=URL.createObjectURL(blob);
     const anchor=document.createElement("a");
     anchor.href=url;anchor.download=(slug||"newstr-draft")+".draft.json";
     anchor.click();
     window.setTimeout(()=>URL.revokeObjectURL(url),30000);
     setNotice("Draft export requested. If your browser blocks downloads, use Copy draft JSON or Paste a draft below.");
   }catch{setNotice("Download unavailable. Use the Copy draft JSON action in the draft recovery section.");}
 }
 async function importFile(file:File){
   if(file.size>180000){setNotice("The file exceeds the draft size limit.");return;}
   try{
     const value:unknown=JSON.parse(await file.text());
     if(!validateDraft(value))throw Error("Invalid draft format. Import a version-1 editorial JSON draft.");
     if((title.trim()||body.trim())&&!window.confirm("Replace the current unsigned draft? Export or save it first."))return;
     replaceDraft(value);
     setNotice("Draft JSON imported successfully. Review and signing approvals are cleared.");
   }catch(error){setNotice(error instanceof Error?error.message:"Draft import failed.");}
 }
 async function copyEvent(){
   try{
     await navigator.clipboard.writeText(JSON.stringify({
       kind:30023,created_at:null,
       tags:[["d",slug],["title",title.trim()],["summary",summary.trim()],...newstrTags(slug)],
       content:body,
     },null,2));
     setNotice("Unsigned NIP-23 template copied. No signature or credentials included.");
   }catch{setNotice("Clipboard access failed. You can still export your draft JSON.");}
 }
 async function connectSigner(){
   try{
     if(!window.nostr)throw Error("NIP-07 signer not detected. Install or enable a compatible browser extension.");
     const identity=await window.nostr.getPublicKey();
     setPubkey(identity);
     if(identity!==IDENTITY.pubkey)throw Error("The active signer does not match Maximoto's published Nostr identity.");
     setNotice("Identity verified. No event has been signed.");
   }catch(error){setNotice(error instanceof Error?error.message:"Signer unavailable.");}
 }
 async function approveReview(){
   if(!passes){setNotice("Finish the readiness checks before freezing this draft.");return;}
   try{
     const sha256=await draftSha256(draft);
     setReview({...copyDraft(draft),approvedPubkey:IDENTITY.pubkey,reviewedAt:new Date().toISOString(),sha256});
     setAck(false);
     setNotice("Exact draft snapshot frozen. Recheck its content, then explicitly authorize publishing.");
     setStage("sign");
   }catch{setNotice("Cannot compute a review digest in this browser.");}
 }
 function makeEvent(source:EditorialSnapshot){
   const now=Math.floor(Date.now()/1000);
   return {
     kind:30023,created_at:now,
     tags:[["d",source.identifier],["title",source.title.trim()],
       ["summary",source.summary.trim()],["published_at",String(now)],
       ...newstrTags(source.identifier)],
     content:source.content,
   };
 }
 async function publish(){
   if(!ready||!review||busy)return;
   setBusy(true);setReceipt(null);setNotice("");
   const pool=new SimplePool();
   try{
     if(!window.nostr)throw Error("NIP-07 signer is not available.");
     if(await window.nostr.getPublicKey()!==IDENTITY.pubkey)throw Error("Active signer identity mismatch.");
     if(!snapshotEqual(draft,review)||await draftSha256(draft)!==review.sha256)throw Error("Draft changed after review. Freeze a new snapshot.");
     if(isNewsletter&&!newsletterChecks(review).every(check=>check.valid))throw Error("Newsletter readiness changed. Review again.");
     const expected=makeEvent(review);
     const signed=await window.nostr.signEvent(expected);
     if(signed.kind!==expected.kind||signed.pubkey!==IDENTITY.pubkey||
       signed.created_at!==expected.created_at||signed.content!==expected.content||
       JSON.stringify(signed.tags)!==JSON.stringify(expected.tags)||!verifyEvent(signed)){
       throw Error("The signing extension returned an invalid or modified event.");
     }
     const replies=await Promise.allSettled(pool.publish(RELAYS,signed));
     const accepted=replies.flatMap((r,i)=>r.status==="fulfilled"?[RELAYS[i]]:[]);
     if(!accepted.length)throw Error("No relay confirmed publication. Check relay health before retrying; signing may already have occurred.");
     const readbacks=await Promise.allSettled(accepted.map(async relay=>{
       const reader=new SimplePool();
       try{return await reader.get([relay],{ids:[signed.id],authors:[IDENTITY.pubkey],kinds:[30023]},{maxWait:6000});}
       finally{reader.close([relay]);}
     }));
     const confirmed=readbacks.some(r=>r.status==="fulfilled"&&r.value?.id===signed.id&&verifyEvent(r.value));
     setReceipt({id:signed.id,relays:accepted,confirmed});
     setNotice(confirmed?"Event signed, acknowledged and independently read back.":"Signed event acknowledged but read-back not yet confirmed. Verify propagation before sharing.");
   }catch(error){setNotice(error instanceof Error?error.message:"Publication failed.");}
   finally{pool.close(RELAYS);setBusy(false);}
 }

 return <main className={styles.page}>
   <a href="#studio-workspace" className={styles.skip}>Skip to editorial workspace</a>
   <div className={styles.wrap}>
     <SiteNavigation active="studio"/>
     <section className={styles.hero} aria-labelledby="studio-title">
       <div className={styles.kicker}><PenLine size={14}/> SOVEREIGN EDITORIAL STUDIO / NEWSTR</div>
       <div className={styles.heroTop}>
         <div><h1 id="studio-title">Write freely.<br/><em>Sign deliberately.</em></h1>
           <p>One quiet workspace for your words. Draft, verify and publish Nostr articles without surrendering your keys.</p>
         </div>
         <div className={styles.heroAside}><span>LOCAL FIRST</span><strong>{label}</strong><p>No automatic signing or publication.</p></div>
       </div>
     </section>

     <div id="studio-workspace" className={styles.workspace}>
       <nav className={styles.steps} aria-label="Publishing workflow">
         {stages.map((step,i)=><button key={step.key} type="button" aria-current={stage===step.key?"step":undefined}
           className={stage===step.key?styles.stepActive:styles.step} onClick={()=>setStage(step.key)}>
           <span className={styles.stepNumber}>0{i+1}</span>
           <span><strong>{step.label}</strong><small>{step.description}</small></span>
           {stage===step.key&&<ArrowRight size={17}/>}
         </button>)}
       </nav>
       <div className={styles.progress}><div className={styles.progressFill} style={{width:stage==="write"?"33%":stage==="review"?"66%":"100%"}}/></div>
       {notice&&<p role="status" className={styles.notice}>{notice}</p>}

       {stage==="write"&&<section className={styles.stepPanel} aria-labelledby="write-title">
         <div className={styles.panelIntro}>
           <div><span className={styles.mono}>01 / COMPOSE</span><h2 id="write-title">Your next dispatch.</h2><p>Start a Newstr issue, import an existing draft, or write directly. Everything stays unsigned until you approve it.</p></div>
           <div className={styles.panelStatus}><CheckCircle2 size={17}/> {wordCount} WORDS</div>
         </div>
         <details className={styles.toolDisclosure}>
           <summary><BookOpen size={18}/> Newstr issue template <span>ISSUE NUMBER · DATE · TL;DR</span></summary>
           <NewstrComposer draft={draft} onReplace={replaceDraft} onMessage={setNotice}/>
         </details>
         <details className={styles.toolDisclosure}>
           <summary><ClipboardCheck size={18}/> Import or recover a draft <span>NO DOWNLOAD REQUIRED</span></summary>
           <div className={styles.importControls}>
             <button type="button" onClick={downloadDraft}><Download size={15}/> Download JSON draft</button>
             <button type="button" onClick={()=>fileInput.current?.click()}><FileJson size={15}/> Import JSON file</button>
             <input type="file" accept=".json,application/json" aria-label="Import article draft JSON" hidden ref={fileInput}
               onChange={e=>{const f=e.target.files?.[0];if(f)void importFile(f);e.target.value="";}}/>
           </div>
           <DraftTransfer draft={draft} onReplace={replaceDraft} onMessage={setNotice}/>
         </details>
         <section className={styles.editor} aria-label="Article editor">
           <div className={styles.editorTop}><strong>Article</strong><div className={styles.editorSwitch}>
             <button type="button" aria-pressed={!preview} onClick={()=>setPreview(false)}><PenLine size={14}/> Edit</button>
             <button type="button" aria-pressed={preview} onClick={()=>setPreview(true)}><Eye size={14}/> Preview</button>
           </div></div>
           <div className={styles.fields}>
             <label htmlFor="article-title">Title<input id="article-title" maxLength={160} value={title}
               onChange={e=>updateField("title",e.target.value)} placeholder="Own the Keys. Verify the Work."/></label>
             <label htmlFor="article-identifier">Permanent NIP-23 identifier<input id="article-identifier" maxLength={80} value={identifier}
               onChange={e=>updateField("identifier",e.target.value)} placeholder="newstr-001-2026-10-30"/></label>
             <label htmlFor="article-summary">Summary<textarea id="article-summary" rows={2} maxLength={280}
               value={summary} onChange={e=>updateField("summary",e.target.value)} placeholder="One clear sentence about the issue."/></label>
             {preview?<div className={styles.preview} role="region" aria-label="Markdown article preview">
               <div className="prose prose-invert max-w-none"><ReactMarkdown skipHtml>{body||"*Your article preview will appear here.*"}</ReactMarkdown></div>
             </div>:<label htmlFor="article-content">Markdown article<textarea id="article-content" rows={18}
               maxLength={MAX} value={body} onChange={e=>updateField("content",e.target.value)}
               placeholder={"## TL;DR\n\nWrite three to five source-linked takeaways, then tell the story."}/></label>}
           </div>
           <div className={styles.editorFooter}><span>{body.length.toLocaleString()} / {MAX.toLocaleString()} CHARACTERS</span><button type="button" onClick={()=>void copyEvent()}><FileJson size={15}/> Copy NIP-23 template</button></div>
         </section>
         <details className={styles.toolDisclosure}>
           <summary><BookOpen size={18}/> AI-assisted editorial review <span>OPTIONAL · NO AUTONOMOUS ACTIONS</span></summary>
           <AgentReview draft={draft} onAccept={replaceDraft}/>
         </details>
         <div className={styles.nextBar}><span>Finished writing? Check the sources and freeze a review copy.</span>
           <button type="button" onClick={()=>setStage("review")}>Continue to review <ArrowRight size={17}/></button>
         </div>
       </section>}

       {stage==="review"&&<section className={styles.stepPanel} aria-labelledby="review-title">
         <div className={styles.panelIntro}><div><span className={styles.mono}>02 / REVIEW</span><h2 id="review-title">Verify the claims.</h2>
           <p>The checks below validate article structure, source link format and author identity. They do not prove source accuracy.</p></div>
           <div className={styles.panelStatus}><CheckCircle2 size={17}/> {validCount} / {allChecks.length} CHECKS</div></div>
         <div className={styles.reviewGrid}>
           <div className={styles.readiness}>
             {allChecks.map((check,i)=><div className={styles.checkRow} key={i}>
               <span className={check.valid?styles.pass:styles.fail}>{check.valid?<Check size={15}/>:<span aria-hidden="true">!</span>}</span>
               <div><strong>{check.label}</strong><p>{check.detail}</p></div>
             </div>)}
           </div>
           <div className={styles.reviewCard}><div className={styles.mono}>SIGNER / IDENTITY</div>
             <h3>Only your key can publish.</h3>
             <p>Connect a compatible NIP-07 extension and confirm it matches your public Maximoto identity.</p>
             <button type="button" onClick={()=>void connectSigner()}><KeyRound size={16}/>{pubkey===IDENTITY.pubkey?"Signer identity verified":"Verify NIP-07 signer"}</button>
             <p className={styles.small}>{pubkey?pubkey.slice(0,20)+"…"+pubkey.slice(-10):"No signer connected"}</p>
             <p className={styles.small}>We never request your nsec. A signer check does not sign or publish anything.</p>
           </div>
         </div>
         <div className={styles.reviewPreview}><div className={styles.reviewPreviewHeader}>
           <span className={styles.mono}>REVIEW THE FULL ARTICLE</span>
           <button type="button" onClick={()=>setStage("write")}><PenLine size={14}/> Edit draft</button>
         </div><h3>{title||"Untitled draft"}</h3><p>{summary}</p><div className="prose prose-invert max-w-none"><ReactMarkdown skipHtml>{body}</ReactMarkdown></div></div>
         <div className={styles.nextBar}><span>{passes?"Ready for an exact, immutable-in-review snapshot.":"Resolve all failed checks before freezing the draft."}</span>
           <button type="button" disabled={!passes||busy} onClick={()=>void approveReview()}><LockKeyhole size={17}/> Freeze for final approval</button>
         </div>
       </section>}

       {stage==="sign"&&<section className={styles.stepPanel} aria-labelledby="sign-title">
         <div className={styles.panelIntro}><div><span className={styles.mono}>03 / SIGN AND VERIFY</span>
           <h2 id="sign-title">Your signature. Your call.</h2>
           <p>This publishes a signed, public NIP-23 article to the configured Nostr relays. It may be copied permanently.</p></div>
           <div className={styles.panelStatus}><Radio size={17}/> MANUAL ONLY</div></div>
         {!reviewed?<div className={styles.noSnapshot}><LockKeyhole size={26}/>
           <h3>No approved snapshot yet.</h3><p>Return to Review, check the sources, verify your signer and freeze the exact article first.</p>
           <button type="button" onClick={()=>setStage("review")}>Back to review <ArrowRight size={15}/></button>
         </div>:<div className={styles.signCard}>
           <div className={styles.mono}>FROZEN REVIEW SNAPSHOT</div>
           <h3>{review?.title}</h3>
           <p>{review?.summary}</p>
           <div className={styles.signMetadata}><span>IDENTIFIER</span><code>{review?.identifier}</code>
             <span>SHA-256</span><code>{review?.sha256}</code></div>
           <div className={styles.approval}>
             <label><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/>
               <span>I checked the exact article and its sources and authorize public, potentially irreversible publication under my Nostr identity.</span></label>
           </div>
           <button type="button" className={styles.publishButton} disabled={!ready} onClick={()=>void publish()}>
             <KeyRound size={18}/>{busy?"Signing / contacting relays…":"Sign & publish with NIP-07"}<ArrowUpRight size={17}/>
           </button>
           <p className={styles.safety}><ShieldCheck size={16}/> Human signing only · No private keys · No scheduled posting</p>
         </div>}
         {receipt&&<div className={styles.receipt} role="status">
           <CheckCircle2 size={20}/><div><strong>{receipt.confirmed?"Signed event independently verified":"Signed event acknowledged — read-back pending"}</strong>
             <p>Event ID: <code>{receipt.id}</code></p>
             <p>Relays acknowledging: {receipt.relays.join(", ")}</p>
             <a href={"https://njump.me/"+receipt.id} target="_blank" rel="noopener noreferrer">Inspect signed event <ExternalLink size={14}/></a>
           </div>
         </div>}
       </section>}
     </div>
     <footer className={styles.footer}><span>MAXIMOTO / NEWSTR STUDIO</span><span>WRITE · REVIEW · SIGN · VERIFY</span></footer>
   </div>
 </main>;
}
