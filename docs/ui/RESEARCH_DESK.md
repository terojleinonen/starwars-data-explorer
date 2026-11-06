# Personal research workspace

The research desk at `/research` stores personal state separately from the published archive. It uses HTML cards, SVG relationships and a small SVG overview. No data/schema/source-file changes are needed to add desks or annotations.

## Storage and compatibility

- IndexedDB database: `galactic-memory-research`, version 1; object store: `boards`.
- Current key: `workspace`, holding a version 2 `DeskLibrary` with `activeBoardId` and named boards.
- Original key: `desk`, holding the earlier version 1 single board; retained during migration.
- A board contains `cards`, `view`, `groups`, `links` and `views`.
- `decodeLibrary` accepts the original v1 desk and v2 collections without saved views. It validates known record IDs, finite coordinates, unique IDs, group membership, link endpoints and size limits.
- Failed reads do not enable autosaving an empty replacement over the existing collection. Import errors leave current desks unchanged.
- Writes are queued in order. Temporary empty names/labels normalize to readable defaults when saved. Import creates new board IDs and keeps existing desks.

`src/lib/research-model.ts` holds the personal data model, `research-storage.ts` persistence, and `research-minimap.ts` coordinate transforms. The archive database remains read-only.

## Interaction boundaries

Archive relationships come from existing record links and retain review state and evidence. A pair uses `↔`; the stored relation label does not establish an inferred direction. Personal links use their author's explicit from/to endpoints, a cyan diamond pattern and a separate interpretation disclosure. Notes are personal, not published record summaries.

Named views save pan, zoom and graph/list presentation, not historical copies of cards. Focus mode fills the browser content area, retains the current world center and zoom, and restores focus/scrolling on exit. Its Tools and Connections panels are mutually exclusive; evidence can sit above the connection index. Opening a named view clears the panels. Escape closes evidence, then the open panel, then focus mode.

The overview includes card/group extents and the visible world area. Its projection remains fixed during a drag. Arrow keys pan, Shift increases the step and Enter fits all. It is hidden in list presentation and on empty desks.

## Verification

`pnpm test:research` runs 24 existing model/geometry checks: legacy migration, backups, groups, removed-card cleanup, malformed imports, saved views and map coordinates. It does not automate browser UI or certify accessibility.

See [the usability walkthrough](USABILITY-RESEARCH-DESK.md) for the assistant-operated three-task session and its findings. No browser-created test desks, exported backups or user notes are bundled as seed data.
