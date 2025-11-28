// FILE: App.tsx
// App routing + theme management + navbar + LandingPage integration

"use client";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FilmsPage, PeoplePage, PlanetsPage, SpeciesPage, VehiclesPage, StarshipsPage } from "@/components/pages";
import LandingPage from "../components/LandingPage";
import DetailsPage from "../components/DetailsPage";

import "../../styles/globals.css";

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  if (!mounted) return null;

  return (
    <Router>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<LandingPage theme={theme} />} />
        <Route path="/films" element={<FilmsPage theme={theme} />} />
        <Route path="/people" element={<PeoplePage theme={theme} />} />
        <Route path="/planets" element={<PlanetsPage theme={theme} />} />
        <Route path="/species" element={<SpeciesPage theme={theme} />} />
        <Route path="/vehicles" element={<VehiclesPage theme={theme} />} />
        <Route path="/starships" element={<StarshipsPage theme={theme} />} /> 
        <Route path="/:category/:id" element={<DetailsPage theme={theme} />} />
        {/* fallback */}
        <Route path="*" element={<LandingPage theme={theme} />} />
      </Routes>
    </Router>
  );
};

export default App;
