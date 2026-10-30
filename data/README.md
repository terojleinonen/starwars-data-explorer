# Archive data

This is our local dataset. Builds and page visits do not contact SWAPI, the old website or official reference sites.

## Files

- `archive.sqlite`: SQLite database consumed read-only by the application.
- `legacy/*.json`: sanitized one-time snapshots captured from the original website on 25 October 2026. Fields containing narrative opening crawls were deliberately removed.
- `legacy/manifest.json`: capture time, original endpoint, counts, exclusions and SHA-256 of each original fetched response. These hashes describe original responses, not the sanitized JSON files.
- `editorial.json`: 18 manually entered screen-production records, short original descriptions and official public reference URLs.
- `import-report.json`: reproducible counts, unresolved links and integrity results from the offline rebuild.

## Preserved collections

| Collection | Original records |
| --- | ---: |
| Characters | 82 |
| Worlds | 60 |
| Starships | 36 |
| Vehicles | 39 |
| Species | 37 |
| Films | 6 |
| Total | 260 |

The old landing page's advertised counts differed from the actual responses. The import uses actual records. With seven additional films and eleven series, the initial prototype had 278 records. The first four-production review adds seven supporting profiles and the second five-film review adds six: that stage had 291 records, 2,315 facts and 1,233 directed relationships. After batches 03–05, the current database has 366 records, 2,449 facts and 1,400 directed relationships. These are database record counts; original Anakin and Vader profiles remain separate but connected.

## Rebuild and check

```sh
pnpm data:build
pnpm data:check
```

Both commands work entirely offline. Rebuild replaces the derived SQLite file and report using snapshots and editorial input. Run `pnpm build` afterward to refresh prerendered pages. The optional capture script requires network access and is deliberately absent from normal build scripts; it must not silently refresh the preserved dataset.

The schema stores `records`, `sources`, `facts`, `record_sources`, `links` and `metadata`. Every fact and relationship has a source identifier and review state. Local IDs and slugs replace remote relationship URLs. Original numeric IDs exist solely to preserve old links.

## Evidence and reuse status

`legacy` means preserved from the old website, whose upstream was swapi.info. It is provenance, not independently verified fact sourcing. Individual fact sources and data reuse terms remain unestablished. The UI makes that limitation visible on collection, source and record pages.

`editorial` records contain manually selected metadata and original summaries. `reference` facts/links have an official reference attached. An official link does not independently verify every legacy field on a connected record. The 2014 continuity announcement supports the six original films' continuity classification; the Vader Databank reference supports the Anakin/Vader identity link.

No source's images, official posters or narrative opening crawls are redistributed. Public availability is not treated as permission to copy protected expression. Before broad public reuse of the imported dataset, complete individual fact review and determine the relevant reuse terms. The present UI is a local reviewable prototype rather than a claim that the archive is complete or fully verified.

## Editorial scope

The release timeline uses real-world release years, not in-universe chronology. Creative eras are separate from continuity. The Clone Wars television series spans eras; the 2003 micro-series is explicitly outside current canon. The production selection is illustrative and does not yet include every series, short, special or episode.


## Reviewed overlays — pilot 01

`reviews/pilot-01.json` contains the first four-title review and seven supporting profiles. `reviews/wikidata-2026-10-26.json` is a selected-property CC0 snapshot with pinned revisions, qualifiers and references retained. It is not an instruction to accept every statement. The normal build never refreshes it online.

Reviewed overlays run after the original import. `reviews/change-log.json` records old and new summary/attribute values. The original snapshots remain unchanged. The builder uses a temporary database and replaces the live file only after a successful import.

The schema now also includes `review_batches`, `record_reviews`, `contributors`, `credits`, `citations` and `review_issues`. Real contributors are separate from fictional character records. Credits have roles, character references, language/season/episode scope and individual citations. Multiple evidence items may support one fact or link. Source records distinguish open-data licensing from reference-only use.

There are 39 checked fields, 77 selected credits, 47 checked outgoing connections and 189 evidence entries. These are scoped checks, not complete verification of every field or every episode. The 20 other screen productions remain outside this first review. See `docs/reviews/PILOT-01.md` for sources, corrections and open issues.

## Original-trilogy editions

`reviews/original-trilogy-editions.json` adds six edition records and seven US theatrical release events under the existing three films. Six events are released; the initially announced 7 March 1997 Jedi opening is explicitly superseded by the actual 14 March opening. `reviews/edition-change-log.json` records five scoped Jedi fact updates.

