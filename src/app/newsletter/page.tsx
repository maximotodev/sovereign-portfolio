import type { Metadata } from "next";
import { NewsletterArchive } from "@/components/newsletter/NewsletterArchive";

export const metadata: Metadata = {
  title: "Newstr — Weekly Bitcoin, Nostr & AI | Maximoto",
  description: "A signed, Nostr-native weekly dispatch on Bitcoin, Nostr, AI/ML and freedom tech, with a TL;DR and verifiable sources.",
  alternates: { canonical: "/newsletter" },
};
export default function NewsletterPage(){return <NewsletterArchive/>;}
