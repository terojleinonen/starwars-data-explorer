import Link from "next/link";
import HoloHeader from "@/components/HoloHeader/HoloHeader";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import DetailsPage from "@/components/details/DetailsPage";
import DetailsDataTable from "@/components/details/DetailsDataTable";
import RelatedRail from "@/components/details/RelatedRail";
import type { SwapiType } from "@/components/types/swapi-types";
import styles from "./backToContext.module.css";

/* ---------------- types ---------------- */

type PageProps = {
  params: Promise<{
    category: SwapiType;
    id: string;
  }>;
  searchParams?: Promise<{
    fromLabel?: string;
    fromHref?: string;
  }>;
};

/* ---------------- helpers ---------------- */

function getIdFromUrl(url?: string) {
  if (!url) return null;
  return url.match(/\/(\d+)\/?$/)?.[1] ?? null;
}

/* ---------------- page ---------------- */

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  // ✅ REQUIRED in Next.js 15
  const { category, id } = await params;
  const { fromLabel, fromHref } =
    (await searchParams) ?? {};

  if (!category || !id) {
    return (
      <p style={{ padding: 24 }}>
        Invalid route.
      </p>
    );
  }

  /* ---------- fetch main record ---------- */

  const res = await fetch(
    `https://swapi.py4e.com/api/${category}/${id}/`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("Failed to load data");
  }

  const data = await res.json();

  /* ---------- resolve singular relations ---------- */

  let homeworldLink: React.ReactNode = "Unknown";

  if (data.homeworld) {
    try {
      const planetRes = await fetch(
        data.homeworld,
        { next: { revalidate: 300 } }
      );
      const planet = await planetRes.json();

      const planetId = getIdFromUrl(
        data.homeworld
      );

      homeworldLink = planetId ? (
        <Link href={`/planets/${planetId}`}>
          {planet.name}
        </Link>
      ) : (
        planet.name
      );
    } catch {
      /* ignore homeworld errors */
    }
  }

  /* ---------- build context-aware breadcrumbs ---------- */

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ];

    if (fromLabel && fromHref) {
    breadcrumbs.push({ label: String(fromLabel), href: String(fromHref) });
  } else {
    breadcrumbs.push({ label: String(category), href: `/${category}` });
  }

  breadcrumbs.push({
    label: String(data.name ?? data.title ?? "Record"),
  });

  const backToContext =
  fromLabel && fromHref
    ? {
        label: String(fromLabel),
        href: String(fromHref),
      }
    : null;

  /* ---------- render ---------- */

  return (
    <>
      {/* Cinematic header */}
      <HoloHeader category={category} />

      {/* Context-aware breadcrumbs */}
      <div className={styles.contextNav}>
        <Breadcrumbs items={breadcrumbs} />

        {backToContext && (
          <Link
            href="#"
            data-back-arrow
            style={{
              display: "none",
              fontSize: "14px",
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
            className={styles.backToContext}>
              Back to {backToContext.label}
              ← Back
          </Link>
        )}
      </div>

      {/* Details layout */}
      <DetailsPage
        category={category}
        title={data.name ?? data.title}
        description={data.opening_crawl}
        stats={[
          {
            label: "Homeworld",
            value: homeworldLink,
          },
          {
            label: "Created",
            value: data.created,
          },
          {
            label: "Edited",
            value: data.edited,
          },
        ]}
      >
        {/* Main data table */}
        <DetailsDataTable
          data={data}
          exclude={[
            "name",
            "title",
            "opening_crawl",
            "created",
            "edited",
            "url",
            "homeworld",
            "films",
            "people",
            "vehicles",
            "starships",
            "species",
          ]}
        />

        {/* Related content */}
        <RelatedRail
          label="Films"
          category="films"
          items={data.films}
        />

        <RelatedRail
          label="Vehicles"
          category="vehicles"
          items={data.vehicles}
        />

        <RelatedRail
          label="Starships"
          category="starships"
          items={data.starships}
        />

        <RelatedRail
          label="Species"
          category="species"
          items={data.species}
        />
      </DetailsPage>
    </>
  );
}
