import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = ["films", "people", "planets", "species", "vehicles", "starships"];

type HomeProps = {
  theme: string;
};

const Home: React.FC<HomeProps> = ({ theme }) => (
  <motion.div
    className={`home-root ${theme}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="home-container">
      <h1 className={`home-title ${theme}`}>Explore the Star Wars Universe</h1>
      <p className={`home-description ${theme}`}>
        Browse Films, Characters, Starships, and more using live data from SWAPI.
      </p>
      <div className="home-category-list">
        {categories.map((cat) => (
          <Link key={cat} href={`/${cat}`} className={`home-category-link ${theme}`}>
            Explore {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  </motion.div>
);

export default Home;