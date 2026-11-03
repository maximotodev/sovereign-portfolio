# Maximoto — Site-wide Minimal Cypherpunk UX v4

## Design intent

**Less is more:** one visual system across the entire public portfolio, Systems Lab, Newstr archive and editorial Studio. The hero introduces Maximoto and his commitment to self-sovereignty; concrete evidence and signed writing follow. Deep technical detail is available deliberately rather than overwhelming casual visitors.

## Cohesive experience

- Shared navigation: `About → Systems → Newstr → Studio`, consistent on mobile and desktop, with current-page state and keyboard focus.
- Shared visual tokens: near-black background, warm paper text, thin borders and a restrained Bitcoin-orange accent. Remove decorative global grids and radial overlays.
- Homepage: keep the origin story, Bitcoin/Nostr/FIPS/AI passions, traceable projects, and a featured link to Newstr. Reduce the compact signed journal to three items to prevent an endlessly growing homepage.
- Systems Lab: preserve typed architecture case studies, source links, trust-boundary inspector and the clearly conceptual 3-of-4 illustration. Re-style it as an editorial notebook with fewer status-light/terminal motifs; no invented telemetry.
- Newstr: readable issue cards, source-linked TL;DR, line length and mobile improvements. Signed NIP-23 verification remains unchanged.
- Studio: restructure the dense control surface into three stages: **Write → Review → Publish**. Optional issue generator, import/recovery, and agent review use disclosure panels. Signing remains explicit and manual.

## Import/recovery improvement

- Import a local JSON file or paste the full version-1 editorial JSON directly; Markdown-only paste preserves title, summary and NIP-23 address.
- Export/copy the draft without relying on a downloadable attachment. Optional browser backup must be chosen explicitly: Save / Restore / Delete.
- Browser localStorage is unencrypted, local to that browser and unsuitable for sensitive drafts on shared devices. **No autosave** runs without user action.
- Reject invalid drafts and oversized content. Imported agent proposals remain separately validated by their SHA-256 base digest.
- Restoring or replacing a draft clears the previous review snapshot, approval and publication receipt. Browser backups never contain signing keys, snapshots or receipts.

## Release and security invariants

- No `nsec` capture, automatic Nostr signing, auto-publication, wallet spending, or agent-admin privileges.
- NIP-23 event metadata and signer verification remain under the original human-control contract.
- Relay ACK and independent read-back must be presented separately. Signed authorship does not verify the truth of article claims.
- No claim that the portfolio operates a production FIPS mesh or validator network.

## Manual acceptance

1. Review each route: `/`, `/systems`, `/newsletter`, `/studio`; navigate across them and verify consistent branding, focus order and mobile overflow.
2. Review the homepage story, three project links, three contribution links, and Newstr feature; check that signed journal empty/offline modes are honest.
3. In Systems, change all four domains, inspect each lens and click every node; toggle four quorum flags and verify the explanatory text stays explicitly hypothetical.
4. Open the newsletter archive with no published issues and under relay failure. Test one signed NIP-23 issue from a genuine trusted source before claiming end-to-end published success.
5. In Studio, create/import an issue, paste JSON, paste Markdown, copy JSON, save/restore/delete local backup, and test malformed inputs and cancellation.
6. Verify Review cannot freeze an incomplete issue, that it requires matching NIP-07 identity, and that editing invalidates approval.
7. Verify the Publish stage requires an exact frozen SHA-256 snapshot, manual authorization and browser signing. Test rejection using a safe browser mock; never broadcast a fixture to public relays.
8. Check desktop, mobile, reduced motion, keyboard focus, screen-reader labels, external links, and browser contrast.
9. Require GitHub CI tests, production build and Vercel preview READY before merge.

## Future opportunities (not implemented)

- Optional in-browser draft version history with explicit opt-in and a visible retention policy
- React component-level accessibility tests / Playwright journey tests
- Cached signature-verified server-side Newstr archive and structured article SEO
- A read-only, cited research companion constrained to documented project data
- Removal of unused legacy dashboard components and historical broad CSS debt
- Security review of legacy guestbook input handling and dependency advisories
