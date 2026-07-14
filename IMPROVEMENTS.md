# Improvement pass

## What changed

- Rebuilt the global design tokens into one coherent light/dark system.
- Added metadata, viewport theming, pre-paint theme initialization, reduced-motion support, and a skip link.
- Rebuilt the navigation with active-route state, semantic mobile navigation, clearer branding, and fixed responsive behavior.
- Fixed the theme toggle stylesheet/component mismatch that left the control effectively unstyled.
- Rebuilt the landing page as an information terminal rather than a collection of generic glowing cards.
- Added a CSS-only orbital instrument, responsive telemetry, stronger information hierarchy, and more restrained motion.
- Removed unused Tailwind dependencies and simplified PostCSS.
- Aligned Next.js and ESLint package versions and restored working lint/build scripts.

## Recommended next milestone

Move record counts and archive status to server-derived data, then refactor the repeated category cards/panels into one schema-driven record presentation system. This will reduce visual and architectural duplication across People, Planets, Starships, Species, and Vehicles.
