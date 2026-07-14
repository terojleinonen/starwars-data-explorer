# Galactic Archive Design System

## Theme concepts

- **Galactic Atlas (light):** warm archival paper, stone, restrained brass, blue scientific notation, broad daylight.
- **Deep Space Observatory (dark):** graphite steel, deep-space blue-black, moonlit glass, quiet instrumentation.

Themes share geometry, typography and category colors. They differ through material, lighting, contrast and elevation—not simple inversion.

## Semantic token layers

1. Foundations: typography, spacing, radii and motion.
2. Theme roles: backgrounds, surfaces, text, borders, accents and status colors.
3. Materials: paper, stone, glass, metal and technical plate.
4. Elevation: `--shadow-1` through `--shadow-overlay`.
5. Compatibility aliases: existing components continue to work while they are migrated.

Use semantic roles such as `var(--surface-raised)` and `var(--text-secondary)`. Avoid hard-coded theme colors in component modules.

## Materials

```tsx
<section data-material="paper" data-elevation="1">…</section>
<section data-material="glass" data-elevation="2">…</section>
<section data-material="metal">…</section>
```

Available materials: `paper`, `stone`, `glass`, `metal`, `plate`.
Available elevations: `0`, `1`, `2`, `3`, `overlay`.

## Typography roles

Global utility classes:

- `.type-archive`
- `.type-section`
- `.type-subsystem`
- `.type-label`
- `.type-metadata`
- `.type-technical`
- `.type-caption`
- `.type-body`

## Category accents

Apply `--category-accent` through `categoryAccentStyle(category)` from `src/design/tokens.ts`. Category accents are intentionally restrained and theme-aware.
