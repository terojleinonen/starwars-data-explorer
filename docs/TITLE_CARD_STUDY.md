# Four original title-card studies

Implemented on 26 October 2026 within the existing catalogue structure.

| Record | Page | Visual interpretation |
| --- | --- | --- |
| A New Hope | `/films` | Almost black, warm point of light and concentric orbital lines; large cream typography |
| The Empire Strikes Back | `/films` | Ice blue, a broad diagonal shadow and sharp light lines; tiered title typography |
| Andor | `/series` | Charcoal, fine grid and a broken muted-red signal line; a single strong title |
| The Mandalorian | `/series` | Sand and metal, horizon lines and a restrained circular mark; a full-width title |

Only these four records receive the new design. Every other record keeps its current cover, making this a comparison within the real gallery. Films stay in the Films collection and series in Series; no series are inserted into the film dataset and no showcase section or page structure is added.

## Implementation

Original native SVG motifs and CSS surfaces in `src/components/archive/title-card.tsx`, selected by collection and stable slug from `RecordCover`. The graphics are not official insignia, film frames or posters and do not depend on an image service. No image generation or raster assets are needed for these geometric motifs. No new package is added.

Names, links, catalogue captions and sorting continue to use existing records. Production year and director/creator/format are taken from the local data; the design does not introduce new researched facts. The original metadata's review status remains visible on the record page and in the collection notes.

Shared fonts, card padding, responsive grid, background scenes and catalogue controls remain in place. The four cards retain the current cover dimensions. Container-relative type sizing keeps names inside narrow cards.

Hover and keyboard focus illuminate the card border. A small hover translation applies only to fine pointers. Reduced-motion preferences remove the translation and transitions; all metadata remains visible on touch screens.


## Extended to the full catalogue

The approved study was extended to all 24 current film and series records on 26 October 2026. See `docs/TITLE_CARDS.md` for the final collection-wide design and implementation.
