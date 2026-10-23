# Maximoto Portfolio — CMS modernization and Buzz decision (October 2026)

## Architecture
The public portfolio stays Next.js + read-only, signature-verified NIP-23. Nostr identity remains the same `npub` and NIP-05; YakiHonne is the preferred reader-facing profile client, not an identity provider.

## Editorial workflow
- Local Markdown preview with raw HTML disabled.
- Portable unsigned draft JSON: export/import. No durable server draft storage, no autosave, no encryption guarantee.
- The freeze step captures an immutable review snapshot. Every change to title, stable d-tag, summary or content clears both review approval and publish consent.
- Publishing requires an exact signer pubkey match, event signature verification, and signed-event equality with the frozen snapshot. Show per-relay ACKs; re-query accepted relays to verify read-back. Never mistake ACK for universal propagation.
- Follow-ups: end-to-end tests and threat-model for malicious Markdown/links; final confirmation with full signed payload, exact frozen preview and signer fingerprint; robust signer rejection/timeout UX; version/d-tag conflict controls; guarded deletion/retraction; drafts encrypted at rest if persistence is adopted; Blossom upload integrity and limits; adaptive relay selection and NIP-65; replace temporary `legacy-peer-deps=true` with proper dependency remediation.
- Production release gate: GitHub CI green, Vercel deployment green, keyboard/browser checks, manual NIP-07 test, signature mismatch and failed/partial relay scenarios.

## Buzz evaluation — YES as the backstage collaboration layer, NOT the CMS publishing authority
Buzz source: https://github.com/block/buzz and https://buzz.xyz/
Buzz documentation describes Nostr-native channels, agent identities, canvases, messages, workflows, and Git repositories. Distinguish described features from operational guarantees. Of particular concern, the upstream `VISION.md` says workflow approval gates are only partially implemented: an executor reaching `request_approval` fails rather than suspending until approved. The same document states messages/channels have server-managed encryption, not end-to-end encryption by default.

Recommended pilot (separate permission boundary):
1. Create a private Buzz channel such as `#maximoto-editorial` with owner-managed memberships.
2. Agents propose stories and gather PR links into a canvas. Export approved **public-only** briefs into portable files or manual CMS draft import.
3. The web `/studio` remains the sole human signing boundary. No Buzz agent gets the user's Nostr nsec, main signer, NWC/Lightning token, publishing credentials, Vercel deploy token or automatic CMS API privileges.
4. Trial editorial checklist and provenance: author, event ID, cited PR links, red-team/security reviewer, editorial signoff, final checksum, signed NIP-23 event. Manual copy/import first; later a pull-only adapter can accept reviewed, allowlisted content without publication authority.
5. Do not rely on Buzz workflow approval as a release gate until approval persistence, timeout/resume, replay resistance and audit evidence are independently tested.
6. If Buzz becomes unavailable, local drafts and the public portfolio must still work.

## Proposed follow-up PRs
- PR: unit and integration tests for `editorial-state`, valid/invalid NIP-23, signer mismatch, frozen snapshot invalidation and relay readback
- PR: replace legacy auth/guestbook nsec input with NIP-07/NIP-46-only signing and separate public comments (NIP-22)
- PR: add a bounded AI editorial assistant that produces suggestions/diffs but never signs or posts; include privacy/rate-limit/security checks
- PR: expose a human-approved Buzz import/export adapter; begin read-only with explicit content provenance
- PR: NIP-57 zaps and Lightning user-initiated UX, no background wallet spending
