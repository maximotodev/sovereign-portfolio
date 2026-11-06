# Sovereign Portfolio / Newstr

**A source-linked engineering portfolio for Bitcoin, Nostr, AI, and freedom tech.**

**[Live portfolio](https://maximotodev.vercel.app)** · **[Systems Lab](https://maximotodev.vercel.app/systems)** · **[Newstr](https://maximotodev.vercel.app/newsletter)** · **[Maximoto on GitHub](https://github.com/maximotodev)**

The site presents selected engineering work with verifiable pull requests, project architecture, failure modes, and explicit boundaries between prototypes and production systems. The visual direction is intentionally minimal and cypherpunk: evidence before badges, logos, or fabricated activity counters.

## What reviewers can inspect

| Surface | Purpose | Where to look |
| --- | --- | --- |
| **Portfolio** | Narrative and source-linked open-source contributions, including Plebeian Market PRs | [`src/app/page.tsx`](src/app/page.tsx) |
| **Systems Lab** | Interactive architecture case studies: components, trust boundaries, failure scenarios, mitigations and references | [`src/app/systems`](src/app/systems) · [`docs/SYSTEMS_LAB.md`](docs/SYSTEMS_LAB.md) |
| **Architecture JSON** | Read-only structured case-study data for inspection and reuse; advisory capabilities are not authorization | [`src/app/api/architecture`](src/app/api/architecture) |
| **Newstr** | Archive of writing with a distinction between legacy essays and cryptographically signed Nostr events | [`src/app/newsletter`](src/app/newsletter) |
| **Studio** | Human-driven editorial tooling and NIP-07 signing boundary, separate from public reader flows | [`src/app/studio`](src/app/studio) |

## Architecture and trust model

- **Framework:** Next.js App Router, React, TypeScript, Tailwind/CSS; route metadata includes robots and sitemap.
- **Nostr:** Signed kind-30023 articles are checked for event identity/signature/author rather than trusting relay delivery. The checked-in verified-event snapshot starts empty until explicitly refreshed; an empty archive is not evidence of signed publication.
- **Editorial authorization:** Publishing and signing remain explicit human-driven actions via a signer; an autonomous agent does not receive an `nsec` or blanket wallet/signing authority.
- **Read boundaries:** Public browsing is read-only. The retired public chat and guestbook API routes are intentionally absent. Browser-security headers include a **report-only** CSP pending browser validation.
- **Freedom-tech experiments:** FIPS mesh and decentralized auction examples are architectural demonstrations, not claims of a deployed FIPS production network or real-money auction finality.

See [`docs/SOVEREIGN_PORTFOLIO_RUNBOOK.md`](docs/SOVEREIGN_PORTFOLIO_RUNBOOK.md) for release and trust boundaries and [`docs/NSITE-001.md`](docs/NSITE-001.md) for the manual nsite experiment.

## Run locally

Requires a current Node.js/npm environment compatible with the project lockfile (CI targets Node 24).

```bash
git clone https://github.com/maximotodev/sovereign-portfolio.git
cd sovereign-portfolio
npm ci
npm run dev
```

Open `http://localhost:3000`. Some relay-backed features require network access and only present verifiable signed content. Do not add Nostr secret keys, wallet credentials, or service-role secrets to client-exposed environment variables.

## Quality gates

```bash
npm ci
npx tsc --noEmit
npm run lint
node --experimental-strip-types --test tests/*.test.mjs
npm run build
```

Before publishing, review the Vercel preview, mobile/keyboard navigation, signed-article provenance, linked project evidence and the browser CSP report. A green CI run does not by itself prove production behavior.

## Project map

- [`src/lib`](src/lib): typed portfolio/source data, Nostr articles, and validation/helpers
- [`src/components`](src/components): reader and interactive Systems Lab components
- [`docs`](docs): protocol decisions, UX iterations, editorial integration, security and release notes
- [`tests`](tests): regression and trust-boundary tests
- [`scripts`](scripts): maintainer-run operational scripts, including signed-event snapshot refresh

## Status and contribution

This is an actively evolving personal project. Prototypes and experimental integrations are labeled in their relevant documents; external pull requests are linked for independently checkable evidence. Issues and PRs are welcome, but publishing/signing/deployment stay human-reviewed.
