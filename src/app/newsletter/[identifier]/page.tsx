import type { Metadata } from "next";
import { NewsletterArchive } from "@/components/newsletter/NewsletterArchive";
import { isFreedomSignalIdentifier } from "@/lib/freedom-signal";
import { notFound } from "next/navigation";

type Props = { params: Promise<{identifier: string}> };
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {identifier}=await params;
  return {
    title: "Freedom Signal Issue | Maximoto",
    description: "A signed, source-linked Freedom Signal newsletter issue on Bitcoin, Nostr, AI and freedom tech.",
    alternates: { canonical: "/newsletter/"+encodeURIComponent(identifier) },
  };
}
export default async function NewsletterIssuePage({params}:Props){
  const {identifier}=await params;
  if(!isFreedomSignalIdentifier(identifier))notFound();
  return <NewsletterArchive identifier={identifier}/>;
}