The schema adds `film_editions`, `release_events` and `edition_credits`. Existing pilot credits can reference their original edition through `credits.edition_id`; revision work is never implicitly inherited from the original production. Eight selected credits were added, alongside the 77 pilot entries. The combined reviewed layers have 225 citation entries and 44 checked fact fields. Pilot counts above describe the first review before this extension. Every edition, release and new edition credit has evidence.

This remains selected history: other territories, later home-video editions, complete credits and cut-specific appearance indices are pending. Jedi's edition history does not mark the rest of the record fully checked. See `docs/reviews/ORIGINAL_TRILOGY_EDITIONS.md` for the source conflict and exact scope.

## Five-film review — batch 02

`reviews/pilot-02.json` adds selected facts, original summaries, 86 scoped original-film credits, 51 checked outgoing connections and six supporting profiles. `reviews/films-02-editions.json` adds ten editions, 24 cinema/TV/streaming events and one conversion credit. Every new subject has individually located evidence. The inputs add 47 reference-source rows and 261 citation entries. Current reviewed totals are 108 fact fields, 163 ordinary credits, nine edition credits and 486 citations; earlier sections retain historical batch counts. Nine productions have received scoped reviews; fifteen have not.

`release_events.record_id` always identifies the work. `edition_id` is nullable: thirteen later releases have verified availability but no identified edit/master. `date_end` preserves convention-window precision. Release medium is constrained to Theatrical, Television or Streaming; classification, physical-media and purchase-download dates are not launch events. The UK PG cut is documented without inventing a release day. Twenty released additional events enter the timeline; three superseded announced dates do not.

Original/revision contributors are kept separate. The builder assigns all 86 new original credits to their original edition. An ordinary rerelease or 4DX presentation is not automatically a newly edited film. Source kind reflects the current host: studio material preserved on a third-party site is reference-only. The normal build remains offline.

See `docs/reviews/FILMS-02.md` for the edition search, version uncertainties, film-versus-series voice differences and unverified Clone Wars feature-film location/vehicle links. A scoped review is not a complete shot-by-shot or country-by-country audit.

## Five-film review — batch 03

`reviews/pilot-03.json` reviews Rogue One, The Last Jedi, Solo, The Rise of Skywalker and The Mandalorian and Grogu, with 59 checked facts, 105 selected original-production credits, 51 checked outgoing links, 16 introductory supporting profiles and 47 public reference sources. `reviews/films-03-editions.json` adds seven editions and fifteen selected cinema/streaming events; no physical-media or digital-purchase release dates. Together they add 267 citation entries.

Current totals: 307 records, 2,358 facts, 1,284 directed links, 167 checked fact fields, 268 ordinary credits, nine edition credits and 753 citations. Thirteen films and eleven series remain distinct works. Fourteen productions have scoped reviews; ten await one, including Jedi’s full production record beyond its edition history. Historical counts in earlier sections describe those earlier batches.

There are 23 editions and 46 events (43 released, three superseded); 21 events deliberately have no identified edition/master. The timeline includes 30 released additional events. Music-only audio and expanded IMAX framing are labelled presentations, not newly extended story cuts. Rogue One’s 2022 IMAX/Andor-preview event does not establish an extended film. Main-film and score-only-extra availability on the same day remain separate assets. The Rise of Skywalker’s Netherlands exception has its own event.

All sources in this batch are reference-only, not open-licensed copies. Original descriptions and selected facts are stored; source text, transcripts and media are not redistributed. AFI’s conflicting Rogue One runtime is left unresolved rather than used to invent a version. New character/vehicle/world profiles are explicitly narrow. See `docs/reviews/FILMS-03.md` for sources and verification.


## Film and series review — batch 04

`reviews/pilot-04.json` reviews Return of the Jedi, Clone Wars: 2D Micro-Series, Rebels, The Mandalorian and The Bad Batch: 48 new checked fields, 102 selected ordinary credits, 61 checked outgoing connections, 21 introductory supporting profiles and 41 reference-source rows. `reviews/screen-04-editions.json` adds three editions, twenty events (19 released, one superseded) and one edition-specific voice credit. Together they add 272 citations. All new source records have evidence subjects; no live fetch is part of the rebuild.

Current totals: 328 records, 2,398 facts, 1,345 directed links, 215 checked fact fields, 370 ordinary credits, ten edition credits and 1,025 citations. There are 26 editions and 66 events (62 released, four superseded); 36 events lack an edition assignment, including first series launches as well as later releases whose master identity is unestablished. The timeline represents 24 works plus 45 additional released events (films 13 + 34, series 11 + 11). Nineteen productions have scoped reviews: all thirteen films and six series. Five series remain. Historical sections above describe earlier stages.

