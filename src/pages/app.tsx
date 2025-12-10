// FILE: App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

import LandingPage from "../components/LandingPage";
import DetailsPage from "../components/DetailsPage";
import Navbar from "../components/Navbar";

import type { SwapiType } from "../components/types/swapi-types";
import { FilmsPage, StarshipsPage, PeoplePage, PlanetsPage, VehiclesPage, SpeciesPage } from "@/components/pages";

interface AppProps {
  theme: "light" | "dark";
}

// -----------------------------
// 🔥 Wrapper: Inject category → DetailsPage
// -----------------------------
const DetailsPageWrapper: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  const { category } = useParams<{ category: string }>();

  const validTypes: SwapiType[] = [
    "films",
    "people",
    "planets",
    "species",
    "vehicles",
    "starships"
  ];

  if (!category || !validTypes.includes(category as SwapiType)) {
    return <div style={{ padding: 40 }}>Invalid category: {category}</div>;
  }

  return <DetailsPage type={category as SwapiType} theme={theme} />;
};

// -----------------------------
// 🌌 Main App Component
// -----------------------------
const App: React.FC<AppProps> = ({ theme }) => {
  return (
    <Router>
      <Navbar theme={theme} />

      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage theme={theme} />} />

        {/* Category list pages */}
        <Route path="/" element={<LandingPage theme={theme} />} />
        <Route path="/films" element={<FilmsPage theme={theme} />} />
        <Route path="/people" element={<PeoplePage theme={theme} />} />
        <Route path="/planets" element={<PlanetsPage theme={theme} />} />
        <Route path="/species" element={<SpeciesPage theme={theme} />} />
        <Route path="/vehicles" element={<VehiclesPage theme={theme} />} />
        <Route path="/starships" element={<StarshipsPage theme={theme} />} />   

        {/* 🔥 Dynamic details page */}
        <Route path="/:category/:id" element={<DetailsPageWrapper theme={theme} />} />

        {/* Fallback */}
        <Route path="*" element={<LandingPage theme={theme} />} />
      </Routes>
    </Router>
  );
};

export default App;
// FILE: App.tsx