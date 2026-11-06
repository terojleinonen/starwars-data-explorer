# Galactic Memory archive environments

The Galactic Memory refresh adds six AI-generated decorative archive interiors. They are visual environments, not source illustrations or depictions used as historical evidence. They do not contain official film frames, posters or redistributed reference images.

| Perspective | Dark environment | Light environment |
| --- | --- | --- |
| Holocron knowledge | Indigo chamber with a warm suspended archive glow | Pale stone chamber and soft gold light |
| Jedi archives | Dark, quiet monumental archive | Luminous stone archive |
| Imperial records | Dark industrial registry architecture | Light, restrained Imperial registry architecture |

Runtime files live in `public/images/` with the naming pattern `archive-{holocron,jedi,imperial}-{dark,light}-{800,1672}.{avif,webp}`. Each of the six environments has 800 px and 1672 px AVIF/WebP variants: 24 assets in total. `src/components/archive-environment.tsx` and `src/app/archive-environments.css` select the perspective/theme and responsive format.

The encoded asset manifest is [galactic-memory-environment-sizes.json](galactic-memory-environment-sizes.json). The runtime uses these pre-encoded images, not a procedural renderer or full-size generation files. Earlier artwork provenance remains in [archive-backgrounds.md](archive-backgrounds.md).
