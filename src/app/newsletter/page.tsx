import type { Metadata } from "next";
import { NewsletterArchive } from "@/components/newsletter/NewsletterArchive";

export const metadata: Metadata = {
  title: "Newstr — Weekly Bitcoin, Nostr & AI | Maximoto",
  description: "Essays from the Maximoto archive and cryptographically verified Nostr-signed Newstr dispatches about Bitcoin, Nostr, AI and freedom tech.",
  alternates: { canonical: "/newsletter" },
};
export default function NewsletterPage(){return <NewsletterArchive/>;}
