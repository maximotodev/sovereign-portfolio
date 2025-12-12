import { PROJECTS } from "@/lib/data";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Icons } from "@/components/Icons";

export function Projects() {
  return (
    <section className="py-12" id="projects">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span className="text-orange-500">#</span> Open Source
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-colors"
          >
            {/* Image Overlay */}
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors z-10" />
              <Image
                src={project.image}
                alt={project.title}
                fill
                // FIX: Tell browser: "Full width on mobile, half width on desktop"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-neutral-100">
                  {project.title}
                </h3>
                <div className="flex gap-2">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <Icons.gitHub className="w-5 h-5" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-orange-500 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
