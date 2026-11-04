#!/usr/bin/env node
/**
 * Manually refresh the read-only Newstr build snapshot.
 * No signing keys, publication rights or deploy credentials are used.
 *
 * node scripts/refresh-newstr.mjs --dry-run
 * node scripts/refresh-newstr.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SimplePool, verifyEvent } from "nostr-tools";
import { IDENTITY } from "../src/lib/portfolio-data.ts";

const file = fileURLToPath(new URL("../src/lib/newstr-verified-events.json", import.meta.url));
const relays = ["wss://relay.damus.io", "wss://relay.primal.net", "wss://nos.lol"];
const dryRun = process.argv.includes("--dry-run");
if (process.argv.length > (dryRun ? 3 : 2)) {
  console.error("Usage: node scripts/refresh-newstr.mjs [--dry-run]");
  process.exit(2);
}
const now = Math.floor(Date.now() / 1000);
const acceptable = event => {
  if (!event || event.kind !== 30023 || event.pubkey !== IDENTITY.pubkey ||
      !Number.isSafeInteger(event.created_at) || event.created_at < 0 ||
      event.created_at > now + 300 ||
      typeof event.content !== "string" || event.content.length > 120000 ||
      !Array.isArray(event.tags) || event.tags.length > 150 ||
      !event.tags.every(t => Array.isArray(t) && t.length >= 1 && t.length <= 12 &&
        t.every(x => typeof x === "string" && x.length <= 2048))) return false;
  const d = event.tags.filter(t => t[0] === "d");
  if (d.length !== 1 || !d[0][1] || d[0][1].length > 160 ||
      /[\u0000-\u001f\u007f]/.test(d[0][1]) ||
      event.tags.some(t => t[0] === "published" && t[1] === "false")) return false;
  try { return verifyEvent(event); } catch { return false; }
};
const existingRaw = JSON.parse(await readFile(file, "utf8"));
if (!Array.isArray(existingRaw)) throw new Error("Refusing malformed snapshot; expected array.");
const pool = new SimplePool();
let fetched = [];
try {
  fetched = await pool.querySync(relays, {authors:[IDENTITY.pubkey],kinds:[30023],limit:100},{maxWait:6500});
} finally {
  pool.close(relays);
}
const current = [...fetched,...existingRaw].filter(acceptable);
const latest = new Map();
for (const event of current) {
  const identifier = event.tags.find(t => t[0] === "d")[1];
  const previous = latest.get(identifier);
  if (!previous || event.created_at > previous.created_at ||
      (event.created_at === previous.created_at && event.id > previous.id))
    latest.set(identifier,event);
}
const verified = [...latest.values()].sort((a,b)=>b.created_at-a.created_at).slice(0,100);
console.log(`Signed events: ${verified.length}; new network responses: ${fetched.length}; cached: ${existingRaw.length}.`);
if (!verified.length && !existingRaw.length) {
  console.log("No events found; retaining the empty snapshot. Do not infer relay health from this.");
}
if (dryRun) console.log("DRY RUN: no files changed.");
else {
  await writeFile(file, JSON.stringify(verified,null,2)+"\n");
  console.log("Updated verified Newstr event snapshot:",file);
}
