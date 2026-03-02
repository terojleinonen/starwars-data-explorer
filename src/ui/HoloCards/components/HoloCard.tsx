"use client";

import React from "react";
import { NavLink } from "@/features/navigation/";
import { prefetchCategory } from "@/lib/swapi/swapiService";
import  HoloIcon, { HoloIconName }  from "@/ui/icons/HoloIcon";

import styles from "../styles/HoloCard.module.css";

type Props = {
  title: string;
  subtitle?: string;
  href: string;
  icon?: HoloIconName;
};

export default function HoloCard({
  title,
  subtitle,
  href,
  icon,
}: Props) {

  function handlePrefetch() {

    const category = href.replace("/", "");

    prefetchCategory(category);

  }

  return (
    <NavLink
      href={href}
      label={title}
      className={styles.card}
      onMouseEnter={handlePrefetch}
    >

      <div className={styles.surface}>

        {/* glow layers */}

        <div className={styles.glow} />
        <div className={styles.sweep} />

        {/* card content */}

        <div className={styles.content}>

          {icon && (
            <div className={styles.icon}>
              <HoloIcon name={icon} />
            </div>
          )}

          <div className={styles.textBlock}>

            <div className={styles.title}>
              {title}
            </div>

            {subtitle && (
              <div className={styles.subtitle}>
                {subtitle}
              </div>
            )}

          </div>

        </div>

      </div>

    </NavLink>
  );
}