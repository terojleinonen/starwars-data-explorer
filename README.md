# The Galactic Memory — Star Wars Data Explorer

An independent, cinematic Star Wars archive. Enter through the history of the galaxy, follow documented connections between records, and collect your own questions on a personal research desk.

The Galactic Memory presents an unknown keeper with access to **Jedi archives**, **Imperial records** and **Holocron knowledge**. These are three visual reading perspectives on the same collection, not three separate source databases. Amber and gold, deep indigo, original archive interiors and cinematic typography define the interface. Dark/light themes and cinematic/classic headings are available in **Archive settings**.

The application reads its own local SQLite database. Builds and page visits do not contact SWAPI or external content APIs. Legacy records, checked details, reference-only links and personal interpretations retain distinct meanings. This is a developing source-led archive, not a fully verified encyclopaedia.

## Run locally

Use Node.js **22.13 or later** and **pnpm 12.15.0**. Node.js 24 or later is suitable for the built-in SQLite support.

```sh
pnpm install
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). No environment variables or external content API credentials are required.

For the development preview used during interface work:

```sh
pnpm exec next dev --hostname 127.0.0.1 --port 3100
```

For a production preview:

```sh
pnpm check
pnpm start
```

Keep `data/archive.sqlite` with the application when deploying. Next.js output tracing explicitly includes it. The app uses server rendering and prerendered pages; it is not a static HTML export.

## Find a way into the archive

The homepage is a one-page portal with three entry paths: **Follow the history**, **Find a familiar name** and **Trace the connections**. Collection statistics sit at the bottom. The shared navigation groups destinations under **History**, **Galaxy**, **Connections** and **Archive**, alongside a name search, appearance settings and the recent-memory trail.

| Route | Purpose |
| --- | --- |
| `/` | Portal, history chapters, record search, starting connections and archive overview |
| `/#archive` | Homepage overview; the former `/archive` address redirects here |
| `/history` | Saga chapters and connected works, characters and worlds |
| `/galaxy` | Schematic galactic atlas with reviewed location details and connections |
| `/war-room` | Rebel war map of documented operational relationships |
| `/investigate` | Full-archive connection explorer with graph/list views and source evidence |
| `/compare` | Shared connections between two records, with evidence for each side |
| `/compare?mode=path` | A shortest recorded connection path; `scope=checked` restricts it to checked links |
| `/research` | Personal research desks, notes, groups, saved views and overview map |
| `/films`, `/series` | Screen-work collections with individual SVG/CSS title cards and filters |
| `/people`, `/planets`, `/starships`, `/vehicles`, `/species` | Themed record collections, search and previews |
| `/<category>/<slug>` | Record workspace: connections, recorded details and sources; numeric legacy URLs redirect here |
| `/timeline` | Real-world release chronology for films and series |
| `/sources` | Source registry, attribution, reuse notes and review methodology |

The history atlas uses saga/episode order where recorded; it does not invent a complete dated BBY/ABY chronology. Galactic positions are schematic, not measured coordinates or hyperspace routes. The war map combines relationships from different periods, not simultaneous front lines or territorial control.

## Explore connected memories

Select a graph node to inspect its record and connection evidence. **Explore from here** moves that memory to the center; the trail lets you return through earlier centers. Filters, pagination and list views keep larger neighborhoods manageable. Supported browsers animate graph recentering; reduced-motion preferences and unsupported browsers retain a direct state update.

Record constellations keep their exploration state in the URL. **Copy exploration link** includes the trail, selected memory, category filter and presentation. Comparison and path views can also be shared by URL, and record pages retain a return link to their originating comparison. Citations open the source workspace with a return to the cited passage.

Shared neighbors and graph paths describe recorded relationships. They do not prove that two people met or participated in the same event. Imported relation labels remain visible; archive pairs use `↔` so the interface does not imply an unsupported direction. Read the source context to interpret a relationship.

## Build a personal research desk

1. Open **Add to research desk** in a graph inspector, select a desk and pin the memory without leaving the graph. Existing cards are recognized instead of duplicated. Record pages also provide an entry to the desk.
2. Create and rename separate desks. Search for more records, add personal notes and drag cards by their headers. Checkboxes select multiple cards for grouping and movement.
3. Name card groups and move them together. Add labeled **personal interpretation** links between cards; these remain separate from archive evidence.
4. Pan empty space, zoom, use **Fit all**, or click/drag the **Overview** map. The overview supports arrow keys, Shift for a larger move and Enter to fit the desk.
5. Save named views to remember position, zoom and graph/list presentation. Views use the current cards and content; they are navigation bookmarks, not historical copies of a desk.
6. Use **Focus mode** for the full browser content area. **Tools** opens the editing panel; **Connections** opens recorded and personal relationships, including in list presentation. Opening a saved view clears the panels. Escape closes evidence, then the open panel, then focus mode.

Gold marks checked archive connections; lavender dots indicate pending/reference links. Cyan diamonds mark personal interpretations. Labels and source disclosures accompany the colours. Undo restores recent desk edits, including removed cards, annotations and views.

### Local storage and backups

Research desks are saved in this browser's **IndexedDB**, separately from `data/archive.sqlite`. Notes, card positions, groups, personal connections and saved views never modify the archive. There is no account, server synchronization or multi-user collaboration. Appearance preferences use `localStorage`; the recent-memory trail uses `sessionStorage`.

**Export all desks** downloads a JSON backup. **Import desks** adds imported desks as new copies rather than replacing existing research. Older single-desk backups are supported. Clearing site data or changing browser/origin can make local desks unavailable; export a backup before moving devices or hosting addresses. The development origins on ports 3000 and 3100 have separate browser storage. Browser test desks are not seeded into the repository.

Limits per desk: 500 cards, 2,000 personal connections and 50 saved views; a collection can contain 100 desks. See [research workspace notes](docs/ui/RESEARCH_DESK.md) for implementation and preservation details.

## Data and review status

Dataset snapshot: **4 November 2026**, after SUPPLEMENT-29 and PROFILE-19. The Galactic Memory interface refresh preserves this dataset; it adds presentation and separately stored personal workspace state.

| Dataset | Current scope |
| --- | --- |
| Records | 758: 260 preserved legacy records and 498 editorial additions |
| Screen works | 13 films and 11 series; each has a first scoped production review |
| Fact fields | 3,161: 1,144 verified, 622 reviewed but unestablished, 1,395 legacy fields awaiting review |
| Directed work/context links | 2,925: 2,068 verified, 854 legacy, 3 reference-only |
| Sources and citations | 1,094 source records and 9,076 claim-level citations |
| Selected production credits | 576 ordinary credits and 10 edition-specific credits |
| Versions and releases | 26 editions and 82 sourced release-history events |
| Episode register | 151 guide entries covering 160 numbered parts across five series |
| Episode reviews | 129 scoped reviews and 1,744 selected episode connections |
| Episode writing roles | 65 person–role rows |
| Supporting profiles | 480 new introductory profiles and 95 reviewed legacy profiles; 159 legacy supporting profiles await their first own review |

Counts describe different units, not a completion percentage. Anakin and Vader remain separate inherited records with a sourced identity connection. The [production inventory](docs/catalogue/TEOSLUETTELO-01.md) and [master TODO](TODO-JA-ETENEMISSUUNNITELMA.md) track missing works and the review queue.

A one-time capture on 25 October 2026 preserved the original website's six collections, whose upstream was SWAPI. Local preservation removes the live service dependency; it does not establish original fact sources, accuracy or reuse terms. Imported fields retain provenance and review status. Unestablished values are withheld from published facts while raw values and assessment history remain recoverable.

Checked details have individual citations and scoped reviews. A source attached to one fact does not verify an entire profile. Series-level connections do not prove appearances in every episode, and omitted links are unestablished within the review scope rather than proven absences. Physical scenes, transmissions, flashbacks, visions, remote Force contact and Force spirits retain their contexts.

All 24 current works have an initial scoped review; full credits and every edition/appearance remain incomplete. Registered selected-profile reviews cover The Mandalorian, Obi-Wan Kenobi, Skeleton Crew and all 66 Rebels guides. The latest episode batch covers Bad Batch S2E5–9; 25 of 47 registered episodes have selected-record reviews and 22 remain. PROFILE-18 reviews five craft profiles; PROFILE-19 reviews Nute Gunray, Finis Valorum, Mas Amedda, Wat Tambor and San Hill. The next planned data batch is PROFILE-20, covering Wookiee, Trandoshan, Kaminoan, Chagrian and Muun. Evidence, limitations and preservation audits live in [review reports](docs/reviews/).

