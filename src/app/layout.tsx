import "@/styles/globals.css";
import { Navigation } from "@/features/navigation";
import CartographyBackground from "@/features/cartography/components/CartographyBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* GLOBAL BACKGROUND */}
        <CartographyBackground />

        {/* GLOBAL NAV */}
        <Navigation />

        {/* PAGE CONTENT */}
        <main className="app-main">
          {children}
        </main>
      </body>
    </html>
  );
}