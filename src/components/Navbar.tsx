// FILE: Navbar.tsx
// Super-premium VisionOS-style navigation bar with theme toggle + active route highlight

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const categories = ["films", "people", "planets", "species", "vehicles", "starships"];

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isDark = theme === "dark";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 backdrop-blur-2xl border-b ${
        isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/70 border-slate-300"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className={`text-lg font-semibold tracking-wide ${
            isDark ? "text-sky-300" : "text-sky-700"
          }`}
        >
          Starship OS
        </Link>

        {/* Nav links */}
        <div className="hidden gap-6 md:flex">
          {categories.map((cat) => {
            const isActive = pathname.startsWith(`/${cat}`);
            return (
              <Link
                key={cat}
                to={`/${cat}`}
                className={`relative pb-1 text-sm tracking-wide transition-colors ${
                  isActive
                    ? isDark
                      ? "text-sky-300"
                      : "text-sky-700"
                    : isDark
                    ? "text-slate-300 hover:text-sky-300"
                    : "text-slate-700 hover:text-sky-700"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className={`absolute left-0 right-0 -bottom-[2px] h-[2px] rounded-full ${
                      isDark ? "bg-sky-300" : "bg-sky-700"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            isDark
              ? "border border-slate-700 bg-slate-900 text-sky-300 hover:bg-slate-800"
              : "border border-slate-300 bg-white text-sky-700 hover:bg-slate-100"
          }`}
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;