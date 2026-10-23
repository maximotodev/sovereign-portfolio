export type EditorialDraft = {
  version: 1;
  title: string;
  identifier: string;
  summary: string;
  content: string;
};
export type EditorialSnapshot = EditorialDraft & {
  reviewedAt: string;
  approvedPubkey: string;
};

export function makeDraft(title:string, identifier:string, summary:string, content:string):EditorialDraft {
  return {version:1,title,identifier,summary,content};
}

export function validateDraft(input:unknown): input is EditorialDraft {
  if (!input || typeof input!=="object") return false;
  const d=input as Partial<EditorialDraft>;
  return d.version===1 &&
    typeof d.title==="string" && d.title.length<=160 &&
    typeof d.identifier==="string" && d.identifier.length<=80 &&
    typeof d.summary==="string" && d.summary.length<=280 &&
    typeof d.content==="string" && d.content.length<=120000;
}

export function copyDraft(d:EditorialDraft):EditorialDraft {
  return {version:1,title:d.title,identifier:d.identifier,summary:d.summary,content:d.content};
}
export function snapshotEqual(d:EditorialDraft,s:EditorialSnapshot):boolean {
  return d.title===s.title && d.identifier===s.identifier &&
         d.summary===s.summary && d.content===s.content;
}
