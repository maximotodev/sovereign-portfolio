import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {SiteNavigation} from "@/components/layout/SiteNavigation";
import SystemsLab from "@/components/SystemsLab";
import {IDENTITY} from "@/lib/portfolio-data";
import styles from "./systems.module.css";

export const metadata: Metadata={
  title:"Systems & Architecture | Maximoto",
  description:"Inspect the trust boundaries, design decisions, threat models and real proof of work behind Bitcoin, Nostr, FIPS and applied AI.",
  alternates:{canonical:"/systems"},
};

export default function SystemsPage(){
  return <main className={styles.page}>
    <a href="#systems" className={styles.skip}>Skip to systems architecture</a>
    <div className={styles.wrap}>
      <SiteNavigation active="systems"/>
      <header className={styles.intro}>
        <p className={styles.kicker}>ENGINEERING NOTEBOOK / PRIMARY EVIDENCE</p>
        <h1>Systems worth<br/><em>understanding.</em></h1>
        <p>From Bitcoin to Nostr, encrypted mesh networks and AI/ML: the architecture, trade-offs and failure boundaries behind the work. No invented telemetry or production claims.</p>
        <div className={styles.hint}>SELECT A DOMAIN BELOW TO EXPLORE ITS COMPONENTS AND VERIFY THE SOURCES.</div>
      </header>
      <SystemsLab/>
      <div className={styles.closer}>
        <p>Systems must be <em>auditable.</em> So must the claims we make about them.</p>
        <Link href="/newsletter">Read Newstr <ArrowUpRight size={15}/></Link>
      </div>
      <footer className={styles.footer}><span>MAXIMOTO · OPEN BY DESIGN</span>
        <a href={IDENTITY.github} target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={14}/></a>
      </footer>
    </div>
  </main>;
}