## Verification

```sh
pnpm data:check     # database integrity, preservation, provenance and review semantics
pnpm test:research  # workspace migration, backup validation, saved views and map geometry
pnpm lint          # ESLint
pnpm typecheck     # route generation and TypeScript
pnpm build         # production build
pnpm check         # all checks above
```

The current production build reports 1,039 prerendered pages alongside dynamic routes. The interface was exercised through record/graph navigation, source jumps, comparison, path finding and personal research workflows. The [research-desk walkthrough](docs/ui/USABILITY-RESEARCH-DESK.md) records three tasks, findings and fixes. It is an assistant-operated browser walkthrough, not a study with external participants. No full-site browser coverage or field Core Web Vitals measurement is claimed.

Data rebuilding is a separate maintenance operation, unnecessary for UI work:

```sh
pnpm data:build  # rebuild SQLite and import reports from existing local inputs
```

Rebuilds use local snapshots and editorial JSON. Rebuild prerendered pages afterwards. The optional `scripts/capture-legacy.mjs` is the historical online capture tool; normal builds never run it or silently refresh the dataset.

## Implementation, performance and accessibility

Next.js App Router and React render the archive over read-only SQLite. Record/collection pages are prerendered where possible; atlas, comparison and research routes use server rendering. Collection filters and desk interactions run locally. `/api/connections` reads the local archive for graph exploration; it does not proxy an external service.

Cards and editable notes are HTML/React; graphs, connections and the overview map use SVG. There is no vector database, canvas renderer, WebGL engine, background video or added animation dependency. The research overview redraws on state/size changes, without a continuous animation loop. Fonts and decorative AVIF/WebP images are self-hosted, with responsive archive environments for each perspective and theme.

Controls include visible labels and keyboard focus. Graph/list alternatives, source-return controls, keyboard map navigation, collapsible panels and Escape/focus restoration support exploration. Reduced-motion preferences disable graph transitions and influence scrolling. The interface is in English.

## Assets and rights

Screen works use original SVG/CSS title-card designs. Decorative archive environments are generated artwork, not extracted film frames. No official film posters or source images are redistributed. Opening crawls were excluded from the legacy import; source prose and captions are not reproduced wholesale.

- [Original hero artwork](artwork/README.md) and [collection backgrounds](artwork/archive-backgrounds.md): earlier artwork provenance and prompts.
- [Galactic Memory environments](artwork/galactic-memory-environments.md): perspective/theme variants and asset sizes.
- [Title-card designs](docs/TITLE_CARDS.md): individual designs for 13 films and 11 series.
- `src/fonts/OFL-*.txt`: Barlow Condensed and DM Sans font licences.
- `src/content/eras.ts`: sources for creative-era introductions.
- [Data documentation](data/README.md): preserved inputs, provenance and review overlays.

The wordmark, orbital mark and category insignia are original SVG. Application code is MIT-licensed; that does not grant rights to franchise material or external source content. Public availability is not an open text/image licence. Imported-data reuse terms remain a separate review task. This independent fan project is not affiliated with Lucasfilm or Disney.

## Project documentation

Installed package pins: Next.js 16.4.3, React/React DOM 19.3.1, TypeScript 6.0.3 and ESLint 9.39.5, with pnpm 12.15.0. See [package.json](package.json) and the lockfile; these are project versions, not a claim about latest upstream releases.

- [Master TODO and phased plan](TODO-JA-ETENEMISSUUNNITELMA.md): data scope, counts and next review batches, in Finnish.
- [Verification history](VERIFIED.md): historical checks and their scoped limits.
- [Research desk](docs/ui/RESEARCH_DESK.md) and [usability walkthrough](docs/ui/USABILITY-RESEARCH-DESK.md).
- [Latest episode review — SUPPLEMENT-29](docs/reviews/SUPPLEMENT-29.md).
- [Latest legacy-profile review — PROFILE-19](docs/reviews/PROFILE-19.md).
- [Original archive proposal](docs/ARCHIVE_PROPOSAL.md): historical starting point, superseded by the current interface.
