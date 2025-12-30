import "@/styles/globals.css";
import { ThemeProvider } from "@/theme/ThemeProvider";
import Navigation from "@/components/navigation/Navigation";
import RouteTransition from "@/components/navigation/RouteTransition";
import { CommandPaletteProvider } from "@/components/command/CommandPaletteContext";
import SpaceBackdrop from "@/components/layout/SpaceBackDrop";
import BreadcrumbsKeyboardEnhancer from "@/components/navigation/BreadcrumbsKeyboardEnhancer";
import NavigationHistoryRecorder from "@/components/navigation/NavigationHistoryRecorder";
import BreadcrumbsHistoryEnhancer from "@/components/navigation/BreadcrumbsHistoryEnhancer";
import BackArrowEnhancer from "@/components/navigation/BackArrowEnhancer";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SpaceBackdrop>
          <Navigation />
          <RouteTransition>
            <CommandPaletteProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </CommandPaletteProvider>
          </RouteTransition>
        </SpaceBackdrop>
        <NavigationHistoryRecorder />
        <BreadcrumbsKeyboardEnhancer />
        <BreadcrumbsHistoryEnhancer />
        <BackArrowEnhancer />
      </body>
    </html>
  );
}