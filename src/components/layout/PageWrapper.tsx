"use client";

import AtmosphereLayer from "./AtmosphereLayer";
import CartographyBackground from "./CartographyBackground";
import { useAtmosphere } from "./AtmosphereContext";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";
import Breadcrumbs, { BreadcrumbItem } from "../navigation/Breadcrumbs";

type Props = {
  children: React.ReactNode;
  category?: SwapiType;
  breadcrumbs?: BreadcrumbItem[];
};

export default function PageWrapper({ children, breadcrumbs }: Props) {
  const { category } = useAtmosphere();

  return (
    <div
      className={styles.wrapper}
      data-category={category}
      style={{
        ["--category-accent" as any]: `var(--accent-${category ?? "people"})`,
      }}
    >
      <CartographyBackground />
      <AtmosphereLayer category={category} />
    
      <main className={styles.content}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {children}
      </main>
    </div>
  );
}