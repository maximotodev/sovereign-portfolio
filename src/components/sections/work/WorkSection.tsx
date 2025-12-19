import { Projects } from "@/components/sections/Projects";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Certifications } from "@/components/sections/Certifications";

export function WorkSection() {
  return (
    <section
      id="work"
      className="py-24 bg-neutral-950/50 border-y border-neutral-900 scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Proof of Work</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Open source contributions, technical writing, and verified
            credentials.
          </p>
        </div>

        <div className="space-y-24">
          <Projects />

          <div className="grid lg:grid-cols-3 gap-12 pt-12 border-t border-neutral-800/50">
            <div className="lg:col-span-2">
              <BlogPreview />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Certifications />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
