/** Personal workspace state. Never written into the archive database. */
export type DeskCard = { id: string; recordId?: string; note?: string; x: number; y: number };
export type DeskGroup = { id: string; name: string; cardIds: string[] };
export type PersonalLink = { id: string; from: string; to: string; label: string };
export type SavedDeskView = { id: string; name: string; view: { x: number; y: number; zoom: number }; mode: "spatial" | "list" };
export type DeskBoard = {
  id: string; name: string; cards: DeskCard[];
  view: { x: number; y: number; zoom: number };
  groups: DeskGroup[]; links: PersonalLink[]; views: SavedDeskView[];
};
export type DeskLibrary = { version: 2; activeBoardId: string; boards: DeskBoard[] };
export function createBoard(id: string, name = "Untitled desk"): DeskBoard {
  return { id, name, cards: [], view: { x: 70, y: 70, zoom: 1 }, groups: [], links: [], views: [] };
}
export function createLibrary(): DeskLibrary {
  const board = createBoard("first-desk", "My first research");
  return { version: 2, activeBoardId: board.id, boards: [board] };
}
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function text(value: unknown, max = 200): value is string { return typeof value === "string" && value.length <= max; }
function id(value: unknown): value is string { return text(value) && value.length > 0; }
function unique(values: string[]) { return new Set(values).size === values.length; }
function number(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= 1e7; }
function decodeBoard(value: unknown, knownRecords: Set<string>, legacy = false): DeskBoard {
  if (!object(value) || !Array.isArray(value.cards) || value.cards.length > 500 || !object(value.view)) throw Error("Invalid board");
  if (![value.view.x, value.view.y, value.view.zoom].every(number) || Number(value.view.zoom) < .1 || Number(value.view.zoom) > 1.8) throw Error("Invalid view");
  const cards: DeskCard[] = value.cards.map(c => {
    if (!object(c) || !id(c.id) || !number(c.x) || !number(c.y)) throw Error("Invalid card");
    if (c.recordId !== undefined) {
      if (!id(c.recordId) || !knownRecords.has(c.recordId)) throw Error("Unknown archive record");
      return { id: c.id, recordId: c.recordId, x: c.x, y: c.y };
    }
    if (!text(c.note, 100000)) throw Error("Invalid note");
    return { id: c.id, note: c.note, x: c.x, y: c.y };
  });
  if (!unique(cards.map(c => c.id)) || !unique(cards.flatMap(c => c.recordId ? [c.recordId] : []))) throw Error("Duplicate card");
  const cardIds = new Set(cards.map(c => c.id)), grouped = new Set<string>();
  const rawGroups = legacy ? [] : value.groups, rawLinks = legacy ? [] : value.links;
  if (!Array.isArray(rawGroups) || rawGroups.length > 500 || !Array.isArray(rawLinks) || rawLinks.length > 2000) throw Error("Invalid annotations");
  const groups: DeskGroup[] = rawGroups.map(g => {
    if (!object(g) || !id(g.id) || !text(g.name, 80) || !Array.isArray(g.cardIds) || !g.cardIds.length || g.cardIds.some(c => !id(c) || !cardIds.has(c) || grouped.has(c)) || !unique(g.cardIds as string[])) throw Error("Invalid group");
    const ids = g.cardIds as string[]; ids.forEach(c => grouped.add(c));
    return { id: g.id, name: g.name.trim() || "Untitled group", cardIds: ids };
  });
  const links: PersonalLink[] = rawLinks.map(l => {
    if (!object(l) || !id(l.id) || !id(l.from) || !id(l.to) || l.from === l.to || !cardIds.has(l.from) || !cardIds.has(l.to) || !text(l.label, 160) || !l.label.trim()) throw Error("Invalid personal connection");
    return { id: l.id, from: l.from, to: l.to, label: l.label };
  });
  if (!unique(groups.map(g => g.id)) || !unique(links.map(l => l.id))) throw Error("Duplicate annotation");
  const rawViews = legacy ? [] : value.views ?? [];
  if (!Array.isArray(rawViews) || rawViews.length > 50) throw Error("Invalid saved views");
  const views: SavedDeskView[] = rawViews.map(v => {
    if (!object(v) || !id(v.id) || !text(v.name, 80) || !object(v.view) || ![v.view.x, v.view.y, v.view.zoom].every(number) || Number(v.view.zoom) < .1 || Number(v.view.zoom) > 1.8 || (v.mode !== "spatial" && v.mode !== "list")) throw Error("Invalid saved view");
    return { id: v.id, name: v.name.trim() || "Untitled view", view: { x: Number(v.view.x), y: Number(v.view.y), zoom: Number(v.view.zoom) }, mode: v.mode };
  });
  if (!unique(views.map(v => v.id))) throw Error("Duplicate saved view");
  if (!legacy && (!id(value.id) || !text(value.name, 80))) throw Error("Invalid board name");
  return { id: legacy ? "first-desk" : value.id as string, name: legacy ? "My first research" : (value.name as string).trim() || "Untitled desk", cards, view: value.view as DeskBoard["view"], groups, links, views };
}
export function decodeLibrary(value: unknown, knownRecords: Set<string>): DeskLibrary {
  if (!object(value)) throw Error("Invalid backup");
  if (value.version === 1) {
    const board = decodeBoard(value, knownRecords, true);
    return { version: 2, activeBoardId: board.id, boards: [board] };
  }
  if (value.version !== 2 || !Array.isArray(value.boards) || !value.boards.length || value.boards.length > 100) throw Error("Invalid collection");
  const boards = value.boards.map(b => decodeBoard(b, knownRecords));
  if (!unique(boards.map(b => b.id)) || !boards.some(b => b.id === value.activeBoardId)) throw Error("Invalid active desk");
  return { version: 2, activeBoardId: value.activeBoardId as string, boards };
}
export function removeCard(board: DeskBoard, cardId: string): DeskBoard {
  return { ...board, cards: board.cards.filter(c => c.id !== cardId), groups: board.groups.map(g => ({ ...g, cardIds: g.cardIds.filter(id => id !== cardId) })).filter(g => g.cardIds.length), links: board.links.filter(l => l.from !== cardId && l.to !== cardId) };
}
export function groupCards(board: DeskBoard, cardIds: string[], id: string, name: string): DeskBoard {
  const selected = new Set(cardIds.filter(id => board.cards.some(c => c.id === id)));
  if (selected.size < 2 || !name.trim()) return board;
  return { ...board, groups: [...board.groups.map(g => ({ ...g, cardIds: g.cardIds.filter(id => !selected.has(id)) })).filter(g => g.cardIds.length), { id, name: name.trim().slice(0, 80), cardIds: [...selected] }] };
}
