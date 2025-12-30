"use client";

import { forwardRef } from "react";
import Link from "next/link";
import styles from "./RecordCard.module.css";
import ProceduralTile from "@/components/visual/ProceduralTile";
import { usePrefetchOnHover } from "@/hooks/usePrefetchOnHover";

type Props = {
  title: string;
  subtitle?: string;
  href: string;
  url: string;
};

const RecordCard = forwardRef<
  HTMLAnchorElement,
  Props
>(function RecordCard(
  { title, subtitle, href, url },
  ref
) {
  // prefetch on hover
  const prefetch = usePrefetchOnHover(url);

  return (
    <Link
      ref={ref}
      href={href}
      className={styles.card}
      {...prefetch}
    >
      <div className={styles.tile}>
        <ProceduralTile
          seed={url}
          accentRgb="var(--accent-rgb)"
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.title}>
          {title}
        </span>

        {subtitle && (
          <span className={styles.subtitle}>
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
});

export default RecordCard;