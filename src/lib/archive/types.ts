export const categoryKeys = ["films", "series", "people", "planets", "starships", "vehicles", "species"] as const;
export type Category = typeof categoryKeys[number];
export type ArchiveRecord = { id: string; category: Category; legacyId: string | null; slug: string; title: string; summary: string; year: number | null; era: string; continuity: string; reviewStatus: "legacy" | "editorial"; reviewedAt: string | null; facts: Record<string, string>; connectionCount: number };
export type ArchiveSource = { id: string; title: string; url: string; kind: "legacy" | "official" | "reference" | "open"; checkedAt: string; note: string; license: string; reuseBasis: string; attribution: string; revision: string };
export type Evidence = { sourceId: string; locator: string; note: string; checkedAt: string };
export type RecordFact = { key: string; value: string; sourceId: string; reviewStatus: string; assessmentNote: string; evidence: Evidence[] };
export type RelatedRecord = { id: string; category: Category; slug: string; title: string; relation: string; reviewStatus: string; evidence: Evidence[] };
export type ArchiveCredit = { id: string; person: string; role: string; characterName: string; characterRecordId: string | null; characterSlug: string | null; scope: string; note: string; editionId: string | null; editionLabel: string | null; evidence: Evidence[] };
export type RecordReview = { checkedAt: string; scope: string; limitations: string[]; batchId: string; isPrimary: boolean; issues: { field: string; status: string; note: string }[] };
export type Citation = Evidence & { subjectType: string; subjectKey: string };
export type ArchiveStats = { total: number; legacy: number; editorial: number; connections: number; counts: Record<Category, number>; importedAt: string; reviewedProductions: number };
export const recordHref = (record: Pick<ArchiveRecord, "category" | "slug">) => `/${record.category}/${record.slug}`;
export const sourceKindLabel = (kind: ArchiveSource["kind"]) => ({ legacy: "ORIGINAL COLLECTION / REVIEW PENDING", official: "OFFICIAL PUBLIC REFERENCE", reference: "PUBLIC REFERENCE", open: "OPEN STRUCTURED DATA" })[kind];

export type FilmRelease = { id: string; date: string; dateEnd: string | null; territory: string; medium: "Theatrical" | "Television" | "Streaming"; eventType: string; status: "released" | "superseded"; label: string; note: string; evidence: Evidence[] };
export type FilmEdition = { id: string; label: string; year: number; kind: "original" | "revision"; summary: string; scopeNote: string; evidence: Evidence[]; releases: FilmRelease[]; credits: ArchiveCredit[] };
export type EditionTimelineEvent = { category: "films" | "series"; id: string; editionId: string | null; label: string; slug: string; title: string; date: string; dateEnd: string | null; year: number; territory: string; medium: FilmRelease["medium"] };
export const editionAnchor = (id: string) => `edition-${id.replaceAll(":", "-")}`;
export function formatReleaseDate(date: string, dateEnd: string | null = null): string {
  const format = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
  return dateEnd ? `${format(date)} – ${format(dateEnd)}` : format(date);
}

export type EpisodeCredit = { id: string; person: string; role: string; creditLine: string; evidence: Evidence[] };
export type EpisodeConnection = { id: string; category: Category; slug: string; title: string; relation: "appearance" | "setting" | "featured_ship"; note: string; representation: "unspecified" | "direct" | "flashback" | "transmission" | "force_spirit" | "vision" | "force_communication"; evidence: Evidence[] };
export type EpisodeConnectionReview = { checkedAt: string; scope: string; notes: string[]; evidence: Evidence[] };
export type ArchiveEpisode = { id: string; season: number; start: number; end: number; title: string; sourceLabel: string; note: string; evidence: Evidence[]; credits: EpisodeCredit[]; links: EpisodeConnection[]; connectionReview: EpisodeConnectionReview | null };
