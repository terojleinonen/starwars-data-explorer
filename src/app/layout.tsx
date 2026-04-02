import "@/styles/globals.css";
import "@/design/tokens.css"
import { ThemeProvider } from "@/theme/ThemeProvider";
import Navigation from "@/features/navigation/components/Navigation";
import RouteTransition from "@/features/navigation/components/RouteTransition";
import { NavigationHistoryProvider } from "@/features/navigation/components/NavigationHistoryContext";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <NavigationHistoryProvider>
            <Navigation />
            <RouteTransition>{children}</RouteTransition>
          </NavigationHistoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}