import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SystemsLab from "@/components/SystemsLab";
import { IDENTITY } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Systems Lab | Maximoto",
  description: "Inspect Bitcoin, Nostr, FIPS and AI/ML architectures, design decisions, trust boundaries and source-linked proof of work.",
  alternates: { canonical: "/systems" },
};

export default function SystemsPage() {
 return <main className="cp-root">
  <a className="sl-skip" href="#systems">Skip to architecture explorer</a>
  <div className="cp-wrap">
   <header className="cp-head">
    <Link href="/" className="cp-brand" aria-label="Maximoto home">MAXIMOTO<span style={{color:"#ed8b44"}}>.</span> <small>/ SYSTEMS LAB</small></Link>
    <Link href="/" className="cp-header-link"><ArrowLeft size={16}/> BACK TO THE STORY</Link>
   </header>
   <section style={{padding:"90px 0 0",maxWidth:720}}>
     <p className="cp-kicker">ENGINEERING NOTES / OPEN SYSTEMS</p>
     <h1 style={{fontSize:"clamp(46px,8vw,94px)",lineHeight:1.06,letterSpacing:"-.07em",margin:"25px 0"}}>Understand the system.<br/><em style={{color:"#ed8b44",fontFamily:"Georgia,serif",fontWeight:400}}>Question the design.</em></h1>
     <p style={{fontSize:16,lineHeight:1.8,color:"#a8a79e"}}>A deeper look at the architecture and failure boundaries behind my work. The diagrams are explanations, not claims of live infrastructure.</p>
   </section>
   <SystemsLab/>
   <footer className="cp-foot"><span>© {new Date().getFullYear()} MAXIMOTO · VERIFY THE EVIDENCE</span><a href={IDENTITY.github} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",gap:8}}>SOURCE CODE <ArrowUpRight size={14}/></a></footer>
  </div>
 </main>;
}
