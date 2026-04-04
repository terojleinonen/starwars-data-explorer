"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/SpeciesDashboard.module.css";

type Species = {
  name: string;
  classification: string;
  designation: string;
  average_lifespan: string;
  language: string;
  url: string;
};

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

export default function SpeciesDashboard() {
  const router = useRouter();
  const { data } = useSwapi("species");
  const records = (data?.results ?? []) as Species[];

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("species", "/species");
  }, []);

  const filtered = useMemo(() => {
    return records.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  useEffect(() => {
    if (!filtered.length) return;
    if (!selectedId) setSelectedId(extractId(filtered[0].url));
  }, [filtered, selectedId]);

  const selected = filtered.find(r => extractId(r.url) === selectedId);

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          <HoloHeader
            category="species"
            title="Species Intelligence"
            subtitle="Biological classification and cultural analysis"
          />

          {/* SEARCH ONLY */}
          <section className={styles.controls}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search species..."
              className={styles.searchInput}
            />
          </section>

          <section className={styles.dashboardShell}>
            <div className={styles.tablePanel}>
              <div className={styles.tableHead}>
                <span>Name</span>
                <span>Classification</span>
                <span>Lifespan</span>
                <span>Language</span>
              </div>

              <div className={styles.tableBody}>
                {filtered.map(r => {
                  const id = extractId(r.url);

                  return (
                    <button
                      key={id}
                      className={`${styles.rowButton} ${selectedId === id ? styles.rowButtonActive : ""}`}
                      onClick={() => setSelectedId(id)}
                      onDoubleClick={() => router.push(`/species/${id}`)}
                    >
                      <span className={styles.primaryCell}>{r.name}</span>
                      <span>{r.classification}</span>
                      <span>{r.average_lifespan}</span>
                      <span>{r.language}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className={styles.previewPanel}>
              {selected && (
                <>
                  <div className={styles.previewTop}>
                    <p className={styles.previewEyebrow}>Selected Record</p>
                    <h2 className={styles.previewTitle}>{selected.name}</h2>
                  </div>

                  <div className={styles.previewFacts}>
                    <div className={styles.factRow}>
                      <span>Classification</span>
                      <strong>{selected.classification}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Lifespan</span>
                      <strong>{selected.average_lifespan}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Language</span>
                      <strong>{selected.language}</strong>
                    </div>
                    <div className={styles.factRow}>
                      <span>Designation</span>
                      <strong>{selected.designation}</strong>
                    </div>
                  </div>

                  <Link href={`/species/${extractId(selected.url)}`} className={styles.profileLink}>
                    Open Full Record
                  </Link>
                </>
              )}
            </aside>
          </section>
        </div>
      </ContentContainer>
    </PageWrapper>
  );
}