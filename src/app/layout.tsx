import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./archive-environments.css";
import ArchiveEnvironment from "@/components/archive-environment";
import "./journey.css";
import JourneyNavigation from "@/components/journey-navigation";
import {MemoryJourney} from "@/components/memory-journey";
import {getNavigationRecords} from "@/lib/archive/navigation-data";
import "./memory-system.css";
import "./connection-explorer.css";
import "./exploration-guidance.css";
import "./source-navigation.css";
import "./graph-motion.css";
import "./pin-memory.css";
import {ResearchIndex} from "@/components/pin-memory";
import "./research/research.css";
import { MemoryPreferences } from "@/components/memory-preferences";

const display = localFont({
  src: "../fonts/barlow-condensed-latin.woff2",
  variable: "--font-display",
  weight: "600",
  display: "swap",
  fallback: ["Arial Narrow", "Arial"],
});

const body = localFont({
  src: "../fonts/dm-sans-latin.woff2",
  variable: "--font-body",
  weight: "400 600",
  display: "swap",
  fallback: ["Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://starwars-data-explorer.vercel.app"),
  title: "The Galactic Memory — Star Wars Data Explorer",
  description:
    "Discover a galaxy through its stories, connected records, and traceable sources. An independent Star Wars archive.",
  openGraph: {
    title: "The Galactic Memory — Star Wars Data Explorer",
    description: "The galaxy forgets. I remember. Explore an independent Star Wars archive.",
    type: "website",
    images: [{ url: "/images/galaxy-social.jpg", width: 1200, height: 630, alt: "An original deep-space landscape with a warm planetary sunrise" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0b0b1c", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const navigationRecords=getNavigationRecords();
  return (
    <html suppressHydrationWarning lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <head><script dangerouslySetInnerHTML={{__html: `(function(){try{var p=JSON.parse(localStorage.getItem('galactic-memory-view')||'{}');if(['holocron','jedi','imperial'].includes(p.lens))document.documentElement.dataset.memoryLens=p.lens;if(['dark','light'].includes(p.mode))document.documentElement.dataset.memoryMode=p.mode;document.documentElement.dataset.memoryType=['cinematic','archive'].includes(p.type)?p.type:'cinematic';}catch(e){}})();`}}/></head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <MemoryPreferences><ArchiveEnvironment/><MemoryJourney><ResearchIndex ids={navigationRecords.map(r=>r.id)}><JourneyNavigation records={navigationRecords}/>{children}</ResearchIndex></MemoryJourney></MemoryPreferences>
      </body>
    </html>
  );
}
