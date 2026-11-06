import { createLibrary, decodeLibrary, type DeskLibrary } from "./research-model";
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("galactic-memory-research", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("boards");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function readLibrary(knownRecords: Set<string>): Promise<DeskLibrary> {
  const db = await openDB();
  try {
    const values = await new Promise<unknown[]>((resolve, reject) => {
      const tx = db.transaction("boards"), store = tx.objectStore("boards");
      const current = store.get("workspace"), previous = store.get("desk");
      tx.oncomplete = () => resolve([current.result, previous.result]);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    const value = values[0] ?? values[1];
    return value === undefined ? createLibrary() : decodeLibrary(value, knownRecords);
  } finally { db.close(); }
}
// Keep rapid edits and board switches in order. The original v1 key is retained.
let queue: Promise<void> = Promise.resolve();
export function writeLibrary(library: DeskLibrary): Promise<void> {
  const snapshot = structuredClone(library);
  snapshot.boards = snapshot.boards.map(b => ({ ...b, name: b.name.trim() || "Untitled desk", views: b.views.map(v => ({ ...v, name: v.name.trim() || "Untitled view" })), groups: b.groups.map(g => ({ ...g, name: g.name.trim() || "Untitled group" })), links: b.links.map(l => ({ ...l, label: l.label.trim() || "Personal interpretation" })) }));
  queue = queue.catch(() => {}).then(async () => {
    const db = await openDB();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("boards", "readwrite");
        tx.objectStore("boards").put(snapshot, "workspace");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally { db.close(); }
  });
  return queue;
}
