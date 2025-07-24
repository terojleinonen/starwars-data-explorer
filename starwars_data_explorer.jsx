import React from "react";
import {
  Link,
  useLocation
} from "react-router-dom";
import { motion } from "framer-motion";

const categories = ["films", "people", "planets", "species", "vehicles", "starships"];

const Navbar = ({ theme, toggleTheme }) => {
  // Ensure that this hook is used only when the component is within a Router
  let location;
  try {
    location = useLocation();
  } catch (error) {
    console.error("Navbar must be rendered within a Router.", error);
    location = { pathname: "" }; // fallback to prevent crash
  }

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      animate={{
        paddingTop: scrolled ? "0.5rem" : "1rem",
        paddingBottom: scrolled ? "0.5rem" : "1rem",
        backgroundColor:
          theme === "dark"
            ? scrolled
              ? "#0f172a"
              : "#0f172a"
            : scrolled
            ? "#ffffff"
            : "#ffffff",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none"
      }}
      className={`${theme === "dark" ? "text-white" : "text-black"} px-6 sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className={`text-xl font-bold ${theme === "dark" ? "text-yellow-400 hover:text-yellow-300" : "text-yellow-600 hover:text-yellow-500"}`}
        >
          Star Wars Explorer
        </Link>
        <button
          className={`md:hidden ${theme === "dark" ? "text-gray-300 hover:text-yellow-400" : "text-gray-700 hover:text-yellow-600"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className={`space-y-2 md:space-y-0 md:space-x-4 md:flex text-sm md:text-base ${menuOpen ? "block" : "hidden md:block"}`}>
          {categories.map((cat) => {
            const isActive = location.pathname.startsWith(`/${cat}`);
            return (
              <Link
                key={cat}
                to={`/${cat}`}
                className={`block md:inline transition-colors ${
                  isActive
                    ? theme === "dark"
                      ? "text-yellow-400 font-semibold"
                      : "text-yellow-600 font-semibold"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-yellow-400"
                    : "text-gray-700 hover:text-yellow-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            className={`ml-2 px-3 py-1 rounded border ${theme === "dark" ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black" : "border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"}`}
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