The existing internal `film_editions` table now accepts film or series owners, as do release events. General series credits are not inherited by pilot editions. Rebels has separate original and ABC expanded pilot records; its earlier WATCH release supersedes the initial September 29 announcement. The 2003 micro-series’ two-volume streaming grouping is distinct from its 25 chapters and three original TV seasons. Mandalorian cast/crew roles retain reviewed season/episode boundaries; the conflicting current versus contemporary creator wording is explicitly pending.

All new references are Reference only, not open licences. No source prose, media, opening transcript or physical-media/purchase-date event was imported. Original snapshots remain unchanged. Complete episode/end-credit and territory/master coverage remain outside this batch. See `docs/reviews/SCREEN-04.md`.


## Remaining five-series review — batch 05

`reviews/pilot-05.json` reviews Obi-Wan Kenobi, Ahsoka, Skeleton Crew, The Acolyte and Maul – Shadow Lord: 61 checked fields, 159 selected ordinary cast/crew credits, 57 checked outgoing links, 38 introductory profiles and 54 source rows (52 official franchise/Disney references, the WGA public credit registry and one contemporary public news report). `reviews/screen-05-editions.json` adds sixteen events, thirteen released and three superseded; no new edition is inferred from a cinema episode screening. Together they add 346 citations. Every new source has a cited subject.

Current totals: 366 records, 2,449 facts, 1,400 directed links, 276 checked fields, 529 ordinary credits, ten edition credits and 1,371 citations. Twenty-four works have first scoped reviews: all thirteen films and eleven series in this selection. There are 26 editions and 82 release events (75 released, seven superseded); 52 events have no edition assignment. The timeline shows 24 works + 53 additional released events, Films 13 + 34 and Series 11 + 19. Its primary-launch exclusion retains distinct same-day theatrical screenings. Earlier paragraphs describe historical batches.

Obi-Wan’s May 26 Pacific / May 27 Eastern launch is one instant. Earlier Ahsoka and Skeleton Crew plans are superseded. WGA final writing-credit dates and staff-season labels are not release evidence; only The Acolyte’s season-1 final episode writing credits were selected. Ahsoka’s announced 2027 season and Maul’s second-season development remain facts about future plans, not released events. Contributor aliases Athena Portillo / Athena Yvette Portillo and Matt / Matthew Michnovetz do not create duplicate new people.

The review is incomplete at episode/end-credit, worldwide/Finland release and shot-level master scale; selected writing assignments remain pending for Obi-Wan and Skeleton Crew. All new sources are Reference only, not open licences. No source prose, transcript, poster, image, video, physical-media or purchase-release dates imported. Rebuild and visits remain offline. See `docs/reviews/SCREEN-05.md`.


Supplement 07 (`reviews/supplement-07.json`) adds selected-profile episode reviews, six supporting records and scoped music metadata. Numbered supplements are applied in order. `episode_reviews` stores considered profiles, limits, date and evidence; `episode_links.representation` separates direct scenes, flashbacks, transmissions and Force spirits. An unlinked profile is unestablished, not absent. Soundtrack credits are explicitly album-scoped and do not populate final episode writing/music credits. Current totals and evidence are documented in `../docs/reviews/SUPPLEMENT-07.md`.


Supplement 08 (`reviews/supplement-08.json`) adds eight Mandalorian season-one selected-profile reviews and 61 episode links, 16 supporting records and facts, and six links from existing cast credits to character records. Optional `creditUpdates.characterRecordId` references a validated people record without duplicating the original credit. Current totals and limits are in `../docs/reviews/SUPPLEMENT-08.md`; no new releases or editions are created.


## Catalogue and reproducible scope plan — Phase 1

`catalogue/production-inventory.json` is a separate coverage inventory, not an automatic work import: 76 entries, including components, a collection, supplemental programmes and an announced film. It reconciles all 24 current work IDs, dates and formats and identifies 14 missing core works. Dates distinguish exact days, months, years and unknown values. Public references do not grant redistribution rights.

`reviews/review-plan-01.json` applies after the reviewed overlays via `scripts/apply-review-plan.mjs`. It changes research scope/issue status/limitations, without changing facts, credits, editions, release events or prior record checked dates. Generated `reviews/review-plan-01-change-log.json` preserves before/after details. Pending episode/film credits and appearances remain active; extended release/master tasks are deferred. `scripts/check-production-inventory.mjs` validates identities, evidence, current-work reconciliation, date precision and the resulting scope decisions as part of `data:check`. See `../docs/catalogue/TEOSLUETTELO-01.md`.


