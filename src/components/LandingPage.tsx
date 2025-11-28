// FILE: LandingPage.tsx
// Super-premium landing page with animated planet header + category shortcuts

import React from "react";
import { Link } from "react-router-dom";
import PlanetHeader from "./PlanetHeader";

interface LandingPageProps {
  theme: "light" | "dark";
}

const categories = [
  { id: "films", label: "Films", desc: "Saga overview and metadata" },
  { id: "people", label: "People", desc: "Characters and biographies" },
  { id: "planets", label: "Planets", desc: "World climates and stats" },
  { id: "species", label: "Species", desc: "Biological classifications" },
  { id: "vehicles", label: "Vehicles", desc: "Ground and atmospheric units" },
  { id: "starships", label: "Starships", desc: "Faster-than-light craft" },
];

const LandingPage: React.FC<LandingPageProps> = ({ theme }) => {
  const isDark = theme === "dark";

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 pt-6 sm:px-8 fade-in">
      {/* PlanetHeader being used as a hero banner */}
      <PlanetHeader
        theme={theme}
        title="Galactic Data Interface"
        subtitle="Explore public SWAPI structures through a 2030-grade starship OS console."
        metrics={{ category: "planets", gravity: "1g", climate: "Temperate", orbital_period: "365" }}
      />

      {/* Intro card */}
      <div
        className={`rounded-3xl border p-6 mb-10 backdrop-blur-xl shadow-xl text-sm sm:text-base ${
          isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/80 border-slate-200/80"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-2">Welcome aboard</h2>
        <p className="opacity-80 max-w-2xl">
          This interface provides a unified access panel for multiple SWAPI endpoints,
          rendered using enhanced starship-grade UI elements, depth layering, animated
          parallax objects, and responsive VisionOS-inspired design principles.
        </p>
      </div>

      {/* Category shortcuts grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/${cat.id}`}
            className={`group rounded-2xl border px-5 py-6 transition-all card-lift ${
              isDark
                ? "bg-slate-900/70 border-slate-700/60 hover:border-sky-400/70"
                : "bg-white/70 border-slate-200/80 hover:border-sky-500/70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Category</div>
              <div className="text-[0.7rem] text-sky-400/80 group-hover:text-sky-500">→</div>
            </div>
            <div className="text-lg font-semibold mb-1">{cat.label}</div>
            <div className="text-xs opacity-70 group-hover:opacity-100">{cat.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;