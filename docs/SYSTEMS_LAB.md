# Systems Lab — Architecture-first portfolio (2026-11)

## Why this exists

The portfolio should demonstrate systems thinking and make engineering claims auditable rather than showing generic logos, invented telemetry or ungrounded AI "capabilities". The public **Systems Lab** introduces an interactive engineering notebook covering Bitcoin/Cashu, Nostr/NIP-23, FIPS encrypted mesh and retrieval/agentic architecture.

## Implementation

- `src/lib/system-cases.ts`: typed, source-controlled data models with architecture responsibilities, trust boundaries, failure modes, mitigations and primary links.
- `src/components/SystemsLab.tsx`: client-rendered, accessible domain controls, three investigation lenses, node inspector, source navigation and illustrative 3-of-4 quorum availability interaction.
- `src/app/api/architecture/route.ts`: read-only machine-readable versioned JSON, safe to consume in other tooling, with explicitly limited permissions and no production credentials.
- `tests/systems-cases.test.mjs`: source/structure/truthfulness contract tests, run with existing editorial tests in CI.
- Homepage, metadata and responsive CSS: no added npm dependencies, no network writes and no additional signing privileges.

## Protocol distinctions

1. **Bitcoin** is monetary settlement infrastructure. Cashu and Coco relate to ecash custody and payment lifecycle. CometBFT is a distinct committee-consensus design. Nostr does not magically finalize auctions.
2. **Nostr** provides signed application messages and portable identities; relay delivery does not establish the truthfulness of a claim, payment finality, or a guarantee of permanent storage.
3. **FIPS** is an under-development encrypted mesh networking protocol. It handles cryptographic peer addressing, transport and routing; it is not a consensus replacement. This portfolio does **not** claim that a functioning FIPS network was deployed by Maximoto.
4. **AI/ML**: embeddings, retrieval, inference and human authorization remain separate. Model output and retrieved documents are untrusted; no agent has a wallet or Nostr publication key.

## User experience and integrity expectations

- All case-study selectors and node selectors are actual buttons with `aria-pressed`; progress uses an accessible progressbar.
- Each node's trust boundary and failure scenario can be inspected without external data loading.
- The quorum illustration operates on exactly four manually toggled validator flags, with 3-of-4 as a conceptual threshold. It models **availability only**: it does not simulate PBTS, Byzantine behavior, message timing, network partitions or consensus proofs.
- Every project case has source links and scoped status. No invented metrics.
- Copying an architecture brief is explicitly user initiated and never sends data to an AI endpoint.
- `/api/architecture` declares `read/cite/analyze` as intended uses; those labels are advisory metadata, not access-control enforcement.

## Suggested follow-up improvements

**P1 — Ship after this PR is reviewed:** accessibility audits on mobile and desktop, focus order and real-browser interactions, visual regressions, relevant source freshness, and automated link checking. Audit the validity of project claims whenever upstream changes.

**P2 — Agentic portfolio guide:** an opt-in visitor-side research assistant that uses only typed `/api/architecture` case data and actual cited source links. Render an inspectable evidence drawer and let visitors challenge an answer, inspect retrieval context, and report unsupported statements. No auto-execution or background wallet/signing authority.

**P3 — Maintainer case studies:** add structured ADR excerpts, reviewed diffs and trade-offs such as "Why CometBFT rather than a relay arrival order?", "Why FIPS is a transport layer rather than consensus?", and "Why a NIP-07 signer is outside agent authority?". Treat public prototypes as in progress until production proof exists.

**P4 — ML systems portfolio:** showcase reproducible RAG evals (faithfulness, citation grounding, recall, latency and cost) using actual, dated, reproducible measurement data; include failure cases and compare baselines. Never invent a benchmark or label synthetic charts "live".

**P5 — Security and maintenance:** consolidate prior legacy UI and RAG files, remove any nsec-paste guestbook pathway, replace `.npmrc` legacy-peer workaround by resolving dependency versions and lockfile, and move from scoped lint to repository-wide clean CI.

## Release gates

- `npm ci`, TypeScript, scoped ESLint, editorial tests, Systems Lab contracts and `npm run build`.
- Check preview manually for touch keyboard navigation, CSS overflow, copying briefs, all linked sources and every quorum state.
- Verify Vercel deployment success before merging. GitHub CI green does not guarantee the live deployment or its runtime behavior.