Supplement 10 (`reviews/supplement-10.json`) adds eight Mandalorian season-three selected-profile reviews and 69 episode links, 18 supporting profiles/facts, 39 directed work links and five episode-scoped performance credits. New credits may carry `characterName` and `characterRecordId`; the latter must resolve to a people record. This is separate from per-episode final writing credits. The existing original-US PLAN-01 overlay declares `afterSupplementId: SUPPLEMENT-09`; the builder applies it there, before subsequent factual supplements, so historical limits do not overwrite newer evidence. Later scoped limitations must retain the original-US policy. Earlier review inputs and all old content rows are preserved. See `../docs/reviews/SUPPLEMENT-10.md`.


## Existing legacy profile reviews

`reviews/profile-01.json` is an additive first-review batch for five original identities. `scripts/apply-profile-reviews.mjs` runs after earlier factual supplements; it requires full inherited-field coverage and retains numeric IDs, titles/slugs and original origin flags. Verified values get assertion citations; unresolved fields get `fact_assessment` citations and a separate `fact_assessments` row. Their raw values/source IDs remain in `facts` with status `unestablished`, and before/after logs plus original snapshots retain changes.

`published_facts` is the public read view: unestablished values are replaced with Not established; collection conversion omits those fields. Do not expose raw audit values as current published metadata. `record_metadata` citations carry profile-context scope. `scripts/check-profile-reviews.mjs` checks coverage, source chains, raw-value preservation and semantic boundaries. Reviewing existing records increases scoped-supporting-review counts but does not increase editorial-origin/new-record counts. See `../docs/reviews/PROFILE-01.md`.


## Rebels first five guide entries — supplement 11

`reviews/supplement-11.json` adds five reviews for six numbered parts, 79 episode links and 22 introductory profiles with one selected fact each. The shared cohort contains 46 profile IDs. Expanded official narrative gallery captions supply numbered locators; no gallery media or full captions are imported. Spark of Rebellion remains a combined entry: the ABC-added opening is excluded from original-pilot links, using the existing contemporary announcement as version evidence. Luminara’s projected bait/remains, Obi-Wan’s message, Trayvis’s broadcast, aliases and later physical scenes retain separate context. Original Phantom and the individual stolen TIE remain distinct from replacements/types. No new dates, editions or credits. PLAN-01’s original-US policy remains. Earlier content survives; generated citation numeric IDs can shift because PROFILE-01 runs after supplements, so preservation compares citation contents and multiplicity. See `../docs/reviews/SUPPLEMENT-11.md`, its QA and preservation reports.


## Existing legacy profile reviews — batch 02

`reviews/profile-02.json` adds first reviews for five existing people identities (10/64/2/3/68), using the existing profile-review loader and published-field masking. All 35 inherited fields have outcomes; 29 raw values/source IDs are retained but withheld. Eleven new facts include droid type and era-scoped casing, Jedi roles, Ben alias and Senate/adoption context. Four new official URLs, reused Luminara/continuity sources, 55 selected verified relationships and 126 citations. Old numeric IDs/titles/slugs/origin flags survive, including the explicitly unestablished middle name in Bail’s inherited title. No episode list or release expansion. Current scope/results are in `../docs/reviews/PROFILE-02.md`; preservation and browser QA reports accompany it.


## Rebels guide entries 7–11 — supplement 12

`reviews/supplement-12.json` adds five selected-profile reviews, 68 episode links and 13 short supporting profiles with one fact each. The 63-profile cohort is explicit. `episode_links.representation` now also supports `vision` and `force_communication`: Ezra’s nightmare is not a flashback or actual crew death, and Yoda’s remote guidance is not a recording, physical visit or dead spirit. Mixed direct/vision contexts retain one direct row with notes. The released captions/trivia identify the selected scenes; cut material, musical themes, related biographies and props do not create appearances.

`apply-supplements.mjs` now associates each work-link citation source with both dossier source indexes, including historical supplements. This repairs reverse evidence links without inventing assertions, revising target facts or marking a target profile reviewed. Existing citations retain contents; generated numeric IDs can shift because profile batches run later. Semantic checks cover both-end source availability. No date, edition, credit or episode-inventory changes. Results, source boundaries, QA and preservation: `../docs/reviews/SUPPLEMENT-12.md`.


## Existing legacy profile reviews — batch 03

`reviews/profile-03.json` reviews existing people IDs 25/20/21/14/13: 35 inherited fields assessed (5 verified/corrected, 30 unestablished), eleven new facts and 53 selected work/context relationships. Seven new sources and 127 citations. Both conflicting Palpatine heights are documented without selecting one; Yoda’s teaching duration, unknown species, residence and later spirit context remain scoped. Han’s later vision is evidenced separately; Chewbacca has explicit individual homeworld evidence. The reused Lando source gets an audited scope-note update through `sourceUpdates` (expected old note required; no identity, URL, checked date or rights change). All raw withheld values/source IDs survive. No releases, editions, episode rows or credits changed. Results and preservation/browser reports: `../docs/reviews/PROFILE-03.md`.


## Rebels season-one final four guide entries — supplement 13

`reviews/supplement-13.json` adds four selected-profile reviews against 81 considered IDs, 70 episode links (66 direct / 4 transmission), ten short supporting profiles with one fact each, sixteen sources and 150 citations. All 14 season-one guide entries / 15 parts are now scoped-reviewed, with 217 links. The series’ prior verified work links are preserved; 22 new directed work links are additive. Trayvis’s vision/broadcast/direct contexts use one direct row with explanation. Fulcrum’s call is identified through the explicit finale reveal; Bail is a hologram, Ahsoka physically present, and Vader’s unnamed ending has a paired named Kallus-biography locator. No alias duplication or future Kallus-Fulcrum backfill.

Types and hulls remain separate: data-search light cruiser, Sovereign, Broken Horn, original stolen TIE, Inquisitor fighter and editorially labelled rescue transport. Mustafar is a destination in Rebel Resolve and a system setting in the finale. The reused generic light-cruiser source’s title/note were clarified without changing its ID/URL/check date/rights. No release, edition, credit or episode-inventory changes. Results, preservation and browser QA: `../docs/reviews/SUPPLEMENT-13.md`.


## Existing legacy profile reviews — batch 04

`reviews/profile-04.json` reviews existing people IDs 1/5/11/4/12: 35 inherited fields assessed (5 verified/corrected heights, 30 unestablished), seventeen new facts and 69 selected connections (22 inherited + 47 new). Six new official sources and 150 citations. Luke/Leia have explicit visible birthplace fields and separate birth/upbringing relations; Tarkin has explicit Eriadu birth evidence. Anakin/Vader retain both IDs and the original identity/reference row, with sourced Known as facts and nominal 188/203 cm stage boundaries. No actor, image colour, scene age or exact birth-year inference. Crait projection, temple vision, later ephemeral scene and Return of the Jedi edition context have scoped evidence.

The existing Vader source’s note is extended with expected-old-text protection; source ID/URL/title/historical checked date/rights remain. No new identities, episodes, dates, editions or credits. All withheld raw values/source IDs survive; public masking and catalogue omission remain. Results, preservation and final responsive checks: `../docs/reviews/PROFILE-04.md`.


## Rebels season-two first five guides — supplement 14

`reviews/supplement-14.json` adds five selected-profile reviews covering six numbered parts, each with 100 considered IDs. Eighty episode links (77 direct / 3 transmission), fifteen short supporting profiles and facts, 22 sources, 193 citations and 34 additive work links. The combined Siege guide is not split without part-specific evidence. Lando’s hologram, the Emperor’s contact and Sato’s briefing are transmissions; physical/remote mixed contexts keep one direct row with notes. The modified AT-TE is separate from the legacy family profile; the AT-AT episode variant does not verify inherited dimensions. Shared station design, draft characters, aliases, decorative graphics and mentioned worlds do not become episode assertions. A Ghost/Phantom caption inconsistency is explicitly scoped. No source-row, release, edition, credit or episode-inventory changes. All prior citation contents/multiplicities retained, even where generated numeric IDs move. Results, preservation and 44-state browser QA: `../docs/reviews/SUPPLEMENT-14.md`.


## Legacy profile batch 05

`reviews/profile-05.json` reviews five existing numeric identities: Padmé (35), Qui-Gon (32), Mace (51), Dooku (67) and Maul (44). Thirty-five inherited fields receive explicit outcomes: five official nominal heights, thirty unestablished values with original raw value/source ID retained. Fourteen new facts; 45 selected work/context connections (17 inherited rows verified, 28 added), nine new official sources and 119 citations. No source updates or new identities. Padmé’s home planet has a selected official story-gallery locator; Dooku’s homeworld and Flitknot alias have separate sources. Maul’s current height is not assigned to a specific prosthetic configuration. The Human link for Dooku, unknown/Haruun Kal homeworlds, selected old craft aliases and additional voice-cameo claims remain pending. Named film evidence is separate from the television series; existing public studio press-note mirror attribution is retained where used. Raw snapshots and before/after logs preserve replaced heights and withheld values. Prior source/citation rows, episode/date/edition/credit contents unchanged. Reports and 34-state browser QA: `../docs/reviews/PROFILE-05.md`.


## Rebels season-two guides 7–11 — supplement 15

`reviews/supplement-15.json` adds five scoped reviews against 124 considered IDs, 80 episode connections (76 direct / one transmission / two visions / one unspecified form), 22 supporting profiles with one fact each, 29 sources, 212 citations and 44 additive work links. All earlier verified assertions remain intact. Scope distinguishes the B6 prototype from production B-wings, stolen GX1 from older shuttle identities, Titus’s experimental Interdictor from Legends designs, and Liberator from Phoenix Home. Parents’ dreams/visions are not physical reunions; Ryder and the loth-cat have explained mixed contexts. Blood Sisters names Bail without settling physical versus holographic form; the limitation remains visible. No guessed probe/fighter types, design-reference cameos or destination visits. No existing source updates or episode/date/edition/credit changes. All previous citation contents/multiplicities retained despite generated ID shifts. A slash-separated scope phrase was reworded for 320 px wrapping, then the database/build and final 59-state browser checks rerun. Results and audit: `../docs/reviews/SUPPLEMENT-15.md`.


## PROFILE-06 — five existing worlds, 29 October 2026

[Profile batch 06](../docs/reviews/PROFILE-06.md) reviews Alderaan, Hoth, Dagobah, Bespin and Endor: forty inherited fields assessed, seven qualitative values verified/updated, 33 unestablished with raw values retained, eleven new facts and nineteen checked connections (ten inherited + nine new). Eight official sources and 97 citations. Planet, forest moon, atmospheric settlement and Kef Bir remain distinct; Dagobah’s Sith arrival is explicitly deleted material, leaving its inherited film link pending. City work does not silently verify residence, and exact world measurements remain withheld.

All 3,984 previous citations including numeric IDs, source rows, episodes, editions, dates and credits survive. Full data/provenance/semantic checks, lint, typecheck, 783-address build and 32 final browser states passed. No observed overflow, missing anchors or warning/error logs. Reports include PROFILE-06 preservation and QA JSON. Current totals: 509 records, 2,673 facts (541 verified / 182 unestablished / 1,950 legacy), 1,854 work/context links (837 verified / 1,014 legacy / 3 reference), 617 sources and 4,081 citations. There are 30 reviewed legacy supporting profiles and 224 awaiting first review. Episode totals remain 62 reviews / 707 links. Master TODO updated and mirrored to workspace; next: Rebels season-two guides 12–16, A Princess on Lothal through Homecoming. No UI/dependency changes, commit, push or deployment.


## Rebels season-two guides 12–16 — 29 October 2026

[Supplement 16](../docs/reviews/SUPPLEMENT-16.md) reviews A Princess on Lothal through Homecoming against 148 selected profiles: 66 checked episode connections (65 direct / one transmission), including 64 additive rows and two earlier Zeb/Ghost rows rechecked as direct with original row IDs. Eighteen introductory profiles/facts, one existing Nixus source-scope fact, 29 official sources, 203 added citations and forty additive work/context links. Read 125 narrative and 25 trivia captions, nineteen selected Databank profiles, six selected images and the earlier conflicting Nixus caption. Lyste’s promotion retains one identity; the moon camp, Fang, guild TIEs and captured Quasar stay distinct. Sato is a Homecoming hologram; Nixus station/world and Homecoming light-cruiser/Star-Destroyer source discrepancies remain explicit. No copyrighted prose/media imported.

