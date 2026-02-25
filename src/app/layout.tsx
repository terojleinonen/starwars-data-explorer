import "@/styles/globals.css";
import "@/design/tokens.css"
import { ThemeProvider } from "@/theme/ThemeProvider";
import Navigation from "@/features/navigation/components/Navigation";
import RouteTransition from "@/features/navigation/components/RouteTransition";
import { AtmosphereProvider } from "@/features/layout/components/AtmosphereContext";
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