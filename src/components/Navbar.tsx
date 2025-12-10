// FILE: Navbar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

interface NavbarProps {
  theme: "light" | "dark";
}

const navItems = [
  { label: "Films", path: "/films" },
  { label: "People", path: "/people" },
  { label: "Planets", path: "/planets" },
  { label: "Species", path: "/species" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Starships", path: "/starships" }
];

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  return (
    <header className={`${styles.navWrapper} ${styles[theme]}`}>
      <nav className={styles.navbar}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
// FILE: Navbar.tsx