"use client";
import { useRef,useState } from "react";
import { Bot,Download,FileJson,GitCompare,ShieldCheck,AlertTriangle } from "lucide-react";
import { type EditorialDraft,type AgentProposal,parseAgentProposal,proposalDiff,makeAgentHandoff,draftSha256,applyAgentProposal,LIMITS } from "@/lib/editorial-state";
import { IDENTITY } from "@/lib/portfolio-data";

function download(name:string,data:unknown) {
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function AgentReview({draft,onAccept}:{draft:EditorialDraft;onAccept:(next:EditorialDraft)=>void}) {
 const input=useRef<HTMLInputElement>(null);
 const [proposal,setProposal]=useState<AgentProposal|null>(null);
 const [baseHash,setBaseHash]=useState("");
 const [error,setError]=useState("");
 const [approved,setApproved]=useState(false);
 const [compare,setCompare]=useState(false);
 const changes=proposal?proposalDiff(draft,proposal):[];
 async function exportHandoff(){
  try{const hash=await draftSha256(draft);download("maximoto-agent-handoff.json",makeAgentHandoff(draft,hash,IDENTITY.pubkey));setError("Handoff exported. Give it to an agent as reference content; it cannot authorize publishing.");}
  catch {setError("Could not export the handoff.");}
 }
 async function importProposal(file:File) {
  setProposal(null);setApproved(false);setCompare(false);setError("");
  if(file.size>LIMITS.maxFile){setError("Proposal is too large.");return;}
  try{
   const parsed=parseAgentProposal(JSON.parse(await file.text()) as unknown);
   if(!parsed){setError("Invalid agent proposal schema. Use the exported handoff format.");return;}
   const digest=await draftSha256(draft);
   if(parsed.baseSha256!==digest){setError("STALE PROPOSAL: draft changed since the agent received its handoff. Export a new one.");return;}
   setBaseHash(digest);setProposal(parsed);
  }catch{setError("Malformed proposal JSON.");}
 }
 async function apply(){
  if(!proposal||!approved)return;
  const current=await draftSha256(draft);
  if(current!==baseHash||current!==proposal.baseSha256){setError("Draft changed. Re-review required.");setApproved(false);return;}
  onAccept(applyAgentProposal(draft,proposal));
  setProposal(null);setApproved(false);setCompare(false);setError("Accepted edits are now an unsigned draft. Editorial review and signing are still required.");
 }
 return <section className="ev-agents" aria-labelledby="agent-review-title">
  <div className="ev-agents-head"><div><span className="ev-overline"><Bot size={13}/> AGENT COORDINATION / UNTRUSTED INPUT</span><h3 id="agent-review-title">Research. Propose. <em>Review.</em></h3><p>Portable packets work with Buzz or any agent team. Suggestions remain inert until you examine and apply them.</p></div><ShieldCheck size={29}/></div>
  <div className="ev-agent-commands"><button type="button" onClick={exportHandoff}><Download size={15}/> Export agent task</button><button type="button" onClick={()=>input.current?.click()}><FileJson size={15}/> Import proposal</button><input ref={input} type="file" accept=".json,application/json" aria-label="Import agent proposal" hidden onChange={e=>{const file=e.target.files?.[0];if(file)void importProposal(file);e.target.value="";}}/></div>
  {error&&<p role="status" className="ev-agent-message">{error}</p>}
  {proposal&&<div className="ev-proposal"><div className="ev-proposal-top"><span>PROPOSAL · {proposal.agent.role.toUpperCase()} / {proposal.agent.name}</span><span>{changes.length} CHANGED FIELDS</span></div>
  <p>{proposal.rationale}</p>
  {proposal.concerns.length>0&&<div className="ev-concerns"><AlertTriangle size={16}/><div><strong>Review concerns</strong>{proposal.concerns.map((c,i)=><p key={i}>{c}</p>)}</div></div>}
  {proposal.citations.length>0&&<div className="ev-citations"><strong>Source claims — verify independently</strong>{proposal.citations.map((c,i)=><a key={i} href={c.url} rel="noopener noreferrer" target="_blank">{c.label} ↗</a>)}</div>}
  <button type="button" className="ev-compare" onClick={()=>setCompare(!compare)} aria-expanded={compare}><GitCompare size={15}/> {compare?"Hide changes":"Inspect proposed changes"}</button>
  {compare&&<div className="ev-diff">{changes.length===0?<p>No changes to apply.</p>:changes.map(change=><div key={change.field}><strong>{change.field.toUpperCase()}</strong><div className="ev-diff-cols"><pre><span>BEFORE</span>{change.before}</pre><pre><span>PROPOSED</span>{change.after}</pre></div></div>)}</div>}
  <label className="ev-accept-label"><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/> I reviewed the full proposal, including unverified claims and the proposed content changes.</label>
  <button type="button" className="ev-accept" disabled={!approved||!changes.length} onClick={apply}>Accept proposal into draft — no signing</button>
  </div>}
  <div className="ev-agent-foot">NO AGENT KEYS · NO AUTOMATIC PUBLISHING · ALL CONTENT REQUIRES HUMAN APPROVAL</div>
 </section>;
}
