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
    number: 1407,
    title: "Four-validator BFT foundation",
    area: "CONSENSUS",
    detail: "3-of-4 CometBFT/PBTS auction consensus design and failure boundaries.",
    status: "Merged",
    url: "https://github.com/PlebeianApp/market/pull/1407",
  },
  {
    number: 1411,
    title: "Leader-change anti-sniping",
    area: "AUCTIONS",
    detail: "Reviewable rules for extending an auction on a newly committed leader.",
    status: "Merged",
    url: "https://github.com/PlebeianApp/market/pull/1411",
  },
  {
    number: 1110,
    title: "NIP-17 order transport",
    area: "PROTOCOL",
    detail: "Private, gift-wrapped buyer/seller message transport boundary.",
    status: "Merged",
    url: "https://github.com/PlebeianApp/market/pull/1110",
  },
  {
    number: 1015,
    title: "Private claims & custody recovery",
    area: "SECURITY",
    detail: "Auction privacy and recovery hardening across critical settlement paths.",
    status: "Merged",
    url: "https://github.com/PlebeianApp/market/pull/1015",
  },
  {
    number: 1227,
    title: "Default-deny public bootstrap",
    area: "SECURITY",
    detail: "Fail-closed server initialization; no implicit bootstrap authority.",
    status: "Merged",
    url: "https://github.com/PlebeianApp/market/pull/1227",
  },
  {
    number: 1410,
    title: "Release dependency patch fix",
    area: "OPERATIONS",
    detail: "Reproducible production packages retaining required patched dependencies.",
    status: "Merged",
    url: "https://github.com/PlebeianApp/market/pull/1410",
  },
  {
    number: 1387,
    title: "Coco v2 auction wallet integration",
    area: "PAYMENTS",
    detail: "Cashu wallet lifecycle and recovery integration under review.",
    status: "Open PR at review",
    url: "https://github.com/PlebeianApp/market/pull/1387",
  },
  {
    number: 1424,
    title: "Marketplace variation integrity",
    area: "COMMERCE",
    detail: "Selected variant identity, stock, and image inheritance consistency.",
    status: "Open PR at review",
    url: "https://github.com/PlebeianApp/market/pull/1424",
  },
] as const;

export const VENTURES = [
  {
    index: "01",
    title: "Plebeian Apps",
    type: "MAINTAINER / ENGINEERING",
    text: "Bitcoin-native commerce and decentralized auctions. Work spanning security boundaries, Nostr messaging, Cashu payments, consensus design, and deploy reliability.",
    tags: ["NOSTR", "CASHU", "BFT", "BITCOIN"],
    url: "https://github.com/PlebeianApp/market",
    highlight: true,
  },
  {
    index: "02",
    title: "SatsRover",
    type: "PRODUCT / EXPERIMENT",
    text: "A Bitcoin-first local-discovery experiment integrating map-based exploration with portable Nostr identity and noncustodial payment primitives.",
    tags: ["DISCOVERY", "NWC", "MAPS"],
    url: "https://github.com/maximotodev/sats-rover",
    highlight: false,
  },
  {
    index: "03",
    title: "Sovereign Portfolio",
    type: "FOSS / APPLIED AI",
    text: "A portfolio-as-protocol: publicly auditable evidence, Nostr-signed writing, and human-approved editorial automation.",
    tags: ["NEXT.JS", "NIP-23", "AGENTS"],
    url: "https://github.com/maximotodev/sovereign-portfolio",
    highlight: false,
  },
] as const;

export const PRINCIPLES = [
  { id: "01", name: "Trust boundaries first", detail: "Keep signing, identity, custody, and authority explicit. Default-deny ambiguous states." },
  { id: "02", name: "Evidence over assertions", detail: "Link the PR, reproduce the test, and distinguish prototypes from production." },
  { id: "03", name: "Humans own the merge", detail: "AI drafts and critiques. A human reviews, signs, approves, and publishes." },
  { id: "04", name: "Exit is a feature", detail: "Portable Nostr identity, exportable writing, interoperable clients, and FOSS tooling." },
] as const;
