import Link from "next/link";
import styles from "../styles/PlanetPanel.module.css";
import { Planet } from "@/types/swapi";

function extractId(url: string) {
  return url.match(/\/(\d+)\/?$/)?.[1] ?? "";
}

function displayValue(
  value: string | undefined
): string {
  return !value ||
    value === "unknown" ||
    value === "n/a"
    ? "Unknown"
    : value;
}

function getPlanetTheme(climate: string) {
  const value = climate.toLowerCase();

  if (value.includes("desert")) {
    return {
      color: "#d9a441",
      glow: "rgba(217,164,65,.35)",
    };
  }

  if (
    value.includes("frozen") ||
    value.includes("ice")
  ) {
    return {
      color: "#8cc9ff",
      glow: "rgba(140,201,255,.35)",
    };
  }

  if (
    value.includes("temperate") ||
    value.includes("forest")
  ) {
    return {
      color: "#5ecb88",
      glow: "rgba(94,203,136,.35)",
    };
  }

  if (
    value.includes("volcanic") ||
    value.includes("lava")
  ) {
    return {
      color: "#ff7043",
      glow: "rgba(255,112,67,.35)",
    };
  }

  return {
    color: "#78beff",
    glow: "rgba(120,190,255,.35)",
  };
}

export default function PlanetPanel({
  planet,
}: {
  planet: Planet;
}) {
  const theme = getPlanetTheme(
    planet.climate
  );

  return (
    <div className={styles.panel}>
      {/* HERO */}

      <div className={styles.hero}>
        <div
          className={styles.planetHero}
          style={
            {
              "--planet-color":
                theme.color,
              "--planet-glow":
                theme.glow,
            } as React.CSSProperties
          }
        >
          <div
            className={
              styles.orbitRing
            }
          />

          <div
            className={
              styles.planetSphere
            }
          />
        </div>

        <p className={styles.eyebrow}>
          Planet Dossier
        </p>

        <h2 className={styles.title}>
          {planet.name}
        </h2>

        <p className={styles.subtitle}>
          {displayValue(
            planet.climate
          )}
        </p>
      </div>

      {/* METRICS */}

      <div className={styles.metrics}>
        <div
          className={
            styles.metricCard
          }
        >
          <span>Population</span>

          <strong>
            {displayValue(
              planet.population
            )}
          </strong>
        </div>

        <div
          className={
            styles.metricCard
          }
        >
          <span>Gravity</span>

          <strong>
            {displayValue(
              planet.gravity
            )}
          </strong>
        </div>
      </div>

      {/* WORLD PROFILE */}

      <div className={styles.profile}>
        <div className={styles.spec}>
          <span>Terrain</span>

          <strong>
            {displayValue(
              planet.terrain
            )}
          </strong>
        </div>

        <div className={styles.spec}>
          <span>Diameter</span>

          <strong>
            {displayValue(
              planet.diameter
            )}
          </strong>
        </div>

        <div className={styles.spec}>
          <span>Climate</span>

          <strong>
            {displayValue(
              planet.climate
            )}
          </strong>
        </div>
      </div>

      {/* CTA */}

      <Link
        href={`/planets/${extractId(
          planet.url
        )}`}
        className={styles.cta}
      >
        Open Full Record
      </Link>
    </div>
  );
}