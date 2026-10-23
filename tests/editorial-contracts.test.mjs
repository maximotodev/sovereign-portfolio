import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {
 makeDraft, validateDraft, copyDraft, snapshotEqual, editorialIssues,
 parseAgentProposal, proposalDiff, applyAgentProposal, makeAgentHandoff, safeCitation,
} from "../src/lib/editorial-state.ts";

const original=makeDraft("Sovereign software","sovereign-software",
 "A verifiable note about building and maintaining open protocols.",
 "The author documents engineering decisions, shows changes, and invites review.");
const hash="f".repeat(64);
test("draft validates, copies without aliasing and checks snapshots",()=>{
 assert.equal(validateDraft(original),true);
 assert.equal(validateDraft({...original,content:42}),false);
 assert.equal(validateDraft({...original,version:2}),false);
 const cloned=copyDraft(original);
 assert.deepEqual(cloned,original);
 assert.notEqual(cloned,original);
 const snapshot={...cloned,reviewedAt:"2026-10-22T00:00:00Z",approvedPubkey:"a".repeat(64),sha256:hash};
 assert.equal(snapshotEqual(original,snapshot),true);
 assert.equal(snapshotEqual({...original,content:"tampered"},snapshot),false);
});
test("validation rejects a wrong publisher identity",()=>{
 const issues=editorialIssues(original,false);
 assert.equal(issues.every(x=>x.valid),false);
 assert.equal(issues.find(x=>x.key==="signer")?.valid,false);
});
test("agent proposals are inert, bounded, and cannot change the NIP-23 address",()=>{
 const packet={format:"maximoto.editorial.proposal.v1",baseSha256:hash,
  agent:{name:"A2 reviewer",role:"reviewer"},
  proposal:{title:"A testable manifesto",content:"New proposal body including citations."},
  rationale:"Better clarity",citations:[{label:"Source",url:"https://github.com/PlebeianApp/market/pull/1410"}],concerns:["Confirm claims"]};
 const parsed=parseAgentProposal(packet);
 assert.ok(parsed);
 assert.equal(proposalDiff(original,parsed).length,2);
 const applied=applyAgentProposal(original,parsed);
 assert.equal(applied.identifier,original.identifier);
 assert.equal(applied.title,"A testable manifesto");
 assert.equal(original.title,"Sovereign software");
 assert.equal(parseAgentProposal({...packet,proposal:{...packet.proposal,identifier:"attack"}}),null);
 assert.equal(parseAgentProposal({...packet,citations:[{label:"secret",url:"javascript:alert(1)"}]}),null);
 assert.equal(parseAgentProposal({...packet,baseSha256:"bad"}),null);
 assert.equal(parseAgentProposal({...packet,agent:{name:"root",role:"publisher"}}),null);
});
test("hand-off is propose-only and not a publishing authorization",()=>{
 const handoff=makeAgentHandoff(original,hash,"a".repeat(64));
 assert.equal(handoff.intent,"PROPOSE_ONLY");
 assert.equal(handoff.baseSha256,hash);
 assert.ok(handoff.requirements.some(x=>x.includes("Do not sign")));
 assert.equal(safeCitation("https://github.com/a/b"),true);
 assert.equal(safeCitation("http://example.com"),false);
 assert.equal(safeCitation("https://localhost/private"),false);
});
