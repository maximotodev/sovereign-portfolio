import test from "node:test";
import assert from "node:assert/strict";
import {
  createNewstrDraft, makeIssueIdentifier, parseIssueIdentifier,
  newstrTags, isNewstrIdentifier, nextFridayLocal,
  readTldrItems, replaceTldrItems, withoutTldrSection, markdownSourceUrls, newsletterChecks,
  publicHttpsSource,
} from "../src/lib/freedom-signal.ts";

const date="2026-11-06";
const issue=createNewstrDraft(1,date);
test("issue identifiers use stable NIP-23 d-tags and real calendar dates",()=>{
 assert.equal(issue.identifier,"newstr-001-2026-11-06");
 assert.deepEqual(parseIssueIdentifier(issue.identifier),{issueNumber:1,weekEnding:date});
 assert.equal(isNewstrIdentifier(issue.identifier),true);
 assert.equal(parseIssueIdentifier("newstr-001-2026-02-30"),null);
 assert.equal(parseIssueIdentifier("newstr-000-2026-11-06"),null);
 assert.throws(()=>makeIssueIdentifier(-1,date));
 assert.throws(()=>makeIssueIdentifier(1,"2026-12-99"));
 assert.equal(nextFridayLocal(new Date(2026,10,2)),date);
 assert.deepEqual(newstrTags(issue.identifier),[
  ["t","newstr"],["t","bitcoin"],["t","nostr"],["t","freedom-tech"],
 ]);
 assert.deepEqual(newstrTags("ordinary-article"),[]);
});
test("template includes all seven sections and starts with unfinished checks",()=>{
 assert.match(issue.content,/## TL;DR/);
 assert.match(issue.content,/## Bitcoin & Lightning/);
 assert.match(issue.content,/## Nostr & Freedom Tech/);
 assert.match(issue.content,/## Maximoto's Workshop/);
 assert.equal(readTldrItems(issue.content).length,4);
 assert.ok(newsletterChecks(issue).some(check=>!check.valid));
 assert.equal(newsletterChecks(issue).find(check=>check.id==="placeholders")?.valid,false);
});
test("TL;DR editor enforces 3–5 items and preserves all following sections",()=>{
 const list=[
  "**Bitcoin:** [A cited development](https://github.com/PlebeianApp/market/pull/1407)",
  "**Nostr:** [Transport evidence](https://github.com/PlebeianApp/market/pull/1110)",
  "**AI:** [Local studio evidence](https://github.com/maximotodev/sovereign-portfolio/pull/5)",
 ];
 const body=replaceTldrItems(issue.content,list);
 assert.deepEqual(readTldrItems(body),list);
 assert.match(body,/## The Signal/);
 assert.doesNotMatch(withoutTldrSection(body), /## TL;DR/);
 assert.match(withoutTldrSection(body), /## The Signal/);
 assert.match(body,/## Further Reading/);
 assert.throws(()=>replaceTldrItems(issue.content,["one","two"]));
 assert.throws(()=>replaceTldrItems(issue.content,Array(6).fill("a")));
 assert.throws(()=>replaceTldrItems(issue.content,["a","b","newline\ninjection"]));
});
test("source checks are syntactic, exclude insecure and local/example links",()=>{
 assert.equal(publicHttpsSource("https://github.com/PlebeianApp/market/pull/1410"),true);
 for(const url of ["http://github.com/x","https://localhost/a","https://example.com/x",
 "https://127.0.0.1/path","javascript:alert(1)","https://user:pass@github.com/private"]){
  assert.equal(publicHttpsSource(url),false,url);
 }
 assert.deepEqual(markdownSourceUrls("[Source](https://github.com/example/repo)"),["https://github.com/example/repo"]);
});
test("a completed issue passes structural checks without claiming fact checking",()=>{
 const updated=replaceTldrItems(issue.content,[
  "**Bitcoin:** [Test reference](https://github.com/PlebeianApp/market/pull/1407)",
  "**Nostr:** [Test reference](https://github.com/PlebeianApp/market/pull/1110)",
  "**AI:** [Test reference](https://github.com/maximotodev/sovereign-portfolio/pull/5)",
 ]);
 const completed=updated
  .replace(/\[\[TODO:[^\]]+\]\]/g,"Illustrative commentary and context with [cited sources](https://github.com/PlebeianApp/market/pull/1410).")
  .replace(/## Further Reading[\s\S]*?---/,[
    "## Further Reading",
    "",
    "- [Consensus](https://github.com/PlebeianApp/market/pull/1407)",
    "- [Messaging](https://github.com/PlebeianApp/market/pull/1110)",
    "- [Deployment](https://github.com/PlebeianApp/market/pull/1410)",
    "",
    "---",
  ].join("\n"));
 const checks=newsletterChecks({...issue,content:completed});
 assert.equal(checks.length,6);
 assert.deepEqual(checks.filter(c=>!c.valid),[]);
 const withoutLinks=completed.replace(/\(https:\/\/github\.com\/[^)]+\)/g,"(http://localhost/test)");
 assert.equal(newsletterChecks({...issue,content:withoutLinks}).find(c=>c.id==="links")?.valid,false);
});
