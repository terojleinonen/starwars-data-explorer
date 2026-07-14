# Data Visualization — Milestone 5

The Analysis workspace now renders real category-aware visualizations from the active filtered dataset.

## Added
- Reusable semantic SVG/bar/scatter visualization primitives with no chart dependency.
- Category-specific distributions, rankings and numeric relationship plots.
- Deterministic procedural archive signatures for the selected record.
- Field-completeness diagnostics to make missing SWAPI data visible rather than hiding it.
- Responsive and theme-aware visualization surfaces.
- Accessible SVG labels and native point tooltips.

## Category mappings
- People: gender, height ranking, height/mass relationship.
- Planets: climate, population ranking, rotation/orbit relationship.
- Species: classification, lifespan ranking, height/lifespan relationship.
- Starships: class, acquisition cost, length/crew relationship.
- Vehicles: class, speed ranking, cost/speed relationship.

All charts consume the current search and filter result set, so the analysis changes with the workspace state.
