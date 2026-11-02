import type { Metadata } from "next";
import "./globals.css";

// Build-safe system font stacks are defined in globals.css.
// Avoid next/font/google Turbopack module generation during deployment.

export const metadata: Metadata = {
  metadataBase: new URL("https://maximotodev.vercel.app"),
  title: "Maximoto | Bitcoin, Nostr, FIPS & AI Systems Architect",
  description: "Explore verifiable proof of work, interactive system architectures and engineering decisions across Bitcoin, Nostr, FIPS mesh networking, decentralized technologies, and AI/ML.",
  keywords: ["Maximoto", "Bitcoin engineering", "Nostr", "FIPS mesh", "AI/ML architecture", "decentralized systems", "open source"],
  openGraph: {
    type: "website",
    title: "Maximoto | Sovereign Systems Architecture",
    description: "Inspect architecture, trust boundaries and proof of work for Bitcoin, Nostr, FIPS and agentic systems.",
    url: "/",
    siteName: "Maximoto",
  },
  twitter: { card: "summary", title: "Maximoto | Sovereign Systems Architecture" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className="antialiased bg-neutral-950"
      >
        {/* 2. Global Background Grid Texture */}
        <div className="fixed inset-0 z-[-1] h-full w-full bg-neutral-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>

        {children}
      </body>
    </html>
  );
}
