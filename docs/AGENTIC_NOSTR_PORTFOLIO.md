# Maximoto — Agentic Nostr-Native Portfolio
## Implementation checkpoint — October 2026

### Architecture
- Next.js 16 application, redesigned from the ground up as an editorial cypherpunk portfolio.
- Static, source-linked maintainer ledger is the primary evidence surface.
- Signed dispatches are NIP-23 (kind 30023); the public homepage is read-only, queries bounded, validates signatures and author, and degrades safely when relays are offline.
- Editorial studio at `/studio` is client-side and requires explicit manual NIP-07 authorization to sign and publish. It never requests or stores nsec, credentials, or a remote admin token.
- Optional upstream organizational CMS: https://github.com/bitkarrot/nostr-cms. Treat as a separate publishing frontend, not a drop-in dependency. This branch doesn't deploy the upstream CMS or its relay/server.

### Non-negotiable trust boundaries
1. `src/lib/portfolio-data.ts` contains the explicit approved Nostr identity, matched to `public/.well-known/nostr.json`.
2. Only verified events by that pubkey are presented as Maximoto's articles. Relays are untrusted transports.
3. The studio demands an exact author match and checks the returned signed event. Agent text is never given signing authority.
4. Signing requires live browser interaction and an acknowledgement checkbox; sending to relays is NOT automatic after drafting.
5. Private drafts remain in component memory and disappear on reload. They are **not** durably encrypted or synced. The copy-template action copies an unsigned event body.
6. Relay acknowledgements do not prove all relays or subscribers received a post. A separate read-back check remains a future requirement.
7. Frontend markdown uses `react-markdown` with HTML skipped. Do not introduce `rehype-raw` or auto-fetch unsafe external embeds without adversarial review.
8. The old guestbook's nsec paste flow is deliberately **not** linked from the new homepage. It remains in the legacy source tree and must be removed or hardened before re-exposing it.

### Review gates before merging
- Typecheck/lint/build, mobile/desktop visual inspection and accessibility contrast, keyboard navigation, hydration, external-link integrity.
- NIP-23 fixture tests: valid event, wrong pubkey, invalid signature, altered content, future timestamp, duplicate d-tag, malicious markdown, oversize, relay timeout, same-address revisions.
- Studio tests: no NIP-07 signer, incorrect signer pubkey, signer rejection, corrupted signed event, all relays down, partial ACK, duplicate click, no authorization.
- Confirm NIP-05 ownership on the public domain (a profile-level DNS identifier alone does not prove site ownership).
- Protect signing against content modification between human acknowledgement and signer confirmation. Document verification and use a final immutable preview/confirmation step before operational publication.
- Review the upstream Bitkarrot CMS authorization, raw-nsec opt-in default, remote nostr.json admin roles, relay fallbacks, drafts and scheduled publishing. Do not deploy without audit.
- Agent assistance: implemented editorial rules and human gates are the first phase; an LLM-powered drafting/review endpoint is **not** implemented in this PR. Never describe it as deployed.
- Zaps, comments, persistent encrypted drafts, image uploads and scheduler are intentionally excluded until separate security-gated follow-up PRs.

### Release sequence
1. Review deployment preview, run checks, and merge after green gates.
2. Seed actual independently signed NIP-23 posts by the verified identity. Confirm relay propagation.
3. Review and deploy Bitkarrot's CMS separately, if desired; bridge content by NIP-23.
4. Add AI review assistance only with server-side rate limits, no key access, untrusted-output handling, and a mandatory diff/approval.
5. Add Lightning zaps and portable NIP-22 comments after independent security review.
