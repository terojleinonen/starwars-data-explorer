import "@/styles/globals.css";
import { ThemeProvider } from "@/theme/ThemeProvider";
import Navigation from "@/components/navigation/Navigation";
import RouteTransition from "@/components/navigation/RouteTransition";
import BreadcrumbsKeyboardEnhancer from "@/components/navigation/BreadcrumbsKeyboardEnhancer";
import NavigationHistoryRecorder from "@/components/navigation/NavigationHistoryRecorder";
import BreadcrumbsHistoryEnhancer from "@/components/navigation/BreadcrumbsHistoryEnhancer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navigation />
          <RouteTransition>{children}</RouteTransition>
        </ThemeProvider>
        <NavigationHistoryRecorder />
        <BreadcrumbsKeyboardEnhancer />
        <BreadcrumbsHistoryEnhancer />
      </body>
    </html>
  );
}