"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import { useSwapi } from "@/hooks/data/useSwapi";
import { setNavContext } from "@/lib/navigation/navigationContext";
import styles from "../styles/FilmsTimelinePage.module.css";

type Film = {
  title: string;
  episode_id: number;
  release_date: string;
  director: string;
  opening_crawl: string;
  url: string;
};

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function year(date: string) {
  return new Date(date).getFullYear();
}

export default function FilmsTimelinePage() {
  const router = useRouter();
  const { data } = useSwapi("films");
  const records = (data?.results ?? []) as Film[];

  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ===== PARALLAX ===== */
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setNavContext("films", "/films");
  }, []);

  const films = useMemo(() => {
    return [...records].sort((a, b) => a.episode_id - b.episode_id);
  }, [records]);

  useEffect(() => {
    if (films.length && !selectedId) {
      setSelectedId(extractId(films[0].url));
    }
  }, [films, selectedId]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 18;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 18;
    };

    window.addEventListener("mousemove", handleMove);

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;

      const el = document.getElementById("timeline");
      if (el) {
        el.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const selected = films.find(f => extractId(f.url) === selectedId);

  return (
    <PageWrapper>
        <div className={`${styles.page} ${selected ? styles.focus : ""}`}>
          <HoloHeader
            category="films"
            title="Saga Timeline"
            subtitle="Chronological cinematic archive of galactic events"
          />

          {/* BACKGROUND */}
          <div className={styles.starsBack} />
          <div className={styles.starsFront} />

          {/* TIMELINE */}
          <div id="timeline" className={styles.timeline}>
            <div className={styles.line} />

            {films.map(f => {
              const id = extractId(f.url);
              const active = id === selectedId;

              return (
                <div key={id} className={styles.nodeWrap}>
                  <button
                    className={`${styles.node} ${active ? styles.active : ""}`}
                    onClick={() => setSelectedId(id)}
                    onDoubleClick={() => router.push(`/films/${id}`)}
                  >
                    <span className={styles.episode}>
                      EP {f.episode_id}
                    </span>
                    <span className={styles.title}>{f.title}</span>
                    <span className={styles.year}>
                      {year(f.release_date)}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* PANEL */}
          {selected && (
            <section className={styles.panel}>
              <div className={styles.panelTop}>
                <span className={styles.episodeBig}>
                  Episode {selected.episode_id}
                </span>

                <h2 className={styles.titleBig}>{selected.title}</h2>

                <p className={styles.meta}>
                  {year(selected.release_date)} • {selected.director}
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
    </PageWrapper>
  );
}