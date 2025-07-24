import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const categories = ["films", "people", "planets", "species", "vehicles", "starships"];

interface NavbarProps {
  theme: string;
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  return (
    <nav className={`navbar-root ${theme} ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className={`navbar-title ${theme}`}>
          Star Wars Explorer
        </Link>
        <button
          type="button"
          className={`navbar-menu-btn ${theme} md:hidden`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className={`space-y-2 md:space-y-0 md:space-x-4 md:flex text-sm md:text-base ${menuOpen ? "block" : "hidden md:block"}`}>
          {categories.map((cat) => {
            const isActive = router.pathname.startsWith(`/${cat}`);
            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`navbar-link ${theme} ${isActive ? "active" : ""} block md:inline transition-colors`}
                onClick={() => setMenuOpen(false)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;