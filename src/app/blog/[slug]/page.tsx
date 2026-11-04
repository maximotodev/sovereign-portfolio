import type { Metadata } from "next";
import { POSTS } from "@/lib/data";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";

// This remains the same
export async function generateStaticParams() {
  return POSTS.map((post) => ({
    slug: post.slug,
  }));
}

// FIX: 'params' is now a Promise in Next.js 15/16
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find(item => item.isPublished && item.slug === slug);
  if (!post) return { title: "Article not found — Newstr" };
  return {
    title: `${post.title} — Newstr | Maximoto`,
    description: post.content.replace(/[#*_>\\r\\n]/g, " ").slice(0, 155),
    alternates: { canonical: `/newsletter/essay/${post.slug}` },
  };
}

export default async function BlogPost({ params }: Props) {
  // 1. Await the params before accessing properties
  const { slug } = await params;

  // 2. Use the unwrapped slug
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-orange-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-neutral-500 font-mono text-sm">
            <Calendar className="w-4 h-4" />
            <time>{post.publishedDate}</time>
          </div>
        </header>

        {/* Markdown Content */}
        {/* We use 'prose-invert' to make typography look good on dark mode */}
        <div className="prose prose-invert prose-orange max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
