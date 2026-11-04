import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { POSTS } from "@/lib/data";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import styles from "@/components/newsletter/newsletter.module.css";

type Props = { params: Promise<{ slug: string }> };

const publishedEssays = POSTS.filter((post) => post.isPublished);

export function generateStaticParams() {
  return publishedEssays.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = publishedEssays.find((item) => item.slug === slug);
  if (!post) return { title: "Essay not found — Newstr" };
  return {
    title: `${post.title} — Newstr | Maximoto`,
    description: post.content.replace(/[#*_>\r\n]/g, " ").slice(0, 155),
    alternates: { canonical: `/newsletter/essay/${post.slug}` },
  };
}

export default async function ArchivedEssayPage({ params }: Props) {
  const { slug } = await params;
  const post = publishedEssays.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <SiteNavigation active="newsletter" />
        <div className={styles.breadcrumb}>
          <Link href="/newsletter"><ArrowLeft size={14} /> Back to Newstr</Link>
        </div>
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <p className={styles.eyebrow}>FROM THE ARCHIVE / ORIGINAL PORTFOLIO ESSAY</p>
            <span className={styles.issueNumber}>PUBLISHED {post.publishedDate} · ARCHIVED ESSAY</span>
            <h1>{post.title}</h1>
            <p>Part of the Maximoto writing archive. This older essay is not a cryptographically signed Nostr publication.</p>
          </header>
          <div className={`${styles.articleBody} prose prose-invert max-w-none`}>
            <ReactMarkdown skipHtml>{post.content}</ReactMarkdown>
          </div>
          <p className={styles.disclaimer}>
            Archive note: content is preserved from the original portfolio. Newstr&apos;s Nostr-signed issues are displayed separately and identified as verified publications.
          </p>
          <Link className={styles.back} href="/newsletter"><ArrowLeft size={14} /> All Newstr writing</Link>
        </article>
      </div>
    </main>
  );
}
