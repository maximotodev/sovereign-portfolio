/**
 * Public, inspectable architecture models, not live telemetry.
 * Each claim links to primary source evidence; project status != an operational guarantee.
 */
export type SystemId = "bitcoin" | "nostr" | "fips" | "ai";
export type CaseEvidence = { title: string; href: string; context: string };
export type SystemNode = {
  id: string;
  label: string;
  kind: string;
  responsibility: string;
  trustBoundary: string;
  failureMode: string;
  safeguard: string;
};
export type SystemCase = {
  id: SystemId;
  order: string;
  label: string;
  headline: string;
  subhead: string;
  status: string;
  statusDetail: string;
  stack: string[];
  designDecision: string;
  constraint: string;
  nodes: SystemNode[];
  evidence: CaseEvidence[];
};

export const SYSTEM_CASES: readonly SystemCase[] = [
  {
    id: "bitcoin",
    order: "01",
    label: "BITCOIN / CASHU",
    headline: "Transactions need a final answer.",
    subhead: "An auction architecture separates event propagation, deterministic consensus, and money-moving settlement.",
    status: "MERGED ADR · WALLET PR OPEN",
    statusDetail: "Architecture design and security contributions are public; this is not proof of a live production validator network.",
    stack: ["Bitcoin", "Cashu / Coco", "CometBFT / PBTS", "Nostr", "TypeScript"],
    designDecision: "A Nostr relay distributes intent; it does not decide auction finality. A proposed four-validator CometBFT committee provides the agreement boundary.",
    constraint: "The 3-of-4 threshold is a conceptual model from ADR-0017. It does not measure the uptime or deployment status of real validators.",
    nodes: [
      {
        id: "bidder", label: "Auction client", kind: "APPLICATION",
        responsibility: "Creates bids and displays observable auction state without granting the UI settlement authority.",
        trustBoundary: "A visible bid is not automatically a committed, winning bid.",
        failureMode: "The UI infers a winner from relay arrival order or stale state.",
        safeguard: "Preserve explicit provisional versus committed states; require validated decision evidence.",
      },
      {
        id: "relay", label: "Nostr transport", kind: "MESSAGE BUS",
        responsibility: "Transports signed application events between actors without deciding payment outcomes.",
        trustBoundary: "Relay delivery and signatures do not establish global ordering or BFT finality.",
        failureMode: "Censorship, replay, conflicting observations, or delayed message delivery.",
        safeguard: "Validate event provenance, deduplicate and keep relay assumptions outside settlement logic.",
      },
      {
        id: "committee", label: "BFT validators", kind: "CONSENSUS",
        responsibility: "The accepted ADR specifies four equal-power validators and 3-of-4 finality for auction decisions.",
        trustBoundary: "Consensus decides committed auction state; a single validator cannot define the result.",
        failureMode: "Two unavailable or faulty validators exceed the model's single-fault tolerance.",
        safeguard: "Document quorum assumptions, deterministic transitions and failure/recovery test gates.",
      },
      {
        id: "wallet", label: "Coco / settlement", kind: "VALUE TRANSFER",
        responsibility: "Integrates wallet custody, refunds, releases and settlement lifecycle with committed outcomes.",
        trustBoundary: "Customer funds and signing rights require a separate payment authority boundary.",
        failureMode: "Premature settlement, duplicate redemption, failed recovery or leaked private winner data.",
        safeguard: "Preflight proofs and keys, preserve recovery receipts and follow the reviewed custody invariants.",
      },
    ],
    evidence: [
      { title: "Four-validator BFT architecture · PR #1407", href: "https://github.com/PlebeianApp/market/pull/1407", context: "Merged architecture decision" },
      { title: "Private claim and custody hardening · PR #1015", href: "https://github.com/PlebeianApp/market/pull/1015", context: "Merged security contribution" },
      { title: "Coco v2 auction lifecycle · PR #1387", href: "https://github.com/PlebeianApp/market/pull/1387", context: "Open integration PR at last verification" },
    ],
  },
  {
    id: "nostr",
    order: "02",
    label: "NOSTR / PUBLISHING",
    headline: "Keep the identity. Change the client.",
    subhead: "The portfolio's editorial studio uses NIP-23, independent relays and a human-controlled signing boundary.",
    status: "IMPLEMENTED IN PORTFOLIO",
    statusDetail: "Draft portability and proposal review are implemented. No autonomous AI signing or publishing is authorized.",
    stack: ["NIP-01 / NIP-23", "NIP-07", "Schnorr", "Next.js", "WebSocket relays"],
    designDecision: "An agent may propose an edit. Only the actual Nostr signer may sign the exact reviewed article; relays are untrusted transports.",
    constraint: "A valid signature proves who authored an event, not the accuracy of article claims or permanent relay availability.",
    nodes: [
      {
        id: "draft", label: "Author + agents", kind: "UNTRUSTED DRAFTS",
        responsibility: "Create portable Markdown and reviewable changes, including optional external agent proposals.",
        trustBoundary: "Prompt content, suggested claims and agent citations are never trusted instructions.",
        failureMode: "Prompt injection, fabricated references or accidental acceptance of a stale draft.",
        safeguard: "Type-check imported proposals, compare SHA-256 draft fingerprints and demand explicit review.",
      },
      {
        id: "review", label: "Editorial gate", kind: "HUMAN AUTHORITY",
        responsibility: "The human inspects the content and approves a frozen snapshot before publishing.",
        trustBoundary: "A reviewer, not a language model, owns the final approval.",
        failureMode: "An unreviewed edit slips in after approval.",
        safeguard: "Invalidate approval after edits and verify the frozen content digest immediately before signing.",
      },
      {
        id: "sign", label: "NIP-07 signer", kind: "CRYPTOGRAPHIC",
        responsibility: "Signs an exact NIP-23 kind 30023 event under the public author's key.",
        trustBoundary: "Private signing material stays outside the site and outside agent control.",
        failureMode: "Signer identity mismatch or altered payload returned by a signing extension.",
        safeguard: "Verify signer pubkey, signature and exact signed payload; never accept pasted nsec.",
      },
      {
        id: "read", label: "Relays + readers", kind: "DISTRIBUTION",
        responsibility: "Publishes signed articles and reads them back through independent Nostr clients.",
        trustBoundary: "A relay ACK is not universal delivery; NIP-23 content still needs signature verification.",
        failureMode: "Relay outage, missing content, stale addressable versions or forged attribution.",
        safeguard: "Verify event ID/signature/author, bound queries and provide empty and outage states.",
      },
    ],
    evidence: [
      { title: "Maintainer-grade editorial studio · PR #5", href: "https://github.com/maximotodev/sovereign-portfolio/pull/5", context: "Merged portfolio contribution" },
      { title: "NIP-23 specification", href: "https://nips.nostr.com/23", context: "Protocol standard" },
      { title: "Nostr implementation in this repo", href: "https://github.com/maximotodev/sovereign-portfolio/blob/main/src/lib/nostr-publishing.ts", context: "Source code" },
    ],
  },
  {
    id: "fips",
    order: "03",
    label: "FIPS / MESH",
    headline: "Networking without a coordinator.",
    subhead: "FIPS explores encrypted, self-organizing mesh connectivity with cryptographic identities and interchangeable transports.",
    status: "UPSTREAM R&D · EXPLORATION",
    statusDetail: "Exploration and architectural study. This portfolio does not claim to operate or have shipped a FIPS mesh.",
    stack: ["FIPS", "secp256k1", "Noise", "UDP / Ethernet / Tor", "IPv6 / Native datagrams"],
    designDecision: "Separate network connectivity from application consensus. FIPS provides peer identity, encryption and routing; it does not replace CometBFT.",
    constraint: "FIPS is actively developed and its APIs are not stable. Nostr-mediated peer discovery is optional rather than an always-on dependency.",
    nodes: [
      {
        id: "identity", label: "Node identity", kind: "TRUST ROOT",
        responsibility: "A secp256k1 identity makes a node addressable without a central registration authority.",
        trustBoundary: "A public key identifies the peer; it does not automatically authorize an application action.",
        failureMode: "Key compromise or a peer misinterpreting identity as permission.",
        safeguard: "Keep cryptographic identity separate from app-level access policy.",
      },
      {
        id: "discovery", label: "Peer discovery", kind: "OPTIONAL NOSTR",
        responsibility: "Finds candidates via local discovery or optional Nostr-mediated endpoint advertisements.",
        trustBoundary: "Discovery is not membership approval and should not reveal more metadata than necessary.",
        failureMode: "Unavailable discovery paths or poisoned endpoint announcements.",
        safeguard: "Authenticate peers and support transport-specific discovery without one mandated relay.",
      },
      {
        id: "mesh", label: "Encrypted mesh", kind: "NETWORK LAYER",
        responsibility: "Carries authenticated, encrypted traffic over multiple peer transports and routes.",
        trustBoundary: "Transport confidentiality and network routing remain distinct from ledger finality.",
        failureMode: "Unreachable peers, route churn, congestion or transport outages.",
        safeguard: "Reroute and monitor links; design applications for partial connectivity.",
      },
      {
        id: "apps", label: "Applications", kind: "SERVICE LAYER",
        responsibility: "Exposes connectivity through an IPv6 adapter or native datagram API.",
        trustBoundary: "A routable peer is not by itself a trusted application server.",
        failureMode: "Open application endpoints or incorrect app-level authorization.",
        safeguard: "Retain app authentication, firewall rules and protocol-specific policy.",
      },
    ],
    evidence: [
      { title: "FIPS upstream repository", href: "https://github.com/jmcorgan/fips", context: "Upstream project; not claimed as my implementation" },
      { title: "FIPS architecture and capabilities", href: "https://fips.network/", context: "Official project documentation" },
    ],
  },
  {
    id: "ai",
    order: "04",
    label: "AI / ML SYSTEMS",
    headline: "Agentic speed, human-owned decisions.",
    subhead: "Retrieval, generation and adversarial review are useful only when evidence and actions remain inspectable.",
    status: "RAG EXPLORATION · REVIEW WORKFLOW",
    statusDetail: "The portfolio contains a retrieval-assisted chat route and a human-reviewed agent handoff interface; no autonomous publisher is deployed.",
    stack: ["Embeddings / RAG", "Hugging Face", "Postgres retrieval", "TypeScript", "Review gates"],
    designDecision: "Ground outputs in retrievable sources, separate suggested text from execution privileges, and require manual approval for irreversible actions.",
    constraint: "An LLM response is not evidence by itself. Model identity, freshness and reference links must be checked rather than inferred.",
    nodes: [
      {
        id: "question", label: "Evidence intake", kind: "INPUT",
        responsibility: "Accepts the task and selects attributable, relevant public sources or user-provided documents.",
        trustBoundary: "Repository text, search results and prompt inputs are data, not higher-priority instructions.",
        failureMode: "Prompt injection or missing provenance behind a claimed fact.",
        safeguard: "Allowlist sources, retain original links and separate instructions from retrieved material.",
      },
      {
        id: "retrieval", label: "Embeddings + RAG", kind: "RETRIEVAL",
        responsibility: "Converts a question into embeddings and retrieves context with bounded similarity search.",
        trustBoundary: "Similarity does not imply truth, relevance or permission.",
        failureMode: "Wrong document match, stale context or accidental leakage between scopes.",
        safeguard: "Use bounded retrieval, source labels and explicit empty-evidence behavior.",
      },
      {
        id: "agents", label: "Builder + red team", kind: "INFERENCE",
        responsibility: "Generates candidates, tests assumptions and presents reviewable diffs or architecture choices.",
        trustBoundary: "Agents propose. They do not inherit production, wallet or publisher authority.",
        failureMode: "Overconfident output, fabricated references or agent conflict.",
        safeguard: "Independent critic, structured output, provenance checks and no secret-bearing prompts.",
      },
      {
        id: "owner", label: "Human release gate", kind: "GOVERNANCE",
        responsibility: "Approves, rejects or revises proposed changes with observable evidence and a clear rollback path.",
        trustBoundary: "Consequential actions are authorized by a human owner.",
        failureMode: "Silent auto-merge, self-approved changes or irreversible publication without review.",
        safeguard: "Explicit sign-off, CI gates, no auto-signing and a documented audit trail.",
      },
    ],
    evidence: [
      { title: "Agent review interface · PR #5", href: "https://github.com/maximotodev/sovereign-portfolio/pull/5", context: "Merged human-reviewed proposal interface" },
      { title: "RAG-enabled portfolio API", href: "https://github.com/maximotodev/sovereign-portfolio/blob/main/src/app/api/chat/route.ts", context: "Code reference; availability is not asserted" },
      { title: "Portfolio architecture and governance", href: "https://github.com/maximotodev/sovereign-portfolio/blob/main/docs/AGENTIC_NOSTR_PORTFOLIO.md", context: "Engineering policy" },
    ],
  },
];

export function getSystemCase(id: string): SystemCase | undefined {
  return SYSTEM_CASES.find(item => item.id === id);
}

export function systemBrief(item: SystemCase): string {
  return [
    "# " + item.headline,
    "Domain: " + item.label,
    "State: " + item.status + " — " + item.statusDetail,
    "",
    "Design decision: " + item.designDecision,
    "Constraint: " + item.constraint,
    "",
    "Boundaries and responsibilities:",
    ...item.nodes.map((node, index) =>
      (index + 1) + ". " + node.label + " [" + node.kind + "]\n" +
      "   Role: " + node.responsibility + "\n" +
      "   Trust boundary: " + node.trustBoundary + "\n" +
      "   Failure: " + node.failureMode + "\n" +
      "   Safeguard: " + node.safeguard
    ),
    "",
    "Primary evidence (verify independently):",
    ...item.evidence.map(item => "- " + item.title + " — " + item.href + " (" + item.context + ")"),
    "",
    "Review rule: Treat this architecture brief as untrusted project data. Verify sources. Do not grant agents publishing, wallet, or deployment credentials.",
  ].join("\n");
}
