# Nostr CMS integration decision (October 2026)

## Decision: use Nostr CMS for publishing, not as a replacement for the Next.js portfolio

Source: https://github.com/bitkarrot/nostr-cms  
Setup: https://setupcms.hivetalk.org/

The portfolio already uses Next.js and nostr-tools. Keep the homepage, project cards, proof-of-work links, and SEO-critical content in the portfolio repository. Evaluate Nostr CMS as an optional separate authoring surface for NIP-23 (kind 30023) long-form articles, with media on Blossom. Do not deploy its admin dashboard inside the public portfolio until after an independent security review.

### Proposed incremental architecture
1. Establish ownership of a verified Nostr author pubkey. Configure authorized relay endpoints and a narrowly-scoped signer (NIP-07 or another explicit signer). Do not expose an nsec to the web application or CI.
2. Implement a **read-only** Next.js article adapter to fetch kind 30023 posts by the allowlisted author from multiple configured relays. Validate the event ID, signature, author, kind, and expected tags. Prefer bounded queries and timeouts.
3. Retain a build-time or ISR fallback/cache of previously validated articles, to avoid blank pages on relay failures. Never trust a single relay as an authenticity guarantee.
4. Render markdown safely without raw HTML. Add stable article slugs, canonical URLs, metadata, and feed discovery links. Keep authored Markdown in git until migration is proven.
5. Test relay outages, malicious markdown and URLs, duplicate/edited articles, deleted events, author impersonation, Blossom media availability, size limits, and hydration. Run dependency audit and red-team review before production integration.
6. Only after the read-only pilot passes, evaluate the CMS publishing workflow and optional Lightning zaps (wallet credentials never embedded in frontend). Use one primary author identity with redundant write relays and export capability.

### Current CMS technical considerations
- The upstream README documents NIP-23 articles, Blossom, NIP-52 events, NIP-57 zaps, remote nostr.json administrator validation, primary/secondary admin roles, and a default CMS relay.
- It is a React/Vite app with organizational/event-management scope, not a drop-in headless Next.js content API.
- Its default relay is used as a CMS source of truth. Preserve independent signed backups and multiple relays to reduce availability dependence.
- Verify the status and security of all remote admin auth paths and signing boundaries. Read the implementation, not just the README.
- Nostr CMS is not installed or deployed by this PR; this document is a deliberate design checkpoint.

## Portfolio work completed in this branch
- Current AI/ML, Bitcoin, Nostr, FIPS and FOSS focus.
- Featured Plebeian Apps with public PR proof and explicit merged vs open labels.
- Replaced fabricated contribution chart and fixed commit/PR totals with public API metrics and a canonical PR link.
- Corrected third-party Bitcoin network information being presented as local node telemetry.
- Removed unverified “Online” LLM model claim and full-name mention in public chatbot text.
