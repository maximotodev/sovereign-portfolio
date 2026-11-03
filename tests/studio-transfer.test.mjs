import test from "node:test";
import assert from "node:assert/strict";
import {makeDraft} from "../src/lib/editorial-state.ts";
import {
 LOCAL_DRAFT_KEY,LOCAL_DRAFT_FORMAT,
 parsePastedDraft,parseLocalDraft,serializeLocalDraft,
} from "../src/lib/studio-draft-transfer.ts";

const base=makeDraft(
 "Newstr — Issue #001","newstr-001-2026-10-30",
 "A concise, verifiable Nostr-native weekly newsletter edition.",
 "## TL;DR\n\n- A verified summary and three primary sources.",
);
test("paste-import accepts structured JSON and preserves NIP-23 identifier",()=>{
 const result=parsePastedDraft(JSON.stringify(base),"json",makeDraft("","","",""));
 assert.deepEqual(result,base);
 assert.notStrictEqual(result,base);
 assert.equal(result.identifier,"newstr-001-2026-10-30");
});
test("untrusted imports cannot introduce invalid draft schemas or executable actions",()=>{
 assert.throws(()=>parsePastedDraft('{"version":2}',"json",base),/Invalid draft schema/);
 assert.throws(()=>parsePastedDraft('{"garbled":',"json",base),/Invalid JSON/);
 assert.throws(()=>parsePastedDraft("","json",base),/empty/);
 assert.throws(()=>parsePastedDraft("A".repeat(180001),"markdown",base),/limit/);
 assert.throws(()=>parsePastedDraft("## A section","markdown",makeDraft("","","","")),/title/);
});
test("Markdown paste replaces content only and never alters author, title or address",()=>{
 const next=parsePastedDraft("## TL;DR\n\n- Another cited point.","markdown",base);
 assert.equal(next.title,base.title);
 assert.equal(next.summary,base.summary);
 assert.equal(next.identifier,base.identifier);
 assert.notEqual(next.content,base.content);
});
test("opt-in local backup has no signer keys or approvals and roundtrips",()=>{
 const savedAt="2026-11-03T18:00:00.000Z";
 const data=serializeLocalDraft(base,savedAt);
 const restored=parseLocalDraft(data);
 assert.equal(LOCAL_DRAFT_KEY,"maximoto.studio.local-draft.v1");
 assert.equal(restored.format,LOCAL_DRAFT_FORMAT);
 assert.equal(restored.savedAt,savedAt);
 assert.deepEqual(restored.draft,base);
 assert.deepEqual(Object.keys(JSON.parse(data)).sort(),["draft","format","savedAt"]);
 assert.doesNotMatch(data,/approvedPubkey|privateKey|nsec|signEvent|sha256/);
});
test("stored packets must pass strict shape/date/content checks",()=>{
 assert.throws(()=>parseLocalDraft("{}"),/validation/);
 assert.throws(()=>parseLocalDraft("not json"),/JSON/);
 assert.throws(()=>parseLocalDraft(JSON.stringify({
  format:LOCAL_DRAFT_FORMAT,savedAt:"not a time",draft:base,
 })),/validation/);
 assert.throws(()=>parseLocalDraft(JSON.stringify({
  format:LOCAL_DRAFT_FORMAT,savedAt:"2026-11-03T18:00:00Z",draft:{...base,content:123},
 })),/validation/);
});
