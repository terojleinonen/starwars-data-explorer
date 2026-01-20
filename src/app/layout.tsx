import "@/styles/globals.css";
import "@/design/tokens.css"
import { ThemeProvider } from "@/theme/ThemeProvider";
import Navigation from "@/components/navigation/Navigation";
import RouteTransition from "@/components/navigation/RouteTransition";
import BreadcrumbsKeyboardEnhancer from "@/components/navigation/BreadcrumbsKeyboardEnhancer";
import NavigationHistoryRecorder from "@/components/navigation/NavigationHistoryRecorder";
import BreadcrumbsHistoryEnhancer from "@/components/navigation/BreadcrumbsHistoryEnhancer";
import { AtmosphereProvider } from "@/components/layout/AtmosphereContext";
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
        <AtmosphereProvider>
          <Navigation />
          <RouteTransition>{children}</RouteTransition>
        </AtmosphereProvider>
        </ThemeProvider>
        <NavigationHistoryRecorder />
        <BreadcrumbsKeyboardEnhancer />
        <BreadcrumbsHistoryEnhancer />
      </body>
    </html>
  );
}