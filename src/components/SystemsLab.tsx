"use client";

import {useMemo,useState} from "react";
import {ArrowRight,ArrowUpRight,BookOpen,Check,CheckCircle2,Copy,Database,GitBranch,Layers3,Network,ShieldAlert,ShieldCheck,Workflow,XCircle} from "lucide-react";
import {SYSTEM_CASES,getSystemCase,systemBrief,type SystemCase,type SystemId,type SystemNode} from "@/lib/system-cases";

type Lens="system"|"risk"|"proof";
const LENSES: {key:Lens;label:string;helper:string}[]=[
 {key:"system",label:"ARCHITECTURE",helper:"How it works"},
 {key:"risk",label:"TRUST MODEL",helper:"What can go wrong"},
 {key:"proof",label:"EVIDENCE",helper:"Source and status"},
];
const concepts: Record<SystemId,string>={
 bitcoin:"Transaction / settlement",nostr:"Identity / publishing",fips:"Mesh / transport",ai:"Inference / approval",
};
function NodeInfo({node,lens}:{node:SystemNode;lens:Lens}){
 return <div className="sl-node-copy" aria-live="polite">
 <div className="sl-node-kicker"><span>{node.kind}</span><span>BOUNDARY / {node.id.toUpperCase()}</span></div>
 <h4>{node.label}</h4>
 {lens==="system"?<p>{node.responsibility}</p>:lens==="risk"?<><p><strong>Trust boundary.</strong> {node.trustBoundary}</p><p><strong>Failure scenario.</strong> {node.failureMode}</p><p className="sl-safeguard"><ShieldCheck size={16}/><span>{node.safeguard}</span></p></>:<p>{node.responsibility} Select the primary references below to inspect the original source.</p>}
 </div>;
}
function QuorumLab(){
 const [online,setOnline]=useState([true,true,true,true]);
 const reachable=online.filter(Boolean).length;
 const quorum=reachable>=3;
 return <section className="sl-quorum" aria-labelledby="quorum-title">
 <div className="sl-quorum-head"><div><span className="sl-label">FAILURE-MODE EXPLORER</span><h4 id="quorum-title">What if a validator goes offline?</h4></div><span className={"sl-quorum-state "+(quorum?"sl-good":"sl-bad")}>{quorum?<CheckCircle2 size={15}/>:<XCircle size={15}/>} {quorum?"QUORUM POSSIBLE":"QUORUM BLOCKED"}</span></div>
 <p>This is an illustrative availability calculation for four validators with a 3-of-4 threshold, not a live CometBFT simulation. It assumes every selected online validator participates correctly.</p>
 <div className="sl-quorum-grid">{online.map((value,i)=><button type="button" key={i} onClick={()=>setOnline(prev=>prev.map((x,j)=>j===i?!x:x))} className={"sl-validator "+(value?"is-online":"is-offline")} aria-pressed={value} aria-label={"Validator "+(i+1)+": "+(value?"online":"offline")+". Toggle availability"}>
 <span>V{i+1}</span><span>{value?"ONLINE":"OFFLINE"}</span><span aria-hidden="true">{value?"●":"○"}</span>
 </button>)}</div>
 <div className="sl-quorum-meter"><div className="sl-quorum-meter-top"><span>REACHABLE VOTING POWER</span><strong>{reachable}/4</strong></div><div className="sl-quorum-track" role="progressbar" aria-label="Available validators" aria-valuenow={reachable} aria-valuemin={0} aria-valuemax={4}><span style={{width:(reachable/4*100)+"%"}} /></div></div>
 <div className="sl-quorum-foot"><span>THRESHOLD · 3 OF 4</span><span>{quorum?"Enough available voting power; consensus safety still requires protocol assumptions.":"Too few available validators to reach the specified commit threshold."}</span></div>
 </section>;
}
export default function SystemsLab(){
 const [active,setActive]=useState<SystemId>("bitcoin");
 const [lens,setLens]=useState<Lens>("system");
 const [selected,setSelected]=useState(0);
 const [copied,setCopied]=useState(false);
 const item: SystemCase=getSystemCase(active)??SYSTEM_CASES[0];
 const node=useMemo(()=>item.nodes[Math.min(selected,item.nodes.length-1)], [item,selected]);
 function changeSystem(id:SystemId){setActive(id);setSelected(0);setLens("system");setCopied(false);}
 async function copyBrief(){try{await navigator.clipboard.writeText(systemBrief(item));setCopied(true);}catch{setCopied(false);}}
 return <section id="systems" className="sl-section" aria-labelledby="systems-heading">
 <div className="cp-section-top"><span className="cp-kicker"><Workflow size={14}/> 02 / SYSTEMS ARCHITECTURE LAB</span><span className="cp-muted">SELECT A DOMAIN → INSPECT THE BOUNDARIES</span></div>
 <div className="sl-heading"><div><p className="sl-label">INTERACTIVE ENGINEERING NOTEBOOK / EVIDENCE-FIRST</p><h2 id="systems-heading">Not just what I build.<br/><em>How I design it.</em></h2><p>Explore the components, trust boundaries and failure modes behind Bitcoin-native commerce, Nostr publishing, encrypted mesh networks and AI-assisted systems.</p></div><div className="sl-heading-mark" aria-hidden="true">⌁</div></div>
 <div className="sl-picker" role="group" aria-label="Select architecture domain">{SYSTEM_CASES.map(x=><button type="button" key={x.id} className={"sl-picker-item "+(active===x.id?"is-active":"")} aria-pressed={active===x.id} onClick={()=>changeSystem(x.id)}><span>{x.order} / {x.label}</span><strong>{x.id==="bitcoin"?"Payments & finality":x.id==="nostr"?"Sovereign publishing":x.id==="fips"?"Encrypted mesh":"Agentic systems"}</strong><ArrowUpRight size={15}/></button>)}</div>
 <div className="sl-console">
 <div className="sl-console-head"><div className="sl-console-lights" aria-hidden="true"><i/><i/><i/></div><span>ARCHITECTURE / {item.id.toUpperCase()}</span><span>SPECIMEN · {item.order}/04</span></div>
 <div className="sl-case-top"><div><span className="sl-label">{concepts[item.id]}</span><h3>{item.headline}</h3><p>{item.subhead}</p></div><div className="sl-status"><span>STATE / SCOPE</span><strong>{item.status}</strong><p>{item.statusDetail}</p></div></div>
 <div className="sl-lenses" role="group" aria-label="Architecture analysis view">{LENSES.map(x=><button type="button" key={x.key} onClick={()=>setLens(x.key)} aria-pressed={lens===x.key} className={lens===x.key?"is-active":""}><span>{x.label}</span><small>{x.helper}</small></button>)}</div>
 <div className="sl-model">
 <div className="sl-model-left"><div className="sl-model-caption"><Layers3 size={15}/> COMPONENTS / CLICK TO INSPECT</div><div className="sl-flow" role="group" aria-label="Inspect system components">{item.nodes.map((n,i)=><div className="sl-flow-group" key={n.id}><button type="button" className={"sl-flow-node "+(selected===i?"is-current":"")} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span className="sl-flow-step">0{i+1}</span><span className="sl-flow-name">{n.label}</span><span className="sl-flow-kind">{n.kind}</span><ArrowRight size={17}/></button>{i<item.nodes.length-1&&<div className="sl-flow-connector" aria-hidden="true"><span/><ArrowRight size={15}/><span/></div>}</div>)}</div><div className="sl-flow-disclaimer"><ShieldAlert size={14}/> All diagrams are architectural illustrations, not live network telemetry.</div></div>
 <div className="sl-model-right"><div className="sl-inspect-head"><span>INSPECTOR / {lens.toUpperCase()}</span><span>NODE {String(selected+1).padStart(2,"0")}</span></div><NodeInfo key={node.id+"-"+lens} node={node} lens={lens}/><div className="sl-inspect-bottom"><p><strong>Design decision</strong>{item.designDecision}</p><p><strong>Constraint</strong>{item.constraint}</p></div></div>
 </div>
 <div className="sl-evidence"><div className="sl-evidence-head"><div><BookOpen size={16}/><span>PRIMARY EVIDENCE</span></div><span>{item.evidence.length} SOURCES · VERIFY IN CONTEXT</span></div><div className="sl-evidence-links">{item.evidence.map((e,i)=><a href={e.href} key={e.href} target="_blank" rel="noopener noreferrer"><span>0{i+1}</span><span><strong>{e.title}</strong><small>{e.context}</small></span><ArrowUpRight size={16}/></a>)}</div></div>
 {item.id==="bitcoin"&&<QuorumLab/>}
 <div className="sl-case-footer"><div><ShieldCheck size={15}/><span>NO AUTONOMOUS ACTIONS · SOURCES BEFORE CLAIMS · HUMAN APPROVAL</span></div><button type="button" onClick={copyBrief}><Copy size={14}/>{copied?"COPIED TO CLIPBOARD":"COPY AGENT-READY BRIEF"}</button></div>
 </div>
 <div className="sl-bottom"><div><Database size={19}/><strong>Designed to be inspected.</strong><span>Typed models, explicit boundaries and verifiable links—not synthetic dashboards.</span></div><div><Network size={19}/><strong>Designed to be portable.</strong><span>Copy a plain-text architecture brief into any research or review agent.</span></div><div><GitBranch size={19}/><strong>Designed to be accountable.</strong><span>Untrusted model suggestions never become publishing or deployment authority.</span></div></div>
 </section>;
}
