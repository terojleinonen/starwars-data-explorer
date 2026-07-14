import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Navigation } from "@/features/navigation";
import { ArchiveBackground } from "@/features/background";

export const metadata: Metadata = {
  title: {
    default: "Galactic Archive",
    template: "%s · Galactic Archive",
  },
  description:
    "A responsive data-exploration interface for people, planets, starships, films, species, and vehicles from SWAPI.",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070b" },
    { media: "(prefers-color-scheme: light)", color: "#e9edf2" },
  ],
};

const themeBootScript = `
  (() => {
    try {
      const stored = localStorage.getItem("theme");
      const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to archive content</a>
        <ArchiveBackground />
        <Navigation />
        <main id="main-content" className="app-main">{children}</main>
      </body>
    </html>
  );
}
