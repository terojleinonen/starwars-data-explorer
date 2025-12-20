// FILE: pages.tsx
// Super-premium upgraded SWAPI category pages
// – holographic grid
// – scroll-reactive lighting
// – viewport-activated data slabs

import React from "react";
import Link from "next/link";
import { useSwapi, SwapiListResponse, SwapiItem } from "./useSwapi";
import styles from "./pages.module.css";
import { HoloHeader } from "./HoloHeader";

interface CategoryPageProps {
  theme: "light" | "dark";
}

/* -----------------------------------------------
   Utilities
----------------------------------------------- */

const safe = (v: unknown): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "—";
};

const getLabel = (item: SwapiItem): string =>
  (item as any).name ??
  (item as any).title ??
  "Unknown";

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
   Viewport-entry activation hook
----------------------------------------------- */

const useRevealOnView = () => {
  const ref = React.useRef<HTMLAnchorElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("isVisible");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
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
  category: string;
}> = ({ items, category }) => {
  return (
    <div className={styles.listGrid}>
      {items.map((item, index) => {
        const url = safe(item.url);
        const id = url.split("/").filter(Boolean).pop() || String(index + 1);
        const label = getLabel(item);

        const secondary =
          safe(
            item.model ??
              item.classification ??
              item.director ??
              item.climate ??
              item.gender ??
              item.starship_class ??
              ""
          ) || "—";

        const revealRef = useRevealOnView();

        return (
          <Link
            ref={revealRef}
            key={`${category}-${id}`}
            href={`/${category}/${id}`}
            className={`${styles.holoCard} ${styles.card}`}
          >
            <div className={styles.cardHeader}>
              <span className={styles.recordHeader}>Record</span>
              <span>ID: {id}</span>
            </div>

            <div className={styles.title}>{label}</div>

            {secondary !== "—" && (
              <div className={styles.secondary}>{secondary}</div>
            )}

            <div className={styles.openDetail}>Open detail →</div>
          </Link>
        );
      })}
    </div>
  );
};

/* -----------------------------------------------
   Category pages
----------------------------------------------- */

export const FilmsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } = useSwapi<SwapiListResponse<SwapiItem>>("films");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category="films" theme={theme} />
      </div>
      {loading && <p className={styles.loading}>Loading film data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="films" />}
    </PageWrapper>
  );
};

export const PeoplePage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } =
    useSwapi<SwapiListResponse<SwapiItem>>("people");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category="people" theme={theme} />
      </div>
      {loading && <p className={styles.loading}>Loading character data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="people" />}
    </PageWrapper>
  );
};

export const PlanetsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } =
    useSwapi<SwapiListResponse<SwapiItem>>("planets");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category="planets" theme={theme} />
      </div>
      {loading && <p className={styles.loading}>Loading planetary data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="planets" />}
    </PageWrapper>
  );
};

export const SpeciesPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } =
    useSwapi<SwapiListResponse<SwapiItem>>("species");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category="species" theme={theme} />
      </div>
      {loading && <p className={styles.loading}>Loading species data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="species" />}
    </PageWrapper>
  );
};

export const VehiclesPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } =
    useSwapi<SwapiListResponse<SwapiItem>>("vehicles");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category="vehicles" theme={theme} />
      </div>
      {loading && <p className={styles.loading}>Loading vehicle data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="vehicles" />}
    </PageWrapper>
  );
};

export const StarshipsPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { data, loading, error } =
    useSwapi<SwapiListResponse<SwapiItem>>("starships");
  const items = data?.results ?? [];

  return (
    <PageWrapper>
      <div className={styles.headerFade}>
        <HoloHeader category="starships" theme={theme} />
      </div>
      {loading && <p className={styles.loading}>Loading starship data…</p>}
      {error && <p className={styles.error}>Transmission error: {error}</p>}
      {!loading && !error && <ListGrid items={items} category="starships" />}
    </PageWrapper>
  );
};
// FILE: pages.tsx