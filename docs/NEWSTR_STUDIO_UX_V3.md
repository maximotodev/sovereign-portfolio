# Newstr Studio — Minimal editorial UX v3

## User problem

The previous Studio mixed article fields, Newstr issue setup, agent proposals, signer verification, readiness checks and irreversible publication on one very long page. Drafts were lost on reload unless the browser download succeeded, which was especially frustrating when an external chat attachment failed to download.

## Design principles

1. **Less is more:** fewer competing controls, neutral near-black paper, warm Bitcoin-orange accent, generous whitespace.
2. **Progressive disclosure:** stage navigation **Write → Review → Publish**; optional issue generator, draft transfer and agent review are collapsible. No hidden privileges or autonomous features.
3. **No-download recovery:** accept pasted version-1 editorial JSON or Markdown pasted into an already identified draft. Text remains inert; it is never interpreted as executable instructions.
4. **Local-first, without surprises:** unsigned drafts live in component state. Browser storage is never touched unless the user explicitly selects Save, Restore or Delete local backup. Storage is **not encrypted**, not synced and must not contain private information.
5. **Unchanged signing authority:** sender's NIP-07 key must match Maximoto's published identity; a reviewed SHA-256-bound snapshot is required, the exact signer output is verified and the user explicitly approves. Agents never receive signing or publishing access.
6. **Truthful reporting:** a relay ACK is separate from independent read-back and neither confirms delivery on all relays. Link syntax checks do not validate the truth of an article.

## Implementation

- \`src/app/studio/page.tsx\` — editorial steps, clear review gating, full preview, signed receipt and visible status.
- \`src/app/studio/studio-v3.module.css\` — minimal responsive layout; no extra dependencies.
- \`src/components/editorial/DraftTransfer.tsx\` — copy JSON, paste JSON/Markdown, optional browser backup, explicit deletion, restore and clear feedback.
- \`src/lib/studio-draft-transfer.ts\` — tested size-limited import/backup contracts.
- \`tests/studio-transfer.test.mjs\` — contract tests for malformed input, oversize data, Markdown field isolation, backup validation and absence of secret/approval state.

## Manual smoke test

1. Enter Studio. Choose **New weekly issue** in the Write step. Edit title, summary, content and TL;DR; check that changes clear frozen approval.
2. Open **Import or recover a draft**, paste a previously exported JSON draft, and verify all fields reappear. Test malformed JSON, unknown versions, oversize text and confirmation on replacing existing content.
3. Test copying draft JSON without a file download. Explicitly choose local backup, reload and restore it. Verify **no signing or review approval** is restored. Test deleting backup.
4. In **Review**, verify missing requirements are clearly labeled and the Freeze button remains disabled. Import a complete source-linked newsletter, connect a correct NIP-07 signer and freeze.
5. Edit the draft after freezing; ensure Publish is no longer ready until re-review.
6. In **Publish**, verify the exact article details and SHA-256, manually check the authorization box and sign using a browser-owned signer. Test signer rejection and mismatched pubkey using safe mock or dry-run inputs—do not broadcast a fixture to production relays.
7. Check the final event receipt and link after an intentional *real* publication by the owner. Test relay-outage state. Do not claim unconfirmed read-back.
8. Check keyboard-only navigation, focus outlines, mobile readability, external links and contrast. Test reduced-motion setting.
9. Run \`npm ci\`, TypeScript, targeted ESLint, editorial+newsletter+transfer contracts and production build. Preview on Vercel before merging.

## Explicit limits

The optional local draft backup is **plain browser localStorage**, not encrypted and not a secure vault. It should be used only for content suitable for that browser. No continuous autosave, login, accounts, background agent executions, third-party storage, remote persistence, wallet actions or automatic publication are introduced. Existing signed archive and Studio article format remain compatible.
