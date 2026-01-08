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
          <Navigation />
          <RouteTransition>         
              <ThemeProvider>{children}</ThemeProvider>
          </RouteTransition>
        <NavigationHistoryRecorder />
        <BreadcrumbsKeyboardEnhancer />
        <BreadcrumbsHistoryEnhancer />
      </body>
    </html>
  );
}