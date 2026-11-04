import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";
import NostrJournal from "@/components/NostrJournal";
import { CopyNpub } from "@/components/CopyNpub";
import { EVIDENCE, IDENTITY, VENTURES } from "@/lib/portfolio-data";
import { CERTIFICATIONS } from "@/lib/data";
import styles from "./homepage.module.css";
import {SiteNavigation} from "@/components/layout/SiteNavigation";

export const metadata: Metadata = {
  title: "Maximoto — Building for Freedom",
  description:
    "Maximoto is an independent, self-taught engineer building open-source Bitcoin, Nostr and freedom-tech systems. Read the story, explore verifiable contributions, and find signed Nostr writing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Maximoto — Building for Freedom",
    description: "Bitcoin, Nostr, open-source software and a belief that people should control their tools.",
    type: "website",
    url: "/",
  },
};

const selectedProof = [1407, 1110, 1410]
  .map(number => EVIDENCE.find(item => item.number === number))
  .filter((item): item is (typeof EVIDENCE)[number] => Boolean(item));

const interests = [
  { title: "Bitcoin", description: "Money and settlement you can verify." },
  { title: "Nostr", description: "An identity that travels with you." },
  { title: "FIPS", description: "Exploring networks without gatekeepers." },
  { title: "AI / ML", description: "Useful assistance with humans in control." },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <a href="#story" className={styles.skip}>Skip to Maximoto&apos;s story</a>
      <div className={styles.container}>
        <SiteNavigation active="home"/>

        <section id="story" className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}><span className={styles.bullet} aria-hidden="true" />INDEPENDENT ENGINEER / FREEDOM TECH</p>
          <h1 id="hero-title">I&apos;m Maximoto.<br />I build for <em>freedom.</em></h1>
          <p className={styles.heroLead}>
            I believe people should own their money, identity, and tools—not rent permission to use them.
          </p>
          <p className={styles.heroBody}>
            Bitcoin led me from curiosity to running my own node and learning how trust can be verified.
            That path brought me to Nostr, open protocols, and software that puts people back in control.
          </p>
          <div className={styles.heroActions}>
            <a href="#work" className={styles.primaryAction}>Explore the work <ArrowDownRight size={18} aria-hidden="true" /></a>
            <a href={IDENTITY.nostr} target="_blank" rel="noopener noreferrer" className={styles.textAction}>Find me on Nostr <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <div className={styles.heroIndex}><span>BITCOIN · NOSTR · FOSS · OPEN SYSTEMS</span><span>01 / A DIFFERENT WAY TO BUILD</span></div>
        </section>

        <section className={styles.story} aria-labelledby="story-heading">
          <div className={styles.sectionLabel}>01 / THE PERSON</div>
          <div className={styles.storyContent}>
            <h2 id="story-heading">Curiosity became a <em>conviction.</em></h2>
            <div className={styles.storyCopy}>
              <p>
                I didn&apos;t take a traditional route into engineering. I spent years in hospitality,
                working closely with people, before teaching myself to write software.
                That experience taught me to make technology practical—not just impressive.
              </p>
              <p>
                Today I work across Bitcoin, Nostr, decentralized networking and AI/ML.
                What connects them is simple: I&apos;m passionate about building systems that are
                open, auditable and useful without a central gatekeeper.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.interests} aria-labelledby="values-heading">
          <div className={styles.sectionLabel}>02 / WHAT MATTERS</div>
          <div className={styles.sectionIntro}>
            <h2 id="values-heading">Freedom tech, not hype.</h2>
            <Link className={styles.inlineLink} href="/systems">Explore the architecture <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className={styles.interestGrid}>
            {interests.map(item => (
              <div className={styles.interest} key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className={styles.work} aria-labelledby="work-heading">
          <div className={styles.sectionLabel}>03 / PROOF OF WORK</div>
          <div className={styles.sectionIntro}>
            <h2 id="work-heading">Show the work.</h2>
            <span className={styles.subtle}>No vanity counters. Just things you can inspect.</span>
          </div>

          <div className={styles.projects}>
            {VENTURES.map((project, index) => (
              <a className={styles.project} key={project.index} href={project.url} target="_blank" rel="noopener noreferrer">
                <span className={styles.projectNumber}>0{index + 1}</span>
                <div className={styles.projectText}>
                  <div className={styles.projectHeading}>
                    <h3>{project.title}</h3>
                    {index === 0 && <span className={styles.featured}>FEATURED / PLEBEIAN APPS</span>}
                  </div>
                  <p>{project.text}</p>
                  <span className={styles.projectTags}>{project.tags.join(" / ")}</span>
                </div>
                <ArrowUpRight className={styles.projectArrow} size={22} aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className={styles.proof}>
            <div className={styles.proofIntro}>
              <ShieldCheck size={18} aria-hidden="true" />
              <strong>Traceable contributions</strong>
              <span>Follow the pull request. Read the discussion.</span>
            </div>
            <div className={styles.proofLinks}>
              {selectedProof.map(item => (
                <a key={item.number} href={item.url} target="_blank" rel="noopener noreferrer">
                  <span>#{item.number}</span>
                  <span>{item.title}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className={styles.certifications} aria-labelledby="certifications-heading">
          <div className={styles.sectionLabel}>04 / VERIFIED LEARNING</div>
          <div className={styles.sectionIntro}>
            <h2 id="certifications-heading">Credentials, with receipts.</h2>
            <span className={styles.subtle}>Independent coursework. Follow the issuer to verify.</span>
          </div>
          <div className={styles.certList}>
            {CERTIFICATIONS.map((cert) => (
              <a key={cert.id} href={cert.url} target="_blank" rel="noopener noreferrer" className={styles.certRow}>
                <span className={styles.certYear}>{cert.date.slice(0, 4)}</span>
                <span className={styles.certDetails}><strong>{cert.name}</strong><small>{cert.organization}</small></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section id="writing" className={styles.writing} aria-labelledby="writing-heading">
          <div className={styles.sectionLabel}>05 / WRITTEN IN THE OPEN</div>
          <div className={styles.sectionIntro}>
            <div>
              <h2 id="writing-heading">Independent writing.<br/>Signed by me.</h2>
              <p className={styles.writingIntro}>Newstr brings together my existing engineering essays and weekly writing about Bitcoin, Nostr, AI and freedom tech. New Nostr publications carry verifiable signatures; the older essay archive is labeled separately.</p>
            </div>
            <div className={styles.writingLinks}>
              <Link className={styles.inlineLink} href="/newsletter">Newstr archive <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <a className={styles.inlineLink} href={IDENTITY.nostr} target="_blank" rel="noopener noreferrer">Read on YakiHonne <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <Link href="/newsletter" className={styles.newsletterFeature}>
            <span className={styles.featureNumber}>THE WEEKLY DISPATCH / NEWSTR</span>
            <span className={styles.featureTitle}>Bitcoin. Nostr. AI.<br/><em>One clear signal.</em></span>
            <span className={styles.featureBottom}>Five takeaways. Primary sources. Human-signed writing. <ArrowUpRight size={22} aria-hidden="true"/></span>
          </Link>
          <NostrJournal compact className={styles.notes} />
          <div className={styles.nostrIdentity}>
            <div>
              <span className={styles.monoLabel}>NOSTR IDENTITY / NIP-05</span>
              <p>{IDENTITY.nip05}</p>
            </div>
            <CopyNpub />
          </div>
        </section>

        <section className={styles.closing} aria-label="Closing statement">
          <p>The future I care about is one where more people can <em>choose, verify and leave.</em></p>
          <Link href="/systems" className={styles.inlineLink}>How I think about systems <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>

        <footer className={styles.footer}>
          <div>
            <strong>MAXIMOTO<span>.</span></strong>
            <p>Independent software engineer. Building in the open.</p>
          </div>
          <nav className={styles.footerLinks} aria-label="Social and project links">
            <a href={IDENTITY.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={IDENTITY.nostr} target="_blank" rel="noopener noreferrer">Nostr</a>
            <a href={IDENTITY.ngit} target="_blank" rel="noopener noreferrer">ngit</a>
            <Link href="/studio">Editorial Studio</Link>
            <Link href="/newsletter">Newstr</Link>
          </nav>
          <span className={styles.footerEnd}>© {new Date().getFullYear()} MAXIMOTO · OPEN BY DESIGN</span>
        </footer>
      </div>
    </main>
  );
}
