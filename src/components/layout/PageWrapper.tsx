import AtmosphereLayer from "./AtmosphereLayer";
import CartographyBackground from "./CartographyBackground";
import CRTOverlay from "./CRTOverlay";
import styles from "./PageWrapper.module.css";
import type { SwapiType } from "@/components/types/swapi-types";

type Props = {
  children: React.ReactNode;
  category?: SwapiType;
};

export default function PageWrapper({ children, category }: Props) {
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

      {/* CRT only on landing */}
      {category === undefined && <CRTOverlay />}

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
