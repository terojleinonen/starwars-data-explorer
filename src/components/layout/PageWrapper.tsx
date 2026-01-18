import { useState } from "react";
import AtmosphereLayer from "./AtmosphereLayer";
import CartographyBackground from "./CartographyBackground";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  children: React.ReactNode;
  category?: SwapiType;
};

export default function PageWrapper({ children, category }: Props) {
  const [previewCategory, setPreviewCategory] =
    useState<SwapiType | undefined>(undefined);

  const activeCategory = previewCategory ?? category;

  return (
    <div
      className={styles.wrapper}
      data-category={activeCategory}
      style={{
        ["--category-accent" as any]: `var(--accent-${activeCategory ?? "people"})`,
      }}
    >
      <CartographyBackground />
      <AtmosphereLayer category={activeCategory} />

      {/* Provide preview controls to descendants */}
      <div
        className={styles.content}
        data-atmosphere-root
        data-set-preview={(cat: SwapiType | undefined) =>
          setPreviewCategory(cat)
        }
      >
        {children}
      </div>
    </div>
  );
}