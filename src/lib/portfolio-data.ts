export const IDENTITY = {
  handle: "Maximoto",
  github: "https://github.com/maximotodev",
  source: "https://github.com/maximotodev/sovereign-portfolio",
  npub: "npub165ka9706vpl8phnw0w5wh89za8nnl56dajz92h6e2m9uxxvkz6wszt0gn5",
  pubkey: "d52dd2f9fa607e70de6e7ba8eb9ca2e9e73fd34dec84555f5956cbc31996169d",
  nip05: "maximotodev@maximotodev.vercel.app",
  // Human-friendly client URL. The npub and NIP-05 remain client-independent.
  nostr: "https://yakihonne.com/profile/maximotodev@maximotodev.vercel.app",
  nostrProtocol: "nostr:npub165ka9706vpl8phnw0w5wh89za8nnl56dajz92h6e2m9uxxvkz6wszt0gn5",
  ngit: "https://gitworkshop.dev/npub165ka9706vpl8phnw0w5wh89za8nnl56dajz92h6e2m9uxxvkz6wszt0gn5",
} as const;

// Public PR links are auditable evidence, not inferred aggregate contribution metrics.
// Status labels are a documented 2026-10-22 snapshot; follow the links for live status.
export const EVIDENCE = [
  {
    title: "SatsRover architecture",
    area: "SYSTEM DESIGN",
    detail: "A source-linked Next.js and FastAPI prototype with explicit data, cache, and indexing boundaries.",
    status: "Prototype",
    url: "https://github.com/maximotodev/sats-rover/blob/main/docs/architecture.md",
  },
  {
    title: "Sovereign Portfolio trust model",
    area: "SECURITY",
    detail: "Human-controlled Nostr signing, documented release boundaries, and evidence-first project claims.",
    status: "Open source",
    url: "https://github.com/maximotodev/sovereign-portfolio/blob/main/docs/SOVEREIGN_PORTFOLIO_RUNBOOK.md",
  },
  {
    title: "Nostr Notifier privacy boundary",
    area: "PROTOCOL",
    detail: "Public relay monitoring without collecting or storing users' private keys.",
    status: "Open source",
    url: "https://github.com/maximotodev/Nostr-Notifier",
  },
] as const;

export const VENTURES = [
  {
    index: "01",
    title: "SatsRover",
    type: "PRODUCT / EXPERIMENT",
    text: "A Bitcoin-first local-discovery experiment integrating map-based exploration with portable Nostr identity and noncustodial payment primitives.",
    tags: ["DISCOVERY", "NWC", "MAPS"],
    url: "https://github.com/maximotodev/sats-rover",
    highlight: true,
  },
  {
    index: "02",
    title: "Sovereign Portfolio",
    type: "FOSS / APPLIED AI",
    text: "A portfolio-as-protocol: publicly auditable evidence, Nostr-signed writing, and human-approved editorial automation.",
    tags: ["NEXT.JS", "NIP-23", "AGENTS"],
    url: "https://github.com/maximotodev/sovereign-portfolio",
    highlight: false,
  },
  {
    index: "03",
    title: "Nostr Notifier",
    type: "FOSS / BROWSER EXTENSION",
    text: "A privacy-conscious browser extension that watches public Nostr relays for mentions and messages without using private keys.",
    tags: ["NOSTR", "PRIVACY", "CHROME"],
    url: "https://github.com/maximotodev/Nostr-Notifier",
    highlight: false,
  },
] as const;

export const PRINCIPLES = [
  { id: "01", name: "Trust boundaries first", detail: "Keep signing, identity, custody, and authority explicit. Default-deny ambiguous states." },
  { id: "02", name: "Evidence over assertions", detail: "Link the PR, reproduce the test, and distinguish prototypes from production." },
  { id: "03", name: "Humans own the merge", detail: "AI drafts and critiques. A human reviews, signs, approves, and publishes." },
  { id: "04", name: "Exit is a feature", detail: "Portable Nostr identity, exportable writing, interoperable clients, and FOSS tooling." },
] as const;
