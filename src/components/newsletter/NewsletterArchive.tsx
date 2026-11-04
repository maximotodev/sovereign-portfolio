"use client";
import {useEffect,useState} from "react";
import VERIFIED_EVENTS from "@/lib/newstr-verified-events.json";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {SimplePool} from "nostr-tools";
import {ArrowLeft,ArrowUpRight,CheckCircle2,Radio,ShieldCheck} from "lucide-react";
import {IDENTITY} from "@/lib/portfolio-data";
import {POSTS} from "@/lib/data";
import {RELAYS,selectArticles,type Article} from "@/lib/nostr-publishing";
import {isNewstrIdentifier,parseIssueIdentifier,readTldrItems,withoutTldrSection} from "@/lib/freedom-signal";
import styles from "./newsletter.module.css";
import {SiteNavigation} from "@/components/layout/SiteNavigation";

type ReadStatus="loading"|"ready"|"empty"|"error";
type ArchiveFilter="all"|"dispatches"|"essays";
// Only signed, validated original events can appear in the snapshot.
const snapshot=selectArticles(VERIFIED_EVENTS,100).filter(a=>isNewstrIdentifier(a.identifier));
function useIssues(){
 const [issues,setIssues]=useState<Article[]>(snapshot);
 const [status,setStatus]=useState<ReadStatus>(snapshot.length?"ready":"loading");
 useEffect(()=>{
   let active=true;
   const pool=new SimplePool();
   async function run(){
     try {
       const events=await pool.querySync(RELAYS,
         {authors:[IDENTITY.pubkey],kinds:[30023],limit:100},{maxWait:6500});
       if(!active)return;
       const list=selectArticles([...events,...VERIFIED_EVENTS],100).filter(a=>isNewstrIdentifier(a.identifier));
       setIssues(list);
       setStatus(list.length?"ready":"empty");
     }catch{
       if(active)setStatus(snapshot.length?"ready":"error");
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
 <>No signed Newstr issues were found on the configured relays yet. The archive does not generate placeholder publications.</>}
 </div>;
}
function Footer(){
 return <footer className={styles.footer}>
  <span>NEWSTR / MAXIMOTO</span>
  <span>INDEPENDENT WRITING · HUMAN-SIGNED NIP-23</span>
 </footer>;
}
export function NewsletterArchive({identifier}:{identifier?:string}) {
 const {issues,status}=useIssues();
 const [filter,setFilter]=useState<ArchiveFilter>("all");
 const issue=identifier?issues.find(item=>item.identifier===identifier):undefined;
 const index=identifier===undefined;
 const metadata=issue?parseIssueIdentifier(issue.identifier):null;
 const items=issue?readTldrItems(issue.content):[];
 return <main className={styles.page}><div className={styles.wrap}>
  <SiteNavigation active="newsletter"/>
  <div className={styles.breadcrumb}>
    <Link href="/"><ArrowLeft size={14}/> Portfolio</Link>
    {identifier&&<Link href="/newsletter"><ArrowLeft size={14}/> All issues</Link>}
  </div>
  {index ? <>
   <section className={styles.hero}>
    <p className={styles.eyebrow}><Radio size={14}/> WEEKLY DISPATCH · BITCOIN / NOSTR / AI / FREEDOM TECH</p>
    <h1>Newstr<em>.</em></h1>
    <p>A weekly field note on Bitcoin, Nostr, AI and open systems. The TL;DR comes first. Every claim invites verification.</p>
    <div className={styles.heroFoot}><span>TL;DR FIRST · INDEPENDENT SOURCES</span><span>NO AUTONOMOUS PUBLICATION</span></div>
   <div className={styles.filters} role="group" aria-label="Filter Newstr writing">
    {([{value:"all",label:"All writing"},{value:"dispatches",label:"Signed dispatches"},{value:"essays",label:"Essays"}] as const).map(option=>
     <button key={option.value} type="button" aria-pressed={filter===option.value} onClick={()=>setFilter(option.value)}>{option.label}</button>
    )}
   </div>
   </section>
   {filter!=="essays"&&<section className={styles.list} aria-labelledby="issue-list-heading">
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
   </section>}
   {filter!=="dispatches"&&<section className={styles.list} aria-labelledby="essay-list-heading">
    <div className={styles.sectionHeading}>
     <h2 id="essay-list-heading">From the archive</h2>
     <span>ORIGINAL PORTFOLIO ESSAYS · NOT NOSTR-SIGNED</span>
    </div>
    {POSTS.filter(post=>post.isPublished).map(post=>
     <Link href={"/newsletter/essay/"+encodeURIComponent(post.slug)} key={post.slug} className={styles.issueRow}>
      <div className={styles.issueMeta}><span>ESSAY</span><time dateTime={post.publishedDate}>{post.publishedDate}</time></div>
      <div>
       <h3>{post.title}</h3>
       <p>{post.content.replace(/[#*_>\r\n]/g," ").replace(/\s+/g," ").slice(0,175)}…</p><p className={styles.readTime}>{Math.max(1,Math.ceil(post.content.trim().split(/\s+/).length/220))} min read</p>
      </div>
      <ArrowUpRight size={20} aria-hidden="true"/>
     </Link>
    )}
   </section>}
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
     <div className={[styles.articleBody,"prose","prose-invert","max-w-none"].join(" ")}><ReactMarkdown skipHtml>{withoutTldrSection(issue.content)}</ReactMarkdown></div>
     <div className={styles.disclaimer}>This article is a cryptographically verified Nostr publication. A signature confirms authorship, not the accuracy of every linked claim. Follow the sources and judge for yourself.</div>
     <Link href="/newsletter" className={styles.back}>All Newstr issues <ArrowUpRight size={15}/></Link>
    </article>
   }
  </>}
  <Footer/>
 </div></main>;
}
