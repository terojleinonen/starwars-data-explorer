# Galactic Archive — Starwars Data Explorer

A procedural, data-driven archive for exploring people, planets, starships, vehicles, species, and films from SWAPI.

## Technology

- Next.js 16.2
- React 19.2
- TypeScript 6
- Framer Motion 12
- ESLint 9 flat configuration
- pnpm 11
- CSS Modules, semantic design tokens, and procedural SVG backgrounds

## Requirements

- Node.js 20.9 or newer; Node.js 22 LTS is recommended
- pnpm 11 or newer

Enable pnpm through Corepack when available:

```bash
corepack enable
corepack prepare pnpm@11.12.0 --activate
```

Alternatively, install pnpm globally:

```bash
npm install --global pnpm@11.12.0
```

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm check
```

`pnpm check` runs linting, type checking, and the production build in sequence.

## Package install policy

The project explicitly permits build scripts only for:

- `sharp`, used by Next.js image tooling
- `unrs-resolver`, used by the linting/import-resolution toolchain

The policy lives in `pnpm-workspace.yaml`.

## Project systems

- Semantic light and dark design system
- Procedural category-aware background engine
- Shared material-based component library
- Explorer, gallery, and analysis workspaces
- Data-driven SVG charts and archive signatures
- Responsive and reduced-motion behavior

See the milestone documents in the repository root for implementation notes.
