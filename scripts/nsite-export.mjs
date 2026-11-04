#!/usr/bin/env node
/**
 * Build a read-only, isolated static nsite mirror.
 * Never signs, publishes, or changes production files.
 * Usage: node scripts/nsite-export.mjs [--prepare-only]
 */
import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dryRun = process.argv.includes("--prepare-only");
if (process.argv.length > (dryRun ? 3 : 2)) {
  console.error("Usage: node scripts/nsite-export.mjs [--prepare-only]");
  process.exit(2);
}
const ignored = new Set([".git",".next",".vercel",".nsite",".nsyte","node_modules","out","out-nsite","coverage","build",".turbo"]);
const stage = await mkdtemp(join(tmpdir(),"maximoto-nsite-"));
async function patch(rel,original,replacement) {
  const target = join(stage,rel);
  const content = await readFile(target,"utf8");
  const count = content.split(original).length-1;
  if(count!==1)throw new Error(`Expected 1 match in ${rel}; found ${count}`);
  await writeFile(target,content.replace(original,replacement));
}
function run(command,args) {
  const result = spawnSync(command,args,{
    cwd:stage,stdio:"inherit",shell:false,
    env:{...process.env,NSITE_EXPORT:"1",NEXT_PUBLIC_NSITE_EXPORT:"1"}
  });
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error(`${command} failed with exit ${result.status}`);
}
try {
  console.log("Preparing isolated static mirror...");
  await cp(root,stage,{
    recursive:true,force:true,
    filter:src=>{
      const rel=relative(root,src);
      if(!rel)return true;
      const first=rel.split(sep)[0];
      return !ignored.has(first)&&!first.startsWith(".env");
    }
  });
  await patch("next.config.ts",
    "const nextConfig: NextConfig = {",
    "const nextConfig: NextConfig = {\n  output: 'export',\n  trailingSlash: true,");
  await patch("next.config.ts","  images: {","  images: {\n    unoptimized: true,");
  // Remove any API routes from the isolated copy.
  await rm(join(stage,"src/app/api"),{recursive:true,force:true});
  // Arbitrary Nostr identifiers are not known at build time.
  await rm(join(stage,"src/app/newsletter/[identifier]"),{recursive:true,force:true});
  await patch("src/components/newsletter/NewsletterArchive.tsx",
    'href={"/newsletter/"+encodeURIComponent(item.identifier)}',
    'href={"/newsletter/?issue="+encodeURIComponent(item.identifier)}');
  await writeFile(join(stage,"src/components/newsletter/NsiteIssueRouter.tsx"),
    '"use client";\nimport {useSearchParams} from "next/navigation";\nimport {NewsletterArchive} from "./NewsletterArchive";\nexport function NsiteIssueRouter(){const p=useSearchParams();return <NewsletterArchive identifier={p.get("issue")||undefined}/>;}\n');
  await writeFile(join(stage,"src/app/newsletter/page.tsx"),
    'import {Suspense} from "react";\nimport {NsiteIssueRouter} from "@/components/newsletter/NsiteIssueRouter";\nexport default function Newsletter(){return <Suspense fallback={<main>Loading Newstr…</main>}><NsiteIssueRouter/></Suspense>;}\n');
  // Never sign from a gateway origin in this pilot.
  await writeFile(join(stage,"src/app/studio/page.tsx"),
    'import Link from "next/link";\nexport default function ReadOnlyStudio(){return <main className="min-h-screen bg-neutral-950 text-white px-6 py-24"><div className="mx-auto max-w-2xl space-y-6"><Link href="/">← Back to Maximoto</Link><h1 className="text-4xl">Editorial Studio · read-only</h1><p>This nsite experiment does not sign or publish. Do not approve signing requests from untrusted gateways.</p><a href="https://maximotodev.vercel.app/studio">Open the original Studio</a></div></main>;}\n');
  await patch("src/components/SystemsLab.tsx",
    'href="/api/architecture"',
    'href="https://github.com/maximotodev/sovereign-portfolio/blob/main/src/lib/system-cases.ts"');
  for(const p of ["src/app/page.tsx","src/app/newsletter/page.tsx","src/app/systems/page.tsx","src/app/studio/page.tsx"])
    await stat(join(stage,p));
  try{await stat(join(stage,"src/app/api"));throw new Error("Server APIs present in static stage");}
  catch(e){if(e.code!=="ENOENT")throw e;}
  if(dryRun) console.log("PASS: static-export preparation checks; no build or publication.");
  else {
    run("npm",["ci","--no-audit","--no-fund"]);
    run("npm",["run","build"]);
    const built=join(stage,"out");
    for(const p of ["index.html","newsletter/index.html","studio/index.html","systems/index.html"])
      await stat(join(built,p));
    const output=join(root,"out-nsite");
    const marker=join(output,".maximoto-nsite-generated");
    let config=null;
    try {
      await stat(output);
      await stat(marker).catch(()=>{throw new Error("Refusing to overwrite unmarked out-nsite directory");});
      try{
        await stat(join(output,".nsite"));
        config=join(stage,"saved-nsite");
        await cp(join(output,".nsite"),config,{recursive:true});
      }catch(e){if(e.code!=="ENOENT")throw e;}
      await rm(output,{recursive:true,force:true});
    }catch(e){if(e.code!=="ENOENT")throw e;}
    await mkdir(output,{recursive:true});
    await cp(built,output,{recursive:true});
    if(config)await cp(config,join(output,".nsite"),{recursive:true});
    await writeFile(marker,"Generated by scripts/nsite-export.mjs. Do not upload this file.\n");
    await writeFile(join(output,".nsyte-ignore"),".maximoto-nsite-generated\n.nsite/**\n.nsyte/**\n.env*\n*.pem\n*.key\n");
    console.log("PASS: generated",output);
    console.log("NOT PUBLISHED. Review files and use a dedicated test signer.");
  }
}finally{await rm(stage,{recursive:true,force:true});}
