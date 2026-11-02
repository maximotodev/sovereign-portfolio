import test from "node:test";
import assert from "node:assert/strict";
import { SYSTEM_CASES, getSystemCase, systemBrief } from "../src/lib/system-cases.ts";

test("four separately scoped architecture models are present", () => {
  assert.deepEqual(SYSTEM_CASES.map(x => x.id), ["bitcoin", "nostr", "fips", "ai"]);
  for (const item of SYSTEM_CASES) {
    assert.equal(item.nodes.length, 4);
    assert.equal(new Set(item.nodes.map(x => x.id)).size, item.nodes.length);
    assert.ok(item.headline.length > 10);
    assert.ok(item.status && item.statusDetail);
    assert.ok(item.designDecision && item.constraint);
    for (const node of item.nodes) {
      assert.ok(node.responsibility && node.trustBoundary && node.failureMode && node.safeguard);
    }
    for (const proof of item.evidence) {
      assert.match(proof.href, /^https:\/\/(github\.com|nips\.nostr\.com|fips\.network)\//);
      assert.ok(proof.context);
    }
  }
});
test("FIPS is not described as an application consensus engine", () => {
  const fips = getSystemCase("fips");
  assert.ok(fips);
  assert.match(fips.constraint, /Nostr-mediated.*optional/i);
  assert.match(fips.designDecision, /does not replace CometBFT/i);
  assert.match(fips.status, /EXPLORATION/);
});
test("agent-readable architecture brief remains read-only and source-linked", () => {
  const ai = getSystemCase("ai");
  assert.ok(ai);
  const brief = systemBrief(ai);
  assert.match(brief, /Trust boundary/);
  assert.match(brief, /Failure:/);
  assert.match(brief, /verify independently/i);
  assert.match(brief, /Do not grant agents publishing, wallet, or deployment credentials/i);
});
test("quorum explanation is explicitly conceptual, not live telemetry", () => {
  const bitcoin = getSystemCase("bitcoin");
  assert.ok(bitcoin);
  assert.match(bitcoin.constraint, /conceptual model/);
  assert.match(bitcoin.statusDetail, /not proof of a live production validator network/);
  assert.equal(getSystemCase("unknown"), undefined);
});
