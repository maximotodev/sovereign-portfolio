import { PROJECTS, PROOF_OF_WORK } from "@/lib/data";
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
            {/* Project illustration */}
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
      <div className="mt-12 rounded-2xl border border-orange-500/20 bg-neutral-900/40 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-white mb-2">Plebeian Apps · Verified Contributions</h3>
        <p className="text-neutral-400 text-sm mb-6">Public pull requests are the source of truth. Research and experimental FIPS validator work are not presented as production deployments.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {PROOF_OF_WORK.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-neutral-800 hover:border-orange-500/50 bg-neutral-950/70 transition-colors">
              <span className="text-[10px] text-orange-400 font-mono uppercase">{item.area} · {item.status}</span>
              <span className="flex items-center justify-between mt-2 gap-2 font-semibold text-neutral-100 text-sm">{item.title}<ExternalLink className="w-4 h-4 shrink-0" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
