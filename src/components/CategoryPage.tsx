import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";

export interface CategoryPageProps {
  category?: string | string[];
  theme: string;
}

const CategoryPage = ({ theme }: CategoryPageProps) => {
  const router = useRouter();
  const { category } = router.query;
  type Item = {
    name?: string;
    title?: string;
    url?: string;
    episode_id?: number;
    [key: string]: any;
  };
  
  const [data, setData] = useState<Item[]>([]);

  // Mapping film titles to poster images
  const getFilmPoster = (item: Item): string | null => {
    if (category !== 'films') return null;
    
    const episodeId = item.episode_id;
    if (episodeId && episodeId >= 1 && episodeId <= 6) {
      return `/images/posters/episode-${episodeId}.svg`;
    }
    
    // Fallback mapping by title if episode_id is not available
    const title = item.title?.toLowerCase() || '';
    if (title.includes('phantom menace')) return '/images/posters/episode-1.svg';
    if (title.includes('attack of the clones')) return '/images/posters/episode-2.svg';
    if (title.includes('revenge of the sith')) return '/images/posters/episode-3.svg';
    if (title.includes('new hope')) return '/images/posters/episode-4.svg';
    if (title.includes('empire strikes back')) return '/images/posters/episode-5.svg';
    if (title.includes('return of the jedi')) return '/images/posters/episode-6.svg';
    
    return null;
  };

  useEffect(() => {
    if (category) {
      fetch(`https://swapi.info/api/${category}`)
        .then((res) => res.json())
        .then((res) => setData(Array.isArray(res) ? res : res.results || []))
        .catch(() => {});
    }
  }, [category]);

  return (
    <motion.div
      className={`category-root ${theme}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="category-container">
        <h2 className={`category-title ${theme}`}>{category}</h2>
        <div className="category-list">
          {data && data.length > 0 ? (
            data.map((item, idx) => {
              const id = item.url?.split("/").filter(Boolean).pop();
              const posterUrl = getFilmPoster(item);
              const isFilm = category === 'films';
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className={`category-card ${theme} ${isFilm ? 'film-card' : ''}`}
                >
                  <Link
                    href={`/${category}/${id}`}
                    className={`category-card-link ${theme} ${isFilm ? 'film-card-link' : ''}`}
                    style={isFilm && posterUrl ? {
                      backgroundImage: `url(${posterUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    } : {}}
                  >
                    <div className={`card-content ${isFilm ? 'film-content-overlay' : ''}`}>
                      <h3 className={`category-card-title ${theme}`}>{item.name || item.title}</h3>
                      {isFilm && item.episode_id && (
                        <p className={`episode-number ${theme}`}>Episode {item.episode_id}</p>
                      )}
                      <p className={`category-card-desc ${theme}`}>
                        {isFilm ? 'Click to explore' : 'Click for details'}
                      </p>
                    </div>
                    {isFilm && (
                      <div className="film-overlay"></div>
                    )}
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className={`category-empty ${theme}`}>
              <p>No data found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryPage;