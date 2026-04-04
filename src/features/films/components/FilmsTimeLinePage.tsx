"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/FilmsTimelinePage.module.css";

type Film = {
  title: string;
  episode_id: number;
  release_date: string;
  director: string;
  producer: string;
  opening_crawl: string;
  url: string;
};

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function formatDate(date: string) {
  return new Date(date).getFullYear();
}

export default function FilmsTimelinePage() {
  const router = useRouter();
  const { data } = useSwapi("films");
  const records = (data?.results ?? []) as Film[];

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setNavContext("films", "/films");
  }, []);

  const sorted = useMemo(() => {
    return [...records].sort((a, b) => a.episode_id - b.episode_id);
  }, [records]);

  useEffect(() => {
    if (sorted.length && !selectedId) {
      setSelectedId(extractId(sorted[0].url));
    }
  }, [sorted, selectedId]);

  const selected = sorted.find(f => extractId(f.url) === selectedId);

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          <HoloHeader
            category="films"
            title="Saga Timeline"
            subtitle="Chronological cinematic archive of galactic events"
          />

          {/* TIMELINE */}
          <div className={styles.timeline}>
            <div className={styles.line} />

            {sorted.map((film) => {
              const id = extractId(film.url);
              const active = id === selectedId;

              return (
                <div key={id} className={styles.nodeWrap}>
                  <button
                    className={`${styles.node} ${active ? styles.active : ""}`}
                    onClick={() => setSelectedId(id)}
                    onDoubleClick={() => router.push(`/films/${id}`)}
                  >
                    <span className={styles.episode}>
                      EP {film.episode_id}
                    </span>
                    <span className={styles.title}>{film.title}</span>
                    <span className={styles.year}>
                      {formatDate(film.release_date)}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* DETAILS PANEL */}
          {selected && (
            <section className={styles.panel}>
              <div className={styles.panelTop}>
                <span className={styles.episodeBig}>
                  Episode {selected.episode_id}
                </span>
                <h2 className={styles.titleBig}>{selected.title}</h2>
                <p className={styles.meta}>
                  {formatDate(selected.release_date)} • Directed by{" "}
                  {selected.director}
                </p>
              </div>

              <div className={styles.crawl}>
                {selected.opening_crawl}
              </div>

              <Link
                href={`/films/${extractId(selected.url)}`}
                className={styles.cta}
              >
                Open Full Record
              </Link>
            </section>
          )}
        </div>
      </ContentContainer>
    </PageWrapper>
  );
}