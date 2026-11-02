"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {SimplePool} from "nostr-tools";
import {ArrowLeft,ArrowUpRight,CheckCircle2,Radio,ShieldCheck} from "lucide-react";
import {IDENTITY} from "@/lib/portfolio-data";
import {RELAYS,selectArticles,type Article} from "@/lib/nostr-publishing";
import {isFreedomSignalIdentifier,parseIssueIdentifier,readTldrItems} from "@/lib/freedom-signal";
import styles from "./newsletter.module.css";

type ReadStatus="loading"|"ready"|"empty"|"error";
function useIssues(){
 const [issues,setIssues]=useState<Article[]>([]);
 const [status,setStatus]=useState<ReadStatus>("loading");
 useEffect(()=>{
   let active=true;
   const pool=new SimplePool();
   async function run(){
     try {
       const events=await pool.querySync(RELAYS,
         {authors:[IDENTITY.pubkey],kinds:[30023],limit:100},{maxWait:6500});
       if(!active)return;
       const list=selectArticles(events).filter(a=>isFreedomSignalIdentifier(a.identifier));
       setIssues(list);
       setStatus(list.length?"ready":"empty");
     }catch{
       if(active)setStatus("error");
     }finally{pool.close(RELAYS);}
   }
   void run();
   return ()=>{active=false;pool.close(RELAYS);};
 },[]);
 return {issues,status};
}
function LoadingState({status}:{status:ReadStatus}){
 return <div className={styles.empty} role="status">
 {status==="loading"?
  <>Checking Nostr relays and verifying article signatures…</>:
 status==="error"?
  <>The relays could not be reached. Try again later or visit <a href={IDENTITY.nostr} target="_blank" rel="noopener noreferrer">Maximoto&apos;s Nostr profile</a>.</>:
 <>No signed Freedom Signal issues were found on the configured relays yet. The archive does not generate placeholder publications.</>}
 </div>;
}
function Header(){
 return <header className={styles.header}>
  <Link href="/" className={styles.brand}>MAXIMOTO<span>.</span></Link>
  <nav aria-label="Newsletter navigation"><Link href="/newsletter">Issues</Link><Link href="/studio">Studio</Link><a href={IDENTITY.nostr} target="_blank" rel="noopener noreferrer">Nostr ↗</a></nav>
 </header>;
}
function Footer(){
 return <footer className={styles.footer}>
  <span>FREEDOM SIGNAL / MAXIMOTO</span>
  <span>INDEPENDENT WRITING · HUMAN-SIGNED NIP-23</span>
 </footer>;
}
export function NewsletterArchive({identifier}:{identifier?:string}) {
 const {issues,status}=useIssues();
 const issue=identifier?issues.find(item=>item.identifier===identifier):undefined;
 const index=identifier===undefined;
 const metadata=issue?parseIssueIdentifier(issue.identifier):null;
 const items=issue?readTldrItems(issue.content):[];
 return <main className={styles.page}><div className={styles.wrap}>
  <Header/>
  <div className={styles.breadcrumb}>
    <Link href="/"><ArrowLeft size={14}/> Portfolio</Link>
    {identifier&&<Link href="/newsletter"><ArrowLeft size={14}/> All issues</Link>}
  </div>
  {index ? <>
   <section className={styles.hero}>
    <p className={styles.eyebrow}><Radio size={14}/> WEEKLY DISPATCH · BITCOIN / NOSTR / AI / FREEDOM TECH</p>
    <h1>Freedom <em>Signal.</em></h1>
    <p>A weekly look at the protocols, people and ideas making the internet more open. Researched with assistance. Verified and signed by Maximoto.</p>
    <div className={styles.heroFoot}><span>TL;DR FIRST · 5–7 MINUTE READS</span><span>NOTHING PUBLISHED WITHOUT HUMAN APPROVAL</span></div>
   </section>
   <section className={styles.list} aria-labelledby="issue-list-heading">
    <div className={styles.sectionHeading}><h2 id="issue-list-heading">Signed issues</h2><span>RETRIEVED FROM NOSTR · SIGNATURE VERIFIED</span></div>
    {status!=="ready"?<LoadingState status={status}/>:issues.map(item=>{
      const meta=parseIssueIdentifier(item.identifier);
      const takeaways=readTldrItems(item.content);
      return <Link href={"/newsletter/"+encodeURIComponent(item.identifier)} key={item.identifier} className={styles.issueRow}>
       <div className={styles.issueMeta}><span>#{String(meta?.issueNumber??0).padStart(3,"0")}</span><time dateTime={meta?.weekEnding}>{meta?.weekEnding}</time></div>
       <div><h3>{item.title}</h3><p>{takeaways.length?takeaways[0].replace(/\[[^\]]+\]\([^)]+\)/g,"source").slice(0,170):item.summary}</p></div>
       <ArrowUpRight size={20} aria-hidden="true"/>
      </Link>;
    })}
   </section>
  </> : <>
   {status==="loading"?<LoadingState status={status}/>:
    status==="error"?<LoadingState status={status}/>:
    !issue?<section className={styles.empty}>No verified signed issue was found for this address. <Link href="/newsletter">Return to the issue archive.</Link></section>:
    <article className={styles.article}>
     <div className={styles.articleHeader}>
      <p className={styles.eyebrow}><CheckCircle2 size={14}/> SIGNATURE VERIFIED · NIP-23</p>
      <span className={styles.issueNumber}>ISSUE #{String(metadata?.issueNumber??0).padStart(3,"0")} / WEEK ENDING {metadata?.weekEnding}</span>
      <h1>{issue.title}</h1>
      <p>{issue.summary}</p>
      <div className={styles.articleActions}>
       <a href={issue.url} target="_blank" rel="noopener noreferrer">Open signed Nostr original <ArrowUpRight size={15}/></a>
       <span><ShieldCheck size={15}/> AUTHOR: MAXIMOTO</span>
      </div>
     </div>
     {items.length>0&&<section className={styles.tldr} aria-labelledby="tldr-heading">
      <div className={styles.tldrLabel}><span id="tldr-heading">TL;DR — The week in 60 seconds</span><span>{items.length} TAKEAWAYS</span></div>
      <div className={styles.tldrItems}>{items.map((text,i)=><div key={i}><span>{String(i+1).padStart(2,"0")}</span><div className={styles.markdown}><ReactMarkdown skipHtml>{text}</ReactMarkdown></div></div>)}</div>
     </section>}
     <div className={[styles.articleBody,"prose","prose-invert","max-w-none"].join(" ")}><ReactMarkdown skipHtml>{issue.content}</ReactMarkdown></div>
     <div className={styles.disclaimer}>This article is a cryptographically verified Nostr publication. A signature confirms authorship, not the accuracy of every linked claim. Follow the sources and judge for yourself.</div>
     <Link href="/newsletter" className={styles.back}>All Freedom Signal issues <ArrowUpRight size={15}/></Link>
    </article>
   }
  </>}
  <Footer/>
 </div></main>;
}
