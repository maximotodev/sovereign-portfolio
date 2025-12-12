import { CERTIFICATIONS } from "@/lib/data";
import { Award } from "lucide-react";

export function Certifications() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award className="text-orange-500" /> Certifications
      </h2>

      {/* 
         FIXED GRID LAYOUT:
         - Mobile (<sm): 1 column
         - Tablet (sm): 2 columns (It has full width here)
         - Desktop (lg): 1 column (It moves to the sidebar here, so it must stack)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {CERTIFICATIONS.map((cert) => (
          <a
            key={cert.id}
            href={cert.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 transition-all group"
          >
            {/* Icon: slightly smaller and shrink-0 to prevent squashing */}
            <div className="mt-1 text-orange-500/50 group-hover:text-orange-500 transition-colors shrink-0">
              <Award className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Title: Added leading-snug for better multi-line readability */}
              <h4 className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors leading-snug">
                {cert.name}
              </h4>

              {/* Metadata: Flex wrap allows date to drop down if org name is long */}
              <div className="flex flex-wrap justify-between items-center mt-2 gap-y-1 gap-x-2">
                <span className="text-xs text-neutral-500 font-mono">
                  {cert.organization}
                </span>
                <span className="text-xs text-neutral-600 whitespace-nowrap bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                  {cert.date.split("-")[0]}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
