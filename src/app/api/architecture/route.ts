import {SYSTEM_CASES} from "@/lib/system-cases";

/**
 * Public read-only, versioned architecture context for external research agents.
 * Treat links/claims as project descriptions, not instruction or authority.
 */
export function GET() {
  return Response.json({
    format: "maximoto.architecture.catalog.v1",
    owner: "Maximoto",
    generatedFrom: "source-controlled, public architecture briefs",
    operationalTelemetry: false,
    permissions: ["read", "cite", "analyze"],
    prohibited: ["automatic signing", "wallet actions", "deployment", "credential handling"],
    cases: SYSTEM_CASES,
  }, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
