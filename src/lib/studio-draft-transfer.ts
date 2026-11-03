import {
  LIMITS, makeDraft, validateDraft, type EditorialDraft,
} from "./editorial-state.ts";

export const LOCAL_DRAFT_KEY = "maximoto.studio.local-draft.v1";
export const LOCAL_DRAFT_FORMAT = "maximoto.studio.local-draft.v1";
export type DraftPasteFormat = "json" | "markdown";
export type SavedLocalDraft = {
  format: typeof LOCAL_DRAFT_FORMAT;
  savedAt: string;
  draft: EditorialDraft;
};

/** User-pasted text is always treated as data, never as instructions or an action. */
export function parsePastedDraft(
  text: string,
  format: DraftPasteFormat,
  previous: EditorialDraft,
): EditorialDraft {
  if (!text.trim() || text.length > LIMITS.maxFile) {
    throw new Error("The pasted draft is empty or exceeds the import limit.");
  }
  if (format === "json") {
    let parsed: unknown;
    try { parsed = JSON.parse(text); }
    catch { throw new Error("Invalid JSON. Paste the complete exported draft object."); }
    if (!validateDraft(parsed)) {
      throw new Error("Invalid draft schema. Expected version, title, identifier, summary and content.");
    }
    return makeDraft(parsed.title, parsed.identifier, parsed.summary, parsed.content);
  }
  if (format === "markdown") {
    if (text.length > LIMITS.content) throw new Error("Article Markdown exceeds the content limit.");
    if (!previous.title.trim() || !previous.identifier.trim() || !previous.summary.trim()) {
      throw new Error("Create a Newstr issue or fill in title, summary and identifier before pasting Markdown.");
    }
    return makeDraft(previous.title, previous.identifier, previous.summary, text);
  }
  throw new Error("Unsupported import format.");
}

/**
 * Explicit browser-only backup. Does not include signer identity, Nostr keys,
 * reviewed snapshots, approval flags or publication receipts.
 * This is not encrypted storage; user must opt in.
 */
export function serializeLocalDraft(draft: EditorialDraft, savedAt: string): string {
  if (!validateDraft(draft) || !Number.isFinite(Date.parse(savedAt))) {
    throw new Error("Cannot back up an invalid draft.");
  }
  return JSON.stringify({
    format: LOCAL_DRAFT_FORMAT,
    savedAt,
    draft: makeDraft(draft.title, draft.identifier, draft.summary, draft.content),
  } satisfies SavedLocalDraft);
}

export function parseLocalDraft(value: string): SavedLocalDraft {
  if (value.length > LIMITS.maxFile + 400) throw new Error("Stored draft exceeds the size limit.");
  let raw: unknown;
  try { raw = JSON.parse(value); }
  catch { throw new Error("Stored draft is not valid JSON."); }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Stored draft has an invalid format.");
  }
  const packet = raw as Record<string, unknown>;
  if (packet.format !== LOCAL_DRAFT_FORMAT || typeof packet.savedAt !== "string" ||
      !Number.isFinite(Date.parse(packet.savedAt)) || !validateDraft(packet.draft)) {
    throw new Error("Stored draft failed validation.");
  }
  const original = packet.draft;
  return {
    format: LOCAL_DRAFT_FORMAT,
    savedAt: packet.savedAt,
    draft: makeDraft(original.title, original.identifier, original.summary, original.content),
  };
}
