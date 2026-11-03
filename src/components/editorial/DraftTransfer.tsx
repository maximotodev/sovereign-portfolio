"use client";

import {useState} from "react";
import {ClipboardPaste,Copy,HardDriveDownload,RotateCcw,Trash2,ShieldAlert} from "lucide-react";
import type {EditorialDraft} from "@/lib/editorial-state";
import {LOCAL_DRAFT_KEY,parseLocalDraft,parsePastedDraft,serializeLocalDraft,type DraftPasteFormat} from "@/lib/studio-draft-transfer";

export function DraftTransfer({
 draft,onReplace,onMessage,
}:{
 draft:EditorialDraft;
 onReplace:(next:EditorialDraft)=>void;
 onMessage:(message:string)=>void;
}){
 const [open,setOpen]=useState(false);
 const [mode,setMode]=useState<DraftPasteFormat>("json");
 const [paste,setPaste]=useState("");
 const [localStatus,setLocalStatus]=useState("");
 const json=JSON.stringify(draft,null,2);
 function applyPasted(){
   try{
     const next=parsePastedDraft(paste,mode,draft);
     if((draft.title.trim()||draft.content.trim())&&!window.confirm("Replace the current unsigned draft? Save a copy first if necessary."))return;
     onReplace(next);setPaste("");setOpen(false);
     onMessage("Pasted "+(mode==="json"?"draft JSON":"Markdown")+" imported. Review is required again.");
   }catch(error){setLocalStatus(error instanceof Error?error.message:"Import failed.");}
 }
 async function copyJson(){
   try{await navigator.clipboard.writeText(json);setLocalStatus("Unsigned draft JSON copied. Paste it into a file or save it securely.");}
   catch{setOpen(true);setMode("json");setPaste(json);setLocalStatus("Clipboard blocked. The JSON is displayed in the paste editor below for manual copying.");}
 }
 function saveLocal(){
   try{
     const value=serializeLocalDraft(draft,new Date().toISOString());
     window.localStorage.setItem(LOCAL_DRAFT_KEY,value);
     setLocalStatus("Local backup saved in this browser. It is not encrypted or synced.");
   }catch(error){setLocalStatus(error instanceof Error?error.message:"Local backup failed. Use export or copy instead.");}
 }
 function restoreLocal(){
   try{
     const stored=window.localStorage.getItem(LOCAL_DRAFT_KEY);
     if(!stored){setLocalStatus("No backup is saved in this browser.");return;}
     const found=parseLocalDraft(stored);
     if((draft.title.trim()||draft.content.trim())&&!window.confirm("Restore the browser backup and replace the current unsigned draft?"))return;
     onReplace(found.draft);
     setLocalStatus("Local backup restored from "+new Date(found.savedAt).toLocaleString()+". Approvals are not restored.");
     onMessage("Local draft restored as unsigned. Verify every field before signing.");
   }catch(error){setLocalStatus(error instanceof Error?error.message:"Could not restore local backup.");}
 }
 function clearLocal(){
   if(!window.confirm("Delete the saved local draft backup in this browser?"))return;
   try{window.localStorage.removeItem(LOCAL_DRAFT_KEY);setLocalStatus("Local backup deleted. The current editor draft is unchanged.");}
   catch{setLocalStatus("Browser storage could not be cleared.");}
 }
 return <section className="nx-transfer" aria-label="Draft transfer and recovery">
   <div className="nx-transfer-header">
     <div>
       <strong>Import, export & recovery</strong>
       <p>Lost the download? Paste a JSON draft directly, or restore a backup you explicitly saved in this browser.</p>
     </div>
     <button type="button" className="nx-action" onClick={()=>setOpen(!open)} aria-expanded={open}><ClipboardPaste size={16}/>{open?"Close paste editor":"Paste a draft"}</button>
   </div>
   <div className="nx-transfer-actions">
     <button type="button" onClick={()=>void copyJson()}><Copy size={15}/> Copy draft JSON</button>
     <button type="button" onClick={saveLocal}><HardDriveDownload size={15}/> Save local backup</button>
     <button type="button" onClick={restoreLocal}><RotateCcw size={15}/> Restore backup</button>
     <button type="button" onClick={clearLocal}><Trash2 size={15}/> Delete backup</button>
   </div>
   {open&&<div className="nx-paste">
     <div className="nx-paste-tabs" role="group" aria-label="Draft paste format">
       <button type="button" aria-pressed={mode==="json"} onClick={()=>setMode("json")}>Full draft JSON</button>
       <button type="button" aria-pressed={mode==="markdown"} onClick={()=>setMode("markdown")}>Article Markdown</button>
     </div>
     <label htmlFor="nx-import-text">{mode==="json"?"Paste the complete exported draft JSON":"Paste article text (title, summary, identifier stay unchanged)"}</label>
     <textarea id="nx-import-text" rows={8} value={paste} onChange={e=>{setPaste(e.target.value);setLocalStatus("");}} placeholder={mode==="json"?'{"version":1,"title":"Newstr — Issue #001","identifier":"newstr-001-2026-10-30",...}':"## TL;DR\n\n- Your cited takeaways…"} />
     <div className="nx-transfer-actions"><button type="button" className="nx-primary" onClick={applyPasted} disabled={!paste.trim()}>Import into unsigned draft</button></div>
   </div>}
   {localStatus&&<p className="nx-transfer-message" role="status">{localStatus}</p>}
   <p className="nx-transfer-foot"><ShieldAlert size={14}/> Browser backups are optional, unencrypted, and specific to this browser. They contain article content only—never keys, signatures, approvals or agent credentials.</p>
 </section>;
}
