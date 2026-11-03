import type {Metadata} from "next";
import "./globals.css";

export const metadata:Metadata={
 metadataBase:new URL("https://maximotodev.vercel.app"),
 title:"Maximoto | Building for Freedom",
 description:"Independent engineer building Bitcoin, Nostr, FIPS and open-source AI systems. Verifiable projects, systems thinking and human-signed Newstr writing.",
 keywords:["Maximoto","Bitcoin","Nostr","FIPS","freedom tech","open source","AI/ML","Newstr"],
 openGraph:{
   type:"website",title:"Maximoto | Building for Freedom",
   description:"Bitcoin, Nostr, open systems and proof of work. Read Newstr and inspect the architecture.",
   url:"/",siteName:"Maximoto",
 },
 twitter:{card:"summary",title:"Maximoto | Building for Freedom"},
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 return <html lang="en" className="dark" data-scroll-behavior="smooth">
   <body className="antialiased bg-neutral-950">{children}</body>
 </html>;
}