All 4,081 prior reference contents and multiplicities retained; two named rechecked episode references refresh their check dates, and generated numeric citation IDs may move. All old records, facts, work links, source rows, episodes, releases, editions and credits survive, apart from the two named episode representation updates and Rebels/Nixus review limitations. Final full checks, 801-address build and 51 completed browser states passed without observed overflow, broken source anchors or warning/error logs. A timed-out combined UI check was rerun in smaller batches and is excluded from the completed count. Current totals: 527 records, 2,692 facts (560 verified / 182 unestablished / 1,950 legacy), 1,894 work links (877 verified / 1,014 legacy / 3 reference), 771 episode links, 67 reviews, 646 sources and 4,284 citations. Supporting profiles: 249 new introductory identities plus thirty reviewed legacy dossiers; 224 old profiles await first review. Reports include preservation and QA JSON; master TODO updated/mirrored. Next PROFILE-07: Millennium Falcon, Star Destroyer, Death Star, Imperial shuttle and Executor. No UI/dependency changes, commit, push or deployment.


## PROFILE-07 — five existing vessel/station dossiers, 30 October 2026

[Profile batch 07](../docs/reviews/PROFILE-07.md) reviews Millennium Falcon, the Imperial Star Destroyer family, first Death Star, Lambda shuttle and Executor. Sixty inherited fields assessed: fourteen verified/updated, 46 unestablished with original values and source IDs retained. Fifteen new scoped facts, 39 checked connections (14 inherited + 25 new), nine official sources and 141 citations. Falcon 34.75 m and Executor 19000 m are sourced nominal dimensions; DS-1’s 160 km equatorial diameter is separate from the unestablished inherited length. Mission-dependent station staffing includes garrisons, and class 4 hyperdrive is explicitly sourced. Lambda/Sentinel, family/subtype, named hull and later station identities remain distinct; Empire’s shuttle edition boundary and inherited pilot rows stay pending. The CEC manufacturer statement is transparently attributed to an official lifestyle-feature introduction.

All 4,284 previous citations including numeric IDs, source rows, episode reviews/links, dates, editions and credits retained. Full build/provenance/semantic checks, lint, typecheck, 801-address production build and 32 browser states passed without observed overflow, missing anchors or warning/error logs. Current totals: 527 records, 2,707 facts (589 verified / 228 unestablished / 1,890 legacy), 1,919 work/context links (916 verified / 1,000 legacy / 3 reference), 655 sources and 4,425 citations. There are 35 reviewed legacy supporting profiles and 219 awaiting first review. Episode totals remain 67 reviews / 771 links. Master TODO updated and mirrored; next: final five Rebels season-two guides, The Honorable Ones through Twilight of the Apprentice, covering six numbered parts. No UI/dependency changes, commit, push or deployment.


## Rebels season-two final guides — 30 October 2026

[Supplement 17](../docs/reviews/SUPPLEMENT-17.md) reviews The Honorable Ones through Twilight of the Apprentice: five guides / six numbered parts, 165 selected profiles, 71 additive episode connections (67 direct, one transmission, one vision, one remote Force contact, one unspecified). Sixteen introductory profiles/facts, 26 official sources, 194 added citations and 35 additive work/context links. Read all 168 narrative and 35 trivia captions with completed pagination, sixteen profile Databank pages plus Yoda/Grand Inquisitor history, and seven selected released-scene images. Bahryn is a moon; the orbital module, Lothal/Coruscant temples and Malachor world/site stay distinct. Yoda is alive and remote, Anakin has a recording plus vision, Vader also arrives physically, the Grand Inquisitor is a conservatively classified temple apparition, and Ketsu’s named participation has unspecified form. Dicer has a living scene before the helmet discovery. The finale retains its own Ahsoka closing image without importing a later rescue or splitting parts 21–22. No copyrighted prose or media imported.

All 4,425 previous reference contents, dates and multiplicities and all old records/facts/links/source metadata/credits/editions/releases/episode inventory retained. Only Rebels’ current review limitations/check date updated. Initial build-order reference failure corrected by citing the existing direct temple source; final full checks, 817-route build, preservation audit and 44 completed browser states passed. A timed-out pane-opening call was recovered and separately measured; an initially mistyped test URL was corrected and excluded. No final observed overflow, missing source anchors, 404s or warning/error logs. Current totals: 543 records, 2,723 facts (605 verified / 228 unestablished / 1,890 legacy), 1,954 work links (951 verified / 1,000 legacy / 3 reference), 842 episode links, 72 reviews, 681 sources and 4,619 citations. Supporting profiles: 265 new introductory identities plus 35 reviewed legacy dossiers; 219 legacy dossiers await first review. Rebels season two now has selected reviews for all twenty guides / 22 parts, 297 connections; 32 Rebels guides / 38 parts and 47 Bad Batch episodes remain. Next PROFILE-08: Y-wing, A-wing, TIE Advanced x1, Slave 1 and Naboo Royal Starship. Reports include QA/preservation JSON; master TODO updated/mirrored. No UI/dependency changes, commit, push or deployment.


