# Maximoto — Minimal Cypherpunk Homepage

## Product decision

A personal portfolio should answer **who**, **why**, and **what has shipped** before presenting a complex engineering interface. Retain the proof-of-work ledger but make it secondary to the human story. Prefer one clear action at a time.

### Homepage information architecture
1. Story-led hero: Maximoto, independent engineer, building for freedom.
2. Origin story: hospitality background, self-taught development, Bitcoin full-node experience, the path toward Nostr.
3. Passion: Bitcoin, Nostr, FIPS exploration, and practical AI/ML, with a one-line description each.
4. Work: Plebeian Apps first, then SatsRover and the portfolio itself. Three source-linked PRs rather than a wall of metrics.
5. Nostr writing: existing signature-verified NIP-23 posts, plus a portable public `npub` copy action.
6. Single closing thought and concise identity links.

**Depth moved to /systems**, which retains the existing interactive architecture explorer, evidence sources and quorum illustration. The public `/api/architecture` endpoint remains read-only. Editorial publishing remains at `/studio`.

### Visual direction
- Near-black canvas, paper-white typography and a single warm Bitcoin-orange accent.
- No giant rotating sigil, redundant status lights, faux-terminal controls, or simulated performance data.
- Fewer boxes and decorative cards; section dividers, whitespace and typographic hierarchy do the work.
- Native/system fonts avoid remote font build dependencies.
- Responsive layout, semantic headings, keyboard actions and visible skip link.

### Recommended Nostr-native features (later PRs, in order)
1. **NIP-05 identity card:** verify `.well-known/nostr.json`, display the NIP-05 and allow public-npub copy. Never require a particular client.
2. **Signed writing archive:** SSR or ISR index with verified NIP-23 kind 30023 events, stable `naddr` permalinks and relay/cache fallback; retain signature checking and no raw HTML.
3. **Follow action:** visitor-operated client-agnostic `nostr:` URI / copy npub; never silently follow or sign.
4. **Portable comments:** NIP-22 comments tied to article references, with moderation, rate limits and resilient fallbacks. Keep anonymous reads possible and allow users to choose their signer.
5. **Lightning/zaps:** only user-initiated NIP-57 zaps after wallet/lnurl validation and anti-abuse tests. No automatic wallet spending or standing credentials.
6. **Agentic research guide:** optional, scoped, cited read-only answers from verified architecture case data. Label synthesis separately from sourced facts. No publish/wallet/deploy permissions.
7. **Multi-relay diagnostics:** show source recency and retrieval health only when measured; do not substitute decorative online indicators.
8. **Blossom media:** signed upload and safe content-addressed rendering with size/type validation and backup; optional until editorial needs demand it.

### Quality gates
- Run TypeScript, scoped ESLint (new homepage, copy control, journal, Systems route), editorial and system contract tests, Next.js production build.
- Manually inspect mobile/desktop visuals, keyboard/tab navigation, external links, NIP-23 empty and relay-offline states, and `/systems` interactions.
- No publication, agent execution or main-branch changes in this PR.
- Legacy components remain in the repo for cleanup in later scoped PRs, not imported by the new homepage. Do not advertise unimplemented functionality.

### Background technical debt
- The existing npm peer-dependency bypass needs a proper dependency/lockfile alignment.
- Existing npm security warnings require triage based on actual runtime reachability.
- Retire the legacy guestbook path that accepts raw `nsec` before re-exposing social interactions.
