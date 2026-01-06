"use client";

import HoloHeader from "@/components/HoloHeader/HoloHeader";
import PageWrapper from "../layout/PageWrapper";
import RecordGrid from "@/components/records/RecordGrid";
import { useSwapi } from "@/components/useSwapi";
import { SwapiType } from "@/components/types/swapi-types";
import styles from "./CategoryPage.module.css";

type Props = {
  category: SwapiType;
  loadingText: string;
};

export default function CategoryPage({
  category,
  loadingText,
}: Props) {
  const { data, loading, error } = useSwapi(
    category
  );

  const items = data?.results ?? [];

  return (
    <PageWrapper atmosphere={category}>
      <HoloHeader category={category} />

      {loading && (
        <p className={styles.loading}>
          {loadingText}
        </p>
      )}

      {error && (
        <p className={styles.error}>
          Transmission error
        </p>
      )}

      {!loading && !error && (
        <RecordGrid
          items={items}
          category={category}
        />
      )}
    </PageWrapper>
  );
}