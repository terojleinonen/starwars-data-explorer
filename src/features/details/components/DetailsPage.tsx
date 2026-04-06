"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HoloHeader } from "@/ui/HoloHeader";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import RelationGraph from "./RelationGraph";
import styles from "../styles/DetailsPage.module.css";

type Props = {
  category: string;
  id: string;
  data: any;
};

type Tab = "overview" | "relations" | "meta";
type ViewMode = "list" | "graph";

/* ===== SIMPLE CACHE ===== */
const cache = new Map<string, any>();

async function fetchResource(url: string) {
  if (cache.has(url)) return cache.get(url);

  const res = await fetch(url);
  const data = await res.json();

  cache.set(url, data);
  return data;
}

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

export default function DetailsPage({ category, data }: Props) {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [view, setView] = useState<ViewMode>("list");
  const [relationsData, setRelationsData] = useState<Record<string, any>>({});

  const title = data?.title || data?.name || "Unknown";

  /* ===== RELATIONS ===== */

  const relationEntries = useMemo(() => {
    return Object.entries(data || {}).filter(
      ([, value]) =>
        Array.isArray(value) &&
        value.length &&
        typeof value[0] === "string" &&
        value[0].includes("/api/")
    );
  }, [data]);

  useEffect(() => {
    async function load() {
      const entries: Record<string, any> = {};

      for (const [, urls] of relationEntries) {
        for (const url of urls as string[]) {
          if (!entries[url]) {
            try {
              entries[url] = await fetchResource(url);
            } catch {
              entries[url] = null;
            }
          }
        }
      }

      setRelationsData(entries);
    }

    load();
  }, [relationEntries]);

  /* ===== GRAPH NODES ===== */

  const graphNodes = useMemo(() => {
    return Object.entries(relationsData)
      .map(([url, d]) => {
        const id = extractId(url);
        const category = url.split("/api/")[1].split("/")[0];

        return {
          id,
          category,
          label: d?.name || d?.title || `#${id}`,
        };
      })
      .slice(0, 12); // keep clean
  }, [relationsData]);

  /* ===== META ===== */

  const metaEntries = Object.entries(data || {}).filter(
    ([key, value]) =>
      typeof value !== "object" &&
      key !== "opening_crawl" &&
      key !== "name" &&
      key !== "title"
  );

  return (
    <PageWrapper>
      <ContentContainer>
        <div className={styles.page}>
          {/* BACK */}
          <div className={styles.headerTop}>
            <Link href={`/${category}`} className={styles.back}>
              ← Return to {category}
            </Link>
          </div>

          <HoloHeader
            category={category}
            title={title}
            subtitle="Intelligence dossier"
          />

          {/* DOSSIER */}
          <section className={styles.dossier}>
            {/* TABS */}
            <div className={styles.tabs}>
              {["overview", "relations", "meta"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as Tab)}
                  className={`${styles.tab} ${
                    tab === t ? styles.tabActive : ""
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <div className={styles.content}>
              {/* OVERVIEW */}
              {tab === "overview" && (
                <div className={styles.overview}>
                  {"opening_crawl" in data && (
                    <div className={styles.crawlPanel}>
                      <p className={styles.crawlText}>
                        {data.opening_crawl}
                      </p>
                    </div>
                  )}

                  <div className={styles.metaGrid}>
                    {metaEntries.slice(0, 6).map(([k, v]) => (
                      <div key={k} className={styles.metaItem}>
                        <span>{k.replace(/_/g, " ")}</span>
                        <strong>{String(v)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RELATIONS */}
              {tab === "relations" && (
                <div className={styles.relations}>
                  {/* VIEW TOGGLE */}
                  <div className={styles.viewToggle}>
                    <button
                      onClick={() => setView("list")}
                      className={view === "list" ? styles.activeToggle : ""}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setView("graph")}
                      className={view === "graph" ? styles.activeToggle : ""}
                    >
                      Graph
                    </button>
                  </div>

                  {view === "graph" && graphNodes.length > 0 && (
                    <RelationGraph title={title} nodes={graphNodes} />
                  )}

                  {view === "list" &&
                    relationEntries.map(([key, urls]) => (
                      <div key={key} className={styles.relationGroup}>
                        <h4>{key}</h4>

                        <div className={styles.relationChips}>
                          {(urls as string[]).map((url) => {
                            const id = extractId(url);
                            const relCategory =
                              url.split("/api/")[1].split("/")[0];

                            const label =
                              relationsData[url]?.name ||
                              relationsData[url]?.title ||
                              `#${id}`;

                            return (
                              <button
                                key={url}
                                className={styles.chip}
                                data-type={relCategory}
                                onClick={() =>
                                  router.push(`/${relCategory}/${id}`)
                                }
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* META */}
              {tab === "meta" && (
                <div className={styles.metaFull}>
                  {metaEntries.map(([k, v]) => (
                    <div key={k} className={styles.metaRow}>
                      <span>{k.replace(/_/g, " ")}</span>
                      <strong>{String(v)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </ContentContainer>
    </PageWrapper>
  );
}