import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Star Wars Universe — A Galaxy of Stories",
  description:
    "A first look at an independent Star Wars universe. Explore the creative eras, the connections, and the vision for an archive built on traceable sources.",
  openGraph: {
    title: "Star Wars Universe — A Galaxy of Stories",
    description: "One galaxy. Generations of imagination. An independent archive in the making.",
    type: "website",
    images: [{ url: "/images/galaxy-social.jpg", width: 1200, height: 630, alt: "An original deep-space landscape with a warm planetary sunrise" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#080b0d", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
