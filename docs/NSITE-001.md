# NSITE-001 — Repeatable static mirror

The static nsite mirror is built in a **temporary isolated copy** so that
Vercel's Next.js runtime and the portfolio source remain unchanged.

```bash
npm ci
node scripts/nsite-export.mjs --prepare-only
node scripts/nsite-export.mjs
cd out-nsite
python3 -m http.server 8787
```

Inspect the public pages, Newstr signed content, and linked essays locally.
The exported Studio is read-only. Server API routes are omitted.
Signed Newstr issues use the query parameter `/newsletter/?issue=<d-tag>`,
while older essays keep pre-generated static paths.

**Never publish automatically.** After an explicit human review, configure
`nsyte` with a dedicated test key or narrowly scoped signer, confirm
`nsyte validate` and CLI help, review `nsyte deploy . --dry-run` if your
installed version supports it, and only then publish manually.

The archive's static metadata still references the primary Vercel origin,
intentionally avoiding duplicate indexing during the pilot. A permanent
independent domain requires a separate DNS, NIP-05, and canonical URL review.

The build is also checked in GitHub CI. Replication and gateway redundancy
must be measured after publication rather than assumed.
