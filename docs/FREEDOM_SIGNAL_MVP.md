# Freedom Signal — Newsletter MVP

Freedom Signal is a weekly, human-signed Nostr long-form publication from Maximoto. This implementation intentionally remains **small**: one template, an editable TL;DR, deterministic structural checks, explicit NIP-07 approval and a source-verified archive.

## Implementation

- `/studio` presents an issue number, a week-ending date, and a **New weekly issue** action. Existing content must be explicitly replaced. Every template contains a short TL;DR followed by The Signal, Bitcoin & Lightning, Nostr & Freedom Tech, AI / ML, Maximoto's Workshop and Further Reading.
- The **TL;DR editor** writes 3–5 single-line Markdown takeaways back into the original draft. It does not silently generate facts or call an LLM. Research agents may use the existing draft handoff/review interface, but their proposals must be inspected and accepted by the author.
- `newsletterChecks` validates the identifier/title, section structure, TL;DR citations, source links and removal of TODO placeholders. URL validation is **syntactic only**: it does not establish source accuracy or trustworthiness.
- A structurally incomplete newsletter cannot be frozen for approval or published through the Studio flow. Any edit still invalidates approval; the signed event must match the reviewed content.
- Newsletters publish as signed **NIP-23 kind 30023** events with a stable `d` identifier and `t` topic tags. The author remains the same existing Nostr identity.
- `/newsletter` discovers the author's signed NIP-23 newsletter events and `/newsletter/[identifier]` renders a simple public article view. The archive uses the existing event ID, author and Schnorr verification; relay errors and empty states are explicit.
- No nsec paste, agent signing, newsletter emails, scheduled publishing, zaps, comments, wallet access, analytics claims or fabricated issues are introduced.

## Naming

The NIP-23 addressable `d` tag is `freedom-signal-<issue-number>-<YYYY-MM-DD>` (e.g. `freedom-signal-001-2026-11-06`). Keep it unchanged when editing/revising the same issue. Number and date are intended to be unique, but the MVP does not reserve names or check for collisions on remote relays.

## Manual rehearsal (do not publish the test fixture)

1. Open `/studio` and select **Issue 1** and the intended Friday in local time. Click **New weekly issue**.
2. Turn on Markdown preview. Replace all TODO placeholders with researched material and source links. Use the 3–5 item TL;DR editor to add concise, cited takeaways.
3. Verify the **Newsletter readiness** section shows all six checks passing. Independently check the cited sources and avoid unsupported headlines.
4. Export the unsigned JSON draft and import it again. Confirm the same title, d-tag, summary and content return.
5. Export an agent handoff and import an agent proposal via the existing review interface. Confirm the SHA-256 base digest is enforced, no d-tag changes can be applied, and accepting a proposal clears signing approval.
6. With a **non-publishing** fixture, test signer absence, wrong pubkey, rejection and a draft edit after review. Confirm no event is published in those cases. Do not use production Nostr keys for tests that might publish accidentally.
7. After full review of an actual newsletter, verify NIP-07 signer identity, freeze the reviewed content, explicitly approve, sign, and inspect relay ACK/read-back. Public Nostr signatures and publications are durable and may be widely replicated.
8. Confirm the issue appears in `/newsletter` and at `/newsletter/<d-tag>`, displaying a source-linked TL;DR and the signed original link. Test network loss and slow relays.
9. Preview on mobile and desktop; check keyboard operation, archive links, Markdown, exact Nostr identity and layout.

## Limitations and next steps

- The archive is **client-side, read-only** and queries a bounded amount of recent authored events. It is not yet an SEO-ready server-rendered archive, nor does it guarantee completeness or availability across every relay. Add a signature-verified, cached, indexed server adapter later.
- The reader presents TL;DR once in a highlighted summary and suppresses the duplicate Markdown heading in the article body. The original signed Markdown is preserved unchanged.
- The TL;DR editor does not perform automatic text generation or validate external claims. Add optional bounded AI suggestions behind explicit review, server-side limits and citations in a separate PR.
- Each article's `published_at` tag currently follows the existing Studio behavior (current signing time); a future revision-aware editor should preserve the original first-published timestamp.
- For eventual email/RSS delivery, use a separate opt-in subscriber service; never equate a Nostr address with email consent.
- Before expanding features: dependency audit, broad code lint, and legacy guestbook private-key input removal remain separate security work.

## Verification

`npm ci`, TypeScript, targeted ESLint, all editorial/architecture/newsletter contract tests, and `npm run build` must pass before merge. A successful Vercel deployment and human browser review remain additional release gates.
