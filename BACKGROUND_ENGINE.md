# Procedural Background Engine

Milestone 2 replaces the previous route-specific CSS background with a layered, deterministic archive environment.

## Layers

1. Theme-aware base gradient
2. Atmospheric category glow
3. Dark-theme nebula depth
4. Seeded SVG star catalogue
5. Category-specific SVG geometry
6. Seeded foreground dust
7. Fine procedural grain
8. Theme-aware vignette

## Usage

The root layout automatically derives the active category from the pathname:

```tsx
<ArchiveBackground />
```

It can also be configured explicitly:

```tsx
<ArchiveBackground category="planets" intensity="cinematic" animated />
```

Available intensity levels are `quiet`, `standard`, and `cinematic`.

The generator is deterministic: the same category always receives the same stars and particles. Motion is deliberately slow and is disabled by `prefers-reduced-motion`. Transparency fallbacks are included.
