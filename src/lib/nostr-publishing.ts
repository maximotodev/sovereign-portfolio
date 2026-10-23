import { nip19, verifyEvent, type Event } from "nostr-tools";
import { IDENTITY } from "./portfolio-data";
export const RELAYS = ["wss://relay.damus.io", "wss://relay.primal.net", "wss://nos.lol"];
export type Article = { id:string; identifier:string; title:string; summary:string; content:string; createdAt:number; url:string };
export function parseArticle(input:unknown, now=Math.floor(Date.now()/1000)):Article|null {
 if (!input || typeof input !== "object") return null;
 const e=input as Event;
 if (e.kind!==30023 || e.pubkey!==IDENTITY.pubkey || !Number.isSafeInteger(e.created_at) || e.created_at<0 || e.created_at>now+300 || typeof e.content!=="string" || e.content.length>120000 || !Array.isArray(e.tags) || e.tags.length>150 || !e.tags.every(t=>Array.isArray(t)&&t.length>=1&&t.length<=12&&t.every(x=>typeof x==="string"&&x.length<=2048))) return null;
 const d=e.tags.filter(t=>t[0]==="d");
 if(d.length!==1 || !d[0][1] || d[0][1].length>160 || /[\u0000-\u001f\u007f]/.test(d[0][1])) return null;
 if(e.tags.some(t=>t[0]==="published"&&t[1]==="false")) return null;
 try { if(!verifyEvent(e)) return null; } catch {return null;}
 const title=(e.tags.find(t=>t[0]==="title")?.[1]||d[0][1]).slice(0,160);
 const summary=(e.tags.find(t=>t[0]==="summary")?.[1]||e.content).replace(/[#*_>\r\n]/g," ").replace(/\s+/g," ").slice(0,260);
 return {id:e.id,identifier:d[0][1],title,summary,content:e.content,createdAt:e.created_at,url:"https://njump.me/"+nip19.naddrEncode({kind:30023,pubkey:e.pubkey,identifier:d[0][1],relays:RELAYS})};
}
export function selectArticles(input:unknown[]):Article[]{
 const found=new Map<string,Article>();
 for(const item of input.slice(0,400)){const a=parseArticle(item);if(!a)continue;const old=found.get(a.identifier);if(!old||a.createdAt>old.createdAt||(a.createdAt===old.createdAt&&a.id>old.id))found.set(a.identifier,a);}
 return [...found.values()].sort((a,b)=>b.createdAt-a.createdAt||b.id.localeCompare(a.id)).slice(0,20);
}
export function cleanSlug(value:string):string {
 return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}
