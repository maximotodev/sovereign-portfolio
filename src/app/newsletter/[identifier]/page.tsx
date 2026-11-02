import type { Metadata } from "next";
import { NewsletterArchive } from "@/components/newsletter/NewsletterArchive";
import { isNewstrIdentifier } from "@/lib/newstr";
import { notFound } from "next/navigation";

type Props = { params: Promise<{identifier: string}> };
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {identifier}=await params;
  return {
    title: "Newstr Issue | Maximoto",
    description: "A signed, source-linked Newstr newsletter issue on Bitcoin, Nostr, AI and freedom tech.",
    alternates: { canonical: "/newsletter/"+encodeURIComponent(identifier) },
  };
}
export default async function NewsletterIssuePage({params}:Props){
  const {identifier}=await params;
  if(!isNewstrIdentifier(identifier))notFound();
  return <NewsletterArchive identifier={identifier}/>;
}