## PROFILE-08 — five existing vessel dossiers, 30 October 2026

[Profile batch 08](../docs/reviews/PROFILE-08.md) reviews Y-wing, A-wing, Vader’s TIE Advanced, the Fett Firespray and Naboo Royal Starship. Sixty inherited fields assessed: eleven verified/updated, 49 unestablished with original raw values and source IDs retained. Twenty new scoped facts, 35 checked connections (11 inherited / 24 additive), eight official sources and 145 citations. Current source-profile nominal lengths are Y-wing 23.4 m, A-wing 6.9 m, Vader’s fighter 5.8 m and Royal Starship 76 m; not universal cross-variant dimensions. BTL/BTA, fighter/trainer/Resistance configurations, Vader/Inquisitor prototypes and named-vessel identity remain explicit. The historic Slave I and current Boba Fett’s starship heading refer to the same retained record; its old 21.5 m remains unestablished. KSE is not silently expanded into a manufacturer, and T-14 is a replacement component, not hyperdrive class. Vader’s x1 label is transparently supported only as a model name by an official lifestyle-feature introduction. All twelve Y-wing history captions and selected Fett history/captions 1–12 read; last three Fett gallery captions not claimed as reviewed. No copyrighted prose/media or recipe imported.

All 4,619 previous citations including numeric IDs, source metadata, earlier profile/episode reviews, dates, editions and credits retained. Only named five-profile metadata/facts/links change. Final full checks, 817-route build and 32 completed browser states passed without observed overflow, broken source anchors, 404s or warning/error logs. Three hyperdrive assessment statements refined before the final build/audit to avoid claiming unsupported equipment. Current totals: 543 records, 2,743 facts (636 verified / 277 unestablished / 1,830 legacy), 1,978 work/context links (986 verified / 989 legacy / 3 reference), 689 sources and 4,764 citations. Forty legacy supporting profiles reviewed; 214 await first review, including 25 ships / 300 inherited fields. Remaining legacy placeholders: 383. Episode totals unchanged: 72 reviews / 842 links; pending 32 Rebels guides / 38 parts and 47 Bad Batch episodes. Next: Rebels season three’s first five guides, Steps Into Shadow through The Last Battle, six numbered parts. Master TODO updated/mirrored; preservation and QA JSON included. No UI/dependency changes, commit, push or deployment.


## Rebels season-three opening guides — 30 October 2026

[Supplement 18](../docs/reviews/SUPPLEMENT-18.md) reviews Steps Into Shadow through The Last Battle: five guides / six numbered parts, 195 selected profiles, 82 additive episode links (79 direct / one transmission / two unspecified), 24 introductory profiles and facts, 33 official sources, 274 citations and 52 additive work/context links. All 59 narrative and 38 trivia captions read with pagination complete, 23 Databank main/history selections and seventeen released images checked. Thrawn’s hologram and physical encounter, original/replacement Phantom, RZ-1T versus fighter, Kalani versus type, actual flights versus simulation and Hobbie’s conflicting Biggs/Wedge source history remain explicit. Nightbrother’s episode hull and Goran/Hera’s precise appearance forms remain pending. No copyrighted source prose/media imported, and no dates/editions/credits/episode inventory expanded.

All 4,764 previous reference contents and multiplicities, source metadata, existing records/facts/links/assessments/episode reviews/releases/editions/credits retained; only Rebels’ current review limitations/check date updated. Initial semantic check required the salvaged-Y-wing hyperdrive boundary in the visible link note, now fixed. Final full checks, 841-route production build, preservation audit and 59 browser states passed without observed overflow, missing source anchors, 404s or warning/error logs. Duplicate scope prose in expanded supporting-profile review panels logged for later readability correction. Current totals: 567 records, 2,767 facts (660 verified / 277 unestablished / 1,830 legacy), 2,030 work/context links (1,038 verified / 989 legacy / three reference), 722 sources / 5,038 citations, 924 episode links / 77 reviews. Supporting profiles: 289 new introductory + forty reviewed legacy; 214 legacy dossiers await first own review. Rebels 39/66 guides reviewed, season connection counts 217/297/82/2; pending 27 guides / 32 parts plus 47 Bad Batch episodes (74 units). Master TODO updated/mirrored. Next PROFILE-09: Biggs, Wedge, Porkins, Ackbar, Nien Nunb, then Rebels season-three parts 7–11. No UI/dependency changes, commit, push or deployment.
