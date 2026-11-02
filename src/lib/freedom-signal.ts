/**
 * Freedom Signal — a portable NIP-23 newsletter format.
 *
 * This module deliberately has no model calls, publication actions, relay
 * connections, or secret access. Validation checks structure and URL syntax,
 * NOT whether a claim or its cited source is factually true.
 */
import type { EditorialDraft } from "./editorial-state";

export const FREEDOM_SIGNAL_TAG = "freedom-signal";
export const NEWSLETTER_HEADERS = [
  "TL;DR",
  "The Signal",
  "Bitcoin & Lightning",
  "Nostr & Freedom Tech",
  "AI / ML",
  "Maximoto's Workshop",
  "Further Reading",
] as const;

export type IssueMetadata = { issueNumber: number; weekEnding: string };
export type NewsletterCheck = {
  id: string;
  label: string;
  detail: string;
  valid: boolean;
};
const issuePattern = /^freedom-signal-(\d{3,4})-(\d{4}-\d{2}-\d{2})$/;

function realDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const date = new Date(iso + "T00:00:00.000Z");
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === iso;
}

export function parseIssueIdentifier(value: string): IssueMetadata | null {
  const match = issuePattern.exec(value);
  if (!match || !realDate(match[2])) return null;
  const issueNumber = Number(match[1]);
  if (!Number.isSafeInteger(issueNumber) || issueNumber < 1 || issueNumber > 9999) return null;
  return { issueNumber, weekEnding: match[2] };
}

export function makeIssueIdentifier(issueNumber: number, weekEnding: string): string {
  if (!Number.isSafeInteger(issueNumber) || issueNumber < 1 || issueNumber > 9999 ||
      !realDate(weekEnding)) throw new Error("Invalid issue number or week-ending date.");
  return "freedom-signal-" + String(issueNumber).padStart(3, "0") + "-" + weekEnding;
}

export function nextFridayLocal(now: Date = new Date()): string {
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  local.setDate(local.getDate() + (5 - local.getDay() + 7) % 7);
  const month = String(local.getMonth() + 1).padStart(2, "0");
  return [local.getFullYear(), month, String(local.getDate()).padStart(2, "0")].join("-");
}

