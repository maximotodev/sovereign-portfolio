"use client";

import { useState } from "react";
import { BookOpen, CalendarDays, CheckCircle2, CircleAlert, FilePlus2, ListChecks, RefreshCw } from "lucide-react";
import type { EditorialDraft } from "@/lib/editorial-state";
import { createFreedomSignalDraft, nextFridayLocal, newsletterChecks, parseIssueIdentifier, readTldrItems, replaceTldrItems } from "@/lib/freedom-signal";

export function FreedomSignalComposer({
  draft,
  onReplace,
  onMessage,
}:{
  draft: EditorialDraft;
  onReplace: (draft: EditorialDraft) => void;
  onMessage: (message: string) => void;
}) {
  const [number, setNumber] = useState(1);
  const [ending, setEnding] = useState(() => nextFridayLocal());
  const [expanded, setExpanded] = useState(false);
  const [tldr, setTldr] = useState<string[]>([]);
  const newsletter = draft.identifier.startsWith("freedom-signal-") || /^freedom signal/i.test(draft.title);
  const metadata = parseIssueIdentifier(draft.identifier);
  const checks = newsletterChecks(draft);
  const completed = checks.filter(check => check.valid).length;

  function newIssue() {
    try {
      const value = createFreedomSignalDraft(number, ending);
      if ((draft.title.trim() || draft.content.trim()) &&
          !window.confirm("Replace the current UNSIGNED draft? Export it first if needed.")) return;
      onReplace(value);
      setExpanded(true);
      setTldr(readTldrItems(value.content).map(item => item.replace(/^[-*]\s*/, "")));
      onMessage("Freedom Signal template loaded. Every TODO and source must be reviewed before signing.");
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Invalid issue details.");
    }
  }
  function startTldr() {
    const current = readTldrItems(draft.content);
    setTldr(current.length >= 3 && current.length <= 5 ? current : ["", "", "", ""]);
    setExpanded(true);
  }
  function saveTldr() {
    try {
      const content = replaceTldrItems(draft.content, tldr);
      onReplace({ ...draft, content });
      onMessage("TL;DR saved to unsigned draft. This is a structural editor, not an automated fact-checker.");
    } catch(error) {
      onMessage(error instanceof Error ? error.message : "Invalid TL;DR.");
    }
  }
  return (
    <section className="fs-composer" aria-labelledby="fs-composer-title">
      <div className="fs-composer-head">
        <div>
          <span className="fs-eyebrow"><BookOpen size={14}/> WEEKLY NOSTR PUBLICATION</span>
          <h2 id="fs-composer-title">Freedom Signal</h2>
          <p>Research with agents. Edit with care. Publish only with your own Nostr signature.</p>
        </div>
        <a href="/newsletter" className="fs-small-link">View archive ↗</a>
      </div>
      <div className="fs-create-grid">
        <label>ISSUE NUMBER
          <input type="number" min={1} max={9999} step={1} value={number}
            onChange={e=>setNumber(Number(e.target.value))}/>
        </label>
        <label>WEEK ENDING
          <input type="date" value={ending} onChange={e=>setEnding(e.target.value)}/>
        </label>
        <button type="button" className="fs-solid" onClick={newIssue}><FilePlus2 size={16}/> New weekly issue</button>
      </div>
      {newsletter && (
        <div className="fs-readiness">
          <div className="fs-progress-heading">
            <span><ListChecks size={15}/> NEWSLETTER READINESS</span>
            <strong>{completed} / {checks.length} checks</strong>
          </div>
          <p className="fs-progress-caption">
            {metadata ? "Issue #" + String(metadata.issueNumber).padStart(3,"0") + " · " + metadata.weekEnding :
              "Issue metadata needs correction"}
            {" · Source links are syntax-checked, not independently verified."}
          </p>
          <div className="fs-check-grid">
            {checks.map(check=><div className={check.valid?"fs-check is-good":"fs-check"} key={check.id}>
              {check.valid?<CheckCircle2 size={16}/>:<CircleAlert size={16}/>}
              <span><strong>{check.label}</strong><small>{check.detail}</small></span>
            </div>)}
          </div>
          {!expanded ? (
            <button type="button" className="fs-outline" onClick={startTldr}>Edit TL;DR takeaways</button>
          ) : (
            <div className="fs-tldr-editor">
              <div className="fs-tldr-heading">
                <h3>TL;DR · The week in 60 seconds</h3>
                <button type="button" onClick={startTldr}><RefreshCw size={13}/> Reload from draft</button>
              </div>
              <p>Write 3–5 short, source-linked takeaways. No AI suggestions are applied automatically.</p>
              {tldr.map((item,i)=><label key={i}>TAKEAWAY {i+1}
                <textarea rows={2} maxLength={350} value={item}
                  onChange={e=>setTldr(previous=>previous.map((v,j)=>i===j?e.target.value:v))}
                  placeholder={"**Bitcoin:** A verifiable update with [source](https://...)."} />
              </label>)}
              <div className="fs-tldr-actions">
                <button type="button" className="fs-outline" disabled={tldr.length>=5}
                  onClick={()=>setTldr(previous=>[...previous,""])}>Add takeaway</button>
                <button type="button" className="fs-outline" disabled={tldr.length<=3}
                  onClick={()=>setTldr(previous=>previous.slice(0,-1))}>Remove last</button>
                <button type="button" className="fs-solid" onClick={saveTldr}>Apply to draft</button>
              </div>
            </div>
          )}
        </div>
      )}
      <p className="fs-composer-note"><CalendarDays size={14}/> Prepare sources through the week. Review Thursday. Publish manually when ready—no scheduled or automatic signing.</p>
    </section>
  );
}
