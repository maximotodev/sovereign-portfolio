import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { verifyEvent } from "nostr-tools";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const pubkey = "d52dd2f9fa607e70de6e7ba8eb9ca2e9e73fd34dec84555f5956cbc31996169d";

test("dangerous unused public APIs have been retired", () => {
  assert.equal(existsSync(new URL("../src/app/api/chat/route.ts",import.meta.url)),false);
  assert.equal(existsSync(new URL("../src/app/api/guestbook/route.ts",import.meta.url)),false);
});
test("public discoverability metadata exists", () => {
  assert.match(read("src/app/robots.ts"),/sitemap/);
  assert.match(read("src/app/sitemap.ts"),/newsletter\/essay/);
});
test("older essays remain available under Newstr", () => {
  assert.match(read("src/app/newsletter/essay/[slug]/page.tsx"),/generateStaticParams/);
  assert.match(read("src/app/blog/[slug]/page.tsx"),/newsletter\/essay/);
});
test("cached publications must be original valid signed events", () => {
  const events = JSON.parse(read("src/lib/newstr-verified-events.json"));
  assert.ok(Array.isArray(events));
  for (const e of events) {
    assert.equal(e.kind,30023);
    assert.equal(e.pubkey,pubkey);
    assert.equal(verifyEvent(e),true);
  }
});
test("reader navigation preserves owner Studio link outside primary nav", () => {
  const navigation = read("src/components/layout/SiteNavigation.tsx");
  assert.doesNotMatch(navigation,/href: "\/studio"/);
  assert.match(read("src/app/page.tsx"),/href="\/studio"/);
});
