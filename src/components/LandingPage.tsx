// FILE: LandingPage.tsx
// Premium upgraded VisionOS-style landing page with responsive 3D planet

import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import ThreePlanet from "./ThreePlanet";

interface LandingPageProps {
  theme: "light" | "dark";
}

const categories = [
  { title: "Films", desc: "Information on Star Wars films", path: "/films" },
  { title: "People", desc: "Details about characters", path: "/people" },
  { title: "Planets", desc: "Data on planets", path: "/planets" },
  { title: "Species", desc: "Facts about species", path: "/species" },
  { title: "Vehicles", desc: "Data concerning vehicles", path: "/vehicles" },
  { title: "Starships", desc: "Information on starships", path: "/starships" },
];

const LandingPage: React.FC<LandingPageProps> = ({ theme }) => {
  return (
    <div
      className={`${styles.landingBg} min-h-screen w-full relative overflow-visible`}
    >
      {/* Responsive 3D Planet */}
      <div className={styles.planetWrapper}>
        <ThreePlanet theme={theme} />
      </div>

      {/* Glass UI Panel */}
      <div className={`${styles.landingPanel} ${styles.fadeInSlow}`}>
        <h1 className={styles.landingTitle}>Free Star Wars API</h1>
        <p className={styles.landingSubtitle}>
          Access data about the Star Wars universe
        </p>

        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link key={cat.title} to={cat.path} className={styles.categoryCard}>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className={styles.landingFooter}>Powered by SWAPI</div>
      </div>
    </div>
  );
};

export default LandingPage;
// FILE: ThreePlanet.tsx
// Strict TypeScript + React Three Fiber + FBM 3D Perlin shader planet