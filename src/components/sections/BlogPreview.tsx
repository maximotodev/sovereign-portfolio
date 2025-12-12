import { POSTS } from "@/lib/data";
import Link from "next/link";
import { Calendar } from "lucide-react";

export function BlogPreview() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Latest Thoughts</h2>
      <div className="space-y-4">
        {POSTS.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group p-6 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-neutral-200 group-hover:text-orange-500 transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-400 text-sm mt-2 line-clamp-2 md:line-clamp-1">
                  {/* Strip markdown for preview roughly */}
                  {post.content.substring(0, 150).replace(/#/g, "")}...
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 shrink-0">
                <Calendar className="w-3 h-3" />
                {post.publishedDate}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
