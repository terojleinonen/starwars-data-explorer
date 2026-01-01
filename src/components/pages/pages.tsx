// FILE: pages.tsx
// Super-premium upgraded SWAPI category pages
// – holographic grid
// – scroll-reactive lighting
// – viewport-activated data slabs

import React from "react";
import NavLink from "../navigation/NavLink";
import { useSwapi, SwapiListResponse, SwapiItem } from "../useSwapi";
import { SwapiType } from "../types/swapi-types";
import styles from "./pages.module.css";
import  HoloHeader  from "../HoloHeader/HoloHeader";
import { motion } from "framer-motion";

/* -----------------------------------------------
   Utilities
----------------------------------------------- */

const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

type RecordMeta = {
  id: string;
  title: string;
  subtitle?: string;
};

const getRecordMeta = (
  item: SwapiItem,
  fallbackId: string
): RecordMeta => {
  const url =
    typeof item.url === "string"
      ? item.url
      : "";

  const id =
    url.split("/").filter(Boolean).pop() ??
    fallbackId;

  return {
    id,
    title:
      (item as any).name ??
      (item as any).title ??
      "Unknown",
    subtitle:
      safe(
        item.model ??
          item.classification ??
          item.director ??
          item.climate ??
          item.gender ??
          item.starship_class
      ) || undefined,
  };
};

/* -----------------------------------------------
   Scroll-reactive lighting hook
----------------------------------------------- */

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const useScrollFX = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const h = Math.max(1, window.innerHeight);
        const t = clamp01(y / (h * 1.2));

        el.style.setProperty("--gridOpacity", String(0.18 + t * 0.18));
        el.style.setProperty("--contentGlow", String(0.06 + t * 0.14));
        el.style.setProperty("--titleFade", String(1 - t * 0.35));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
};

/* -----------------------------------------------
   Layout wrapper
----------------------------------------------- */

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fxRef = useScrollFX();

  return (
    <div ref={fxRef} className={styles.pageWrapper}>
      <div className={styles.holoGrid} />
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
};

/* -----------------------------------------------
   Card grid
----------------------------------------------- */

const ListGrid: React.FC<{
  items: SwapiItem[];
  category: SwapiType;
}> = ({ items, category }) => {
  return (
    <div className={styles.listGrid}>
      {items.map((item, index) => {
        const meta = getRecordMeta(
          item,
          String(index + 1)
        );

        return (
          <motion.div
            key={`${category}-${meta.id}`}
            layoutId={`card-${category}-${meta.id}`}
            className={styles.cardWrapper}
          >
            <NavLink
              href={`/${category}/${meta.id}`}
              label={meta.title} // ✅ navigation contract
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <span className={styles.recordHeader}>
                  Record
                </span>
                <span>ID: {meta.id}</span>
              </div>

              <div className={styles.title}>
                {meta.title}
              </div>

              {meta.subtitle && (
                <div className={styles.secondary}>
                  {meta.subtitle}
                </div>
              )}

              <div className={styles.openDetail}>
                Open detail →
              </div>
            </NavLink>
          </motion.div>
        );
      })}
    </div>
  );
};

/* -----------------------------------------------
   Category pages
----------------------------------------------- */

type GenericCategoryProps = {
  category: SwapiType;
  loadingText: string;
};

const CategoryPage: React.FC<GenericCategoryProps> = ({
  category,
  loadingText,
}) => {
  const { data, loading, error } =
    useSwapi<SwapiListResponse<SwapiItem>>(
      category
    );

  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category={category} />
      </div>

      {loading && (
        <p className={styles.loading}>
          {loadingText}
        </p>
      )}

      {error && (
        <p className={styles.error}>
          Transmission error: {error}
        </p>
      )}

      {!loading && !error && (
        <ListGrid
          items={items}
          category={category}
        />
      )}
    </PageWrapper>
  );
};

export const FilmsPage = () => (
  <CategoryPage
    category="films"
    loadingText="Loading film data…"
  />
);

export const PeoplePage = () => (
  <CategoryPage
    category="people"
    loadingText="Loading character data…"
  />
);

export const PlanetsPage = () => (
  <CategoryPage
    category="planets"
    loadingText="Loading planetary data…"
  />
);

export const SpeciesPage = () => (
  <CategoryPage
    category="species"
    loadingText="Loading species data…"
  />
);

export const VehiclesPage = () => (
  <CategoryPage
    category="vehicles"
    loadingText="Loading vehicle data…"
  />
);

export const StarshipsPage = () => (
  <CategoryPage
    category="starships"
    loadingText="Loading starship data…"
  />
);