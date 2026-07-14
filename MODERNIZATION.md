# Modernization milestone

## Package manager

- Migrated project metadata and commands from npm to pnpm 11.
- Removed npm, Tailwind, legacy PostCSS, and legacy ESLint configuration files.
- Added explicit package build-script permissions in `pnpm-workspace.yaml`.

## Framework and libraries

- Next.js 15.5.15 → 16.2.10
- React / React DOM 19.0 → 19.2.7
- Framer Motion 11 → 12.42.2
- TypeScript 5 → 6.0.3
- ESLint 8 → 9.39.5
- eslint-config-next 15 → 16.2.10
- Updated React, Node, testing, and DOM type/tooling packages.

ESLint 9 and TypeScript 6 are deliberately used instead of ESLint 10 and TypeScript 7 because the current Next.js 16.2 lint stack does not yet declare compatibility with those newer major versions.

## Security

- Forced Next.js's transitive PostCSS dependency to the patched 8.5 line.
- Audit after the upgrade reported zero known vulnerabilities.
- Avoided `audit fix --force` and its unsafe downgrade/major-change behavior.

## React fixes

The newer lint stack identified state updates performed synchronously inside effects. These were fixed by:

- Clamping workspace pagination during render rather than with an effect.
- Closing mobile navigation from navigation actions rather than pathname effects.
- Replacing theme mount/effect state with `useSyncExternalStore` and a small browser theme store.

## Project quality

- Added flat `eslint.config.mjs`.
- Added `typecheck`, `check`, and cross-platform `clean` scripts.
- Added `.editorconfig`, `.nvmrc`, and strict engine declarations.
- Added a pnpm-based GitHub Actions quality workflow.
- Updated the README for the new toolchain.