function formatWeekEnding(iso: string): string {
  const date = new Date(iso + "T12:00:00Z");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function createFreedomSignalDraft(issueNumber: number, weekEnding: string): EditorialDraft {
  const identifier = makeIssueIdentifier(issueNumber, weekEnding);
  const number = String(issueNumber).padStart(3, "0");
  return {
    version: 1,
    title: "Freedom Signal — Issue #" + number,
    identifier,
    summary: "A weekly dispatch on Bitcoin, Nostr, AI/ML and freedom tech — issue #" + number + ".",
    content: [
      "# Freedom Signal — Issue #" + number,
      "",
      "*Week ending " + formatWeekEnding(weekEnding) + " · Maximoto*",
      "",
      "> Editorial draft. Source-check every claim and remove all TODO markers before review.",
      "",
      "## TL;DR",
      "",
      "- **Bitcoin:** [[TODO: one verified takeaway with a Markdown source link]]",
      "- **Nostr:** [[TODO: one verified takeaway with a Markdown source link]]",
      "- **AI / ML:** [[TODO: one verified takeaway with a Markdown source link]]",
      "- **Freedom Tech:** [[TODO: one verified takeaway with a Markdown source link]]",
      "",
      "## The Signal",
      "",
      "[[TODO: explain the biggest development and why it matters; link a primary source.]]",
      "",
      "## Bitcoin & Lightning",
      "",
      "[[TODO: verified protocol, mining, ecash, payment or infrastructure development.]]",
      "",
      "## Nostr & Freedom Tech",
      "",
      "[[TODO: verified NIP, client, FIPS, networking or FOSS development.]]",
      "",
      "## AI / ML",
      "",
      "[[TODO: verified agentic systems, open models, evaluation or architecture development.]]",
      "",
      "## Maximoto's Workshop",
      "",
      "[[TODO: link a real PR, experiment or documented lesson; distinguish work in progress.]]",
      "",
      "## Further Reading",
      "",
      "- [[TODO: add a verified primary source as a Markdown link]]",
      "- [[TODO: add a second verified primary source]]",
      "- [[TODO: add a third verified primary source]]",
      "",
      "---",
      "",
      "*Freedom Signal is researched with AI assistance and published only after human review and a Nostr signature.*",
    ].join("\n"),
  };
}

export function isFreedomSignalIdentifier(value: string): boolean {
  return parseIssueIdentifier(value) !== null;
}

export function freedomSignalTags(identifier: string): string[][] {
  return isFreedomSignalIdentifier(identifier)
    ? [["t", FREEDOM_SIGNAL_TAG], ["t", "bitcoin"], ["t", "nostr"], ["t", "freedom-tech"]]
    : [];
}

function bodyOfSection(content: string, name: string): string | null {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex(line => line.trim().toLowerCase() === ("## " + name).toLowerCase());
  if (start < 0) return null;
  const end = lines.findIndex((line, i) => i > start && /^##\s+\S/.test(line));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
}

export function withoutTldrSection(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex(line => line.trim().toLowerCase() === "## tl;dr");
  if (start < 0) return content;
  const end = lines.findIndex((line, i) => i > start && /^##\s+\S/.test(line));
  return [...lines.slice(0, start), ...lines.slice(end < 0 ? lines.length : end)].join("\n").trim();
}

export function readTldrItems(content: string): string[] {
  const section = bodyOfSection(content, "TL;DR");
  if (section === null) return [];
  return section.split("\n")
    .filter(line => /^\s*[-*]\s+\S/.test(line))
    .map(line => line.replace(/^\s*[-*]\s+/, "").trim());
}

export function replaceTldrItems(content: string, items: readonly string[]): string {
  if (items.length < 3 || items.length > 5 ||
      items.some(item => !item.trim() || item.length > 350 || /[\r\n]/.test(item))) {
    throw new Error("A TL;DR needs 3–5 concise, single-line takeaways.");
  }
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex(line => line.trim().toLowerCase() === "## tl;dr");
  if (start < 0) throw new Error("Add a ## TL;DR section before editing takeaways.");
  let end = lines.findIndex((line, i) => i > start && /^##\s+\S/.test(line));
  if (end < 0) end = lines.length;
  const block = ["", ...items.map(item => "- " + item.trim()), ""];
  return [...lines.slice(0, start + 1), ...block, ...lines.slice(end)].join("\n");
}

export function publicHttpsSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return parsed.protocol === "https:" && !!hostname &&
      !parsed.username && !parsed.password &&
      !["localhost", "example.com", "example.org", "example.net", "example.invalid"].includes(hostname) &&
      !/(^|\.)localhost$|(^|\.)local$|(^|\.)test$|(^|\.)invalid$/i.test(hostname) &&
      !/^127\.|^10\.|^192\.168\.|^169\.254\.|^0\./.test(hostname) &&
      !/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
  } catch { return false; }
}

export function markdownSourceUrls(markdown: string): string[] {
  const urls: string[] = [];
  // Deliberately support the simple standard Markdown link syntax. Unusual link
  // formats remain an editorial review task; no network fetch is performed.
  const regex = /\[[^\]\n]{1,180}\]\((https?:\/\/[^\s)]+)\)/g;
  for (const match of markdown.matchAll(regex)) urls.push(match[1]);
  return urls;
}

export function newsletterChecks(draft: EditorialDraft): NewsletterCheck[] {
  const metadata = parseIssueIdentifier(draft.identifier);
  const tldr = readTldrItems(draft.content);
  const reading = bodyOfSection(draft.content, "Further Reading");
  const sources = reading === null ? [] : markdownSourceUrls(reading);
  const allLinks = markdownSourceUrls(draft.content);
  const tldrLinksPresent = tldr.every(item => markdownSourceUrls(item).some(publicHttpsSource));
  const missingSections = NEWSLETTER_HEADERS.filter(name => bodyOfSection(draft.content, name) === null);
  return [
    { id: "issue", label: "Issue metadata", detail: "A unique issue number and YYYY-MM-DD week-ending date", valid: metadata !== null && draft.title.toLowerCase().includes("freedom signal") && draft.title.includes("#" + String(metadata?.issueNumber ?? 0).padStart(3, "0")) },
    { id: "sections", label: "Complete issue structure", detail: "TL;DR, news, Bitcoin, Nostr, AI, workshop, and reading", valid: missingSections.length === 0 },
    { id: "tldr", label: "TL;DR with citations", detail: "3–5 concise takeaways, each linking to an HTTPS source", valid: tldr.length >= 3 && tldr.length <= 5 && tldr.every(item => item.length <= 350) && tldrLinksPresent },
    { id: "reading", label: "Further-reading sources", detail: "At least three distinct HTTPS links to check manually", valid: new Set(sources.filter(publicHttpsSource)).size >= 3 },
    { id: "links", label: "Source link format", detail: "All linked source URLs must be public HTTPS; links are not fact-checked automatically", valid: allLinks.length >= 3 && allLinks.every(publicHttpsSource) },
    { id: "placeholders", label: "No unfinished placeholders", detail: "Resolve all [[TODO: ...]] prompts before approval", valid: !/\[\[TODO:/i.test(draft.content) },
  ];
}
