"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/features/layout";
import ContentContainer from "@/features/layout/components/ContentContainer";
import { HoloHeader } from "@/ui/HoloHeader";
import DetailsTabs from "@/features/details/components/DetailsTabs";
import OpeningCrawl from "@/features/details/components/OpeningCrawl";
import  RelatedRail from "@/features/details/components/RelatedRail";
import styles from "../styles/DetailsPage.module.css";

type Props = {
  category: string;
  id: string;
  data: any;
};

/* ========================= */
/* HELPERS */
/* ========================= */

const EXCLUDED_KEYS = [
  "url",
  "created",
  "edited",
  "opening_crawl",
];

/**
 * Maps SWAPI data keys (from API responses) to URL category names
 * E.g., "characters" array in film data maps to "people" category
 */
function mapDataKeyToCategory(key: string): string {
  const categoryMap: Record<string, string> = {
    characters: "people",
    residents: "people",
    films: "films",
    planets: "planets",
    species: "species",
    vehicles: "vehicles",
    starships: "starships",
    homeworld: "planets",
  };

  return categoryMap[key] || key;
}

function getDisplayEntries(data: any) {
  return Object.entries(data).filter(
    ([key, value]) =>
      !EXCLUDED_KEYS.includes(key) &&
      typeof value !== "object"
  );
}

function getRelationEntries(data: any) {
  return Object.entries(data).filter(
    ([_, value]) =>
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "string"
  );
}

function groupData(category: string, data: any) {
  if (category === "people") {
    return [
      {
        title: "Identity",
        items: [
          ["Name", data.name],
          ["Gender", data.gender],
          ["Birth Year", data.birth_year],
        ],
      },
      {
        title: "Physical",
        items: [
          ["Height", data.height],
          ["Mass", data.mass],
          ["Hair", data.hair_color],
          ["Eyes", data.eye_color],
        ],
      },
    ];
  }

  if (category === "films") {
    return [
      {
        title: "Production",
        items: [
          ["Director", data.director],
          ["Producer", data.producer],
          ["Release", data.release_date],
        ],
      },
    ];
  }

  return [
    {
      title: "Details",
      items: Object.entries(data).filter(
        ([_, v]) => typeof v !== "object"
      ),
    },
  ];
}

/* ========================= */
/* COMPONENT */
/* ========================= */

export default function DetailsPage({
  category,
  id,
  data,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const groups = groupData(category, data);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data) return null;

  const title = data.name || data.title || "Unknown";
  const isFilm = category === "films";
  const relationEntries = getRelationEntries(data);

  return (
    <PageWrapper>
      <ContentContainer>
        {/* HEADER */}
        <HoloHeader
          category={category}
          title={title}
          subtitle={`Record ID: ${id}`}
        />

        {/* TABS */}
        <DetailsTabs
          /* ========================= */
          /* OVERVIEW */
          /* ========================= */
          overview={
            <>
              {/* OPENING CRAWL (FILMS ONLY) */}
              {isFilm && data.opening_crawl && (
                <OpeningCrawl text={data.opening_crawl} />
              )}

              {/* GROUPED HOLO PANELS */}
              <div className={styles.groupGrid}>
                {groups.map((group) => (
                  <div key={group.title} className={styles.groupPanel}>
                    <h3>{group.title}</h3>

                    {group.items.map(([label, value]) => (
                      <div key={label} className={styles.row}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          }

          /* ========================= */
          /* RELATIONS */
          /* ========================= */
          relations={
            <div className={styles.relations}>
              {relationEntries.length === 0 && (
                <p className={styles.empty}>
                  No related records
                </p>
              )}

              {relationEntries.map(([key, urls]) => (
                <RelatedRail
                  key={key}
                  title={key.replaceAll("_", " ")}
                  category={mapDataKeyToCategory(key)}
                  urls={urls as string[]}
                />
              ))}
            </div>
          }

          /* ========================= */
          /* META */
          /* ========================= */
          meta={
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span>Category</span>
                <strong>{category}</strong>
              </div>

              <div className={styles.metaItem}>
                <span>Record ID</span>
                <strong>{id}</strong>
              </div>

              {data.created && (
                <div className={styles.metaItem}>
                  <span>Created</span>
                  <strong>{data.created}</strong>
                </div>
              )}

              {data.edited && (
                <div className={styles.metaItem}>
                  <span>Edited</span>
                  <strong>{data.edited}</strong>
                </div>
              )}
            </div>
          }
        />
      </ContentContainer>
    </PageWrapper>
  );
}