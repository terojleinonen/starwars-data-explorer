# Star Wars Universe

An independent, cinematic Star Wars archive covering the Lucas and Disney creative eras. Explore films, series, characters, worlds, species and craft through connected records with traceable sources.

The application uses its own local SQLite database. Builds and page visits do not contact SWAPI, the original website or external content APIs. Preserved legacy data and reviewed editorial additions remain clearly distinguished; the archive is a work in progress, not a fully verified encyclopaedia.

## Run locally

Use Node.js 22.13 or later (Node.js 24 recommended) and pnpm 12.15.0.

```sh
pnpm install
pnpm dev
```

For a production preview:

```sh
pnpm check
pnpm start
```

Both development and the default production preview use [http://127.0.0.1:3000](http://127.0.0.1:3000). No environment variables or external content API are required. The application reads `data/archive.sqlite`; Next.js output tracing includes this file in server deployments. Keep it with the application when deploying.

## Pages and navigation

- `/`: cinematic hero with a gold **Enter Archive** button linking to `/films`, followed by the archive overview, current collection counts, featured works, collection directory, creative eras and editorial approach. There is no homepage search field. The top bar contains only the logo and wordmark.
- `/#archive`: the overview is part of the homepage. The old `/archive` address permanently redirects here.
- `/films`, `/series`: individual SVG/CSS title cards, search, creative-era and collection/format filters, sorting and pagination.
- `/people`, `/planets`, `/starships`, `/vehicles`, `/species`: themed collections with local search, filters, list/grid views and previews.
- `/<category>/<slug>`: record descriptions, facts, connections, selected credits and source evidence. Film pages include documented versions and releases; selected series include episode guides. Original numeric addresses redirect to named pages.
- `/timeline`: real-world release chronology, filterable by films and series.
- `/sources`: source registry, attribution, reuse notes and import methodology.

Archive pages retain a Home link in the top bar. Home and both homepage wordmarks link to `/` without a section fragment and return to the beginning, including when already on the homepage. Breadcrumb links still return directly to the homepage overview.

The desktop sidebar contains the seven collections, timeline and sources without a duplicate Home entry. At 760 px and below, a hamburger menu replaces the horizontal scrolling navigation. It provides the same nine destinations, indicates the current collection, and closes with Escape, an outside click, keyboard focus leaving the menu, or a destination selection. Escape returns focus to the menu button; switching back to the desktop layout resets the mobile menu.

The interface is in English. The shared reading system uses amber for screen works, copper for personnel, turquoise for worlds and life, blue for craft, and lavender for sources. Text labels and symbols accompany the colours.

## Data and review status

Snapshot: **1 November 2026**, after SUPPLEMENT-22 and PROFILE-13.

| Dataset | Current scope |
| --- | --- |
| Records | 630: 260 preserved legacy records and 370 editorial additions |
| Screen works | 13 films and 11 series; each has a first scoped production review |
| Fact fields | 2,906: 840 verified, 436 reviewed but unestablished, 1,630 legacy fields awaiting review |
| Directed work/context links | 2,274: 1,347 verified, 924 legacy, 3 reference-only |
| Sources and citations | 862 source records and 6,467 claim-level citations |
| Selected production credits | 576 ordinary credits and 10 edition-specific credits |
| Versions and releases | 26 editions and 82 sourced release-history events |
| Episode register | 151 guide entries covering 160 numbered parts across five series |
| Episode reviews | 96 scoped reviews and 1,202 selected episode connections |
| Episode writing roles | 65 person–role rows |
| Supporting profiles | 352 new introductory profiles and 65 reviewed legacy profiles; 189 legacy supporting profiles await their first own review |

Counts describe different units, not a completion percentage. Anakin and Vader remain separate inherited records with a sourced identity connection, so record counts are not counts of unique individuals. The production selection is incomplete; the [production inventory](docs/catalogue/TEOSLUETTELO-01.md) and [master TODO](TODO-JA-ETENEMISSUUNNITELMA.md) track missing works and the intake queue.

A one-time capture on 25 October 2026 preserved the original website's six actual collections. Their upstream was SWAPI. Local preservation removes that service dependency; it does not establish the original fact sources, accuracy or reuse terms. Imported fields retain their provenance and review status. Unestablished values are withheld from published fact values and previews while original raw values and assessment history remain recoverable.

Checked details have individual citations and visible review scopes. A source attached to one fact does not verify an entire profile. A series-level connection does not prove an appearance in every episode. Omitted connections mean unestablished within the selected review scope, not proven absence. Physical scenes, transmissions, flashbacks, visions, remote Force contact and Force spirits retain their own context.

## Current research scope

New release-date research is limited to each work's original US cinema, television or streaming launch. Documented distinct editions retain their identities and already sourced dates and credits. Earlier verified release-history events remain visible; further territory, platform, ordinary rerelease and home-media calendar expansion is deferred.

All 24 current works have a first scoped review, but complete end-credit rolls, every edition and every episode appearance are not finished. Selected-profile episode reviews cover all registered Mandalorian, Obi-Wan Kenobi and Skeleton Crew episodes. Rebels has 58 of 66 guide entries reviewed; eight season-four guides covering nine numbered parts and 47 Bad Batch episodes remain in the registered appearance-review queue.

The latest episode batch covers Rebels season four’s first five guides, Heroes of Mandalore through Kindred (numbered parts 1–7): 78 new episode connections, nineteen introductory profiles and 26 official sources. The opening two-part stories retain combined guides. Bail’s hologram, Saw’s remote/physical sequence, Edrio’s identity, Faos/Taos, the hovering GAVr, the elite Defender prototype and the unusual wolf journey keep explicit scopes; two individual scene forms remain unresolved.

PROFILE-13 reviews AT-AT, AT-ST, Snowspeeder, Imperial Speeder Bike and Sand Crawler: all fifty inherited fields assessed, fifteen verified/corrected, 35 unestablished, sixteen new facts and 32 checked connections. Height versus length, flat-ground versus atmospheric speed, standard crew versus actual riders and mixed-model source boundaries remain explicit.

The next planned batch is SUPPLEMENT-23: Crawler Commandeers, Rebel Assault, Jedi Night, Dume and Wolves and a Door (Rebels season-four parts 8–12). See the [master TODO](TODO-JA-ETENEMISSUUNNITELMA.md) for the current order and remaining limits.

## Offline rebuild and verification

```sh
pnpm data:build  # rebuild SQLite and import reports from local inputs
pnpm data:check  # integrity, preservation, provenance and semantic checks
pnpm check      # data checks, ESLint, TypeScript and production build
```

Rebuilds use local snapshots and editorial JSON. Run a production build after rebuilding data to refresh prerendered pages. The optional `scripts/capture-legacy.mjs` is the one-time online capture tool; it is never part of normal builds or visits and must not silently refresh the preserved dataset.

The latest production build generated 904 routes, including named records, retained numeric redirects and the former overview redirect. Data integrity, provenance and semantic checks, ESLint and TypeScript passed. Individual research batches include preservation audits and scoped browser QA.

The navigation refresh was checked at 320, 390, 760 and 761 px and desktop width: the Enter Archive destination, all nine mobile menu links, keyboard opening and Escape/focus return, outside dismissal, the desktop/mobile boundary, and Home/header/footer wordmark returns. Route transitions temporarily disable smooth scrolling; on-page section links retain their normal scrolling behavior. The SQLite database was byte-for-byte unchanged by this interface update. No full-site browser coverage or field Core Web Vitals measurement is claimed.

## Performance and accessibility

Pages are statically prerendered. Collection searches and filters operate locally in the browser, and database files remain on the server. The homepage overview is server-rendered without an additional background image or client-side data request.

Fonts are self-hosted. Original backgrounds use pre-encoded responsive AVIF/WebP variants; the homepage image is visible before client JavaScript and its AVIF sizes are approximately 9, 19 and 32 KB. No animation library, background video, canvas or WebGL is loaded. Decorative motion respects reduced-motion settings and can be paused.

Controls have visible labels, keyboard focus and accessible review disclosures. Department colours are supplemented with names and symbols. The updated homepage has been checked from 320 px phone width through tablet and desktop sizes; its hero uses one primary archive link on every screen size.

## Assets and rights

Every current film and series has an original SVG/CSS title-card design. No official film posters or source images are redistributed. Narrative opening crawls were excluded from the legacy import; source prose and captions are not reproduced wholesale.

- [Original hero artwork](artwork/README.md): provenance and generation prompt.
- [Collection backgrounds](artwork/archive-backgrounds.md): original artwork, prompts and saved paths; [asset sizes](artwork/archive-background-sizes.json).
- [Title-card designs](docs/TITLE_CARDS.md): individual designs for 13 films and 11 series.
- `src/fonts/OFL-*.txt`: Barlow Condensed and DM Sans font licence notices.
- `src/content/eras.ts`: sources for the creative-era introductions.
- [Data documentation](data/README.md): local inputs, provenance and review overlays. Earlier batch counts there describe historical stages.

The orbital mark and category insignia are original SVG. Application code is MIT-licensed; this does not grant rights to franchise material or external source content. Public availability is not an open text or image licence. Source records distinguish openly licensed data from reference-only use; imported data reuse terms remain a separate review task. This is an independent fan project, not affiliated with Lucasfilm or Disney.

## Dependencies and documentation

Current package pins: Next.js 16.4.3, React/React DOM 19.3.1, TypeScript 6.0.3 and ESLint 9.39.5, with pnpm 12.15.0. See [package.json](package.json) and the lockfile for the exact dependency set. These are the project's installed versions, not a claim about the latest upstream releases.

- [Master TODO and phased plan](TODO-JA-ETENEMISSUUNNITELMA.md): current scope, counts and next tasks, in Finnish.
- [Verification history](VERIFIED.md): completed checks and remaining limits; dated entries retain their historical counts.
- [Review reports](docs/reviews/): evidence, corrections, limitations and preservation/QA logs for individual batches.
- [Latest episode review — SUPPLEMENT-22](docs/reviews/SUPPLEMENT-22.md).
- [Latest legacy-profile review — PROFILE-13](docs/reviews/PROFILE-13.md).
- [Original design proposal](docs/ARCHIVE_PROPOSAL.md): historical starting proposal, superseded by the current implementation and master TODO.
