import "@/styles/globals.css";
import "@/design/tokens.css"
import { ThemeProvider } from "@/theme/ThemeProvider";
import Navigation from "@/components/navigation/Navigation";
import RouteTransition from "@/components/navigation/RouteTransition";
import { AtmosphereProvider } from "@/components/layout/AtmosphereContext";
import { NavigationHistoryProvider } from "@/components/navigation/NavigationHistoryContext";
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
        <NavigationHistoryProvider>
          <ThemeProvider>
            <AtmosphereProvider>
              <Navigation />
                <RouteTransition>{children}</RouteTransition>
            </AtmosphereProvider>
          </ThemeProvider>
        </NavigationHistoryProvider>
      </body>
    </html>
  );
}