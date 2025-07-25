import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';

const formatFieldName = (key: string): string =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

const Details: React.FC<{ item: { [key: string]: any }, theme: string }> = ({ item, theme }) => {
  const [resolved, setResolved] = useState<{ [key: string]: string }>({});

  // Helper function to check if a value should be displayed
  const hasValue = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (typeof value === 'string' && (value === 'n/a' || value === 'N/A' || value === 'unknown')) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (Array.isArray(value) && value.every(item => !item || item.trim() === '')) return false;
    return true;
  };

  // Helper function to check if a key should be hidden
  const shouldHideKey = (key: string): boolean => {
    const hiddenKeys = ['url', 'created', 'edited', 'name', 'title'];
    return hiddenKeys.includes(key.toLowerCase());
  };

  useEffect(() => {
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === "string" && value.startsWith("http")) {
        fetch(value)
          .then((res) => res.json())
          .then((data) => {
            setResolved((prev) => ({
              ...prev,
              [key]: data.name || data.title || value,
            }));
          })
          .catch(() => { });
      }
      if (Array.isArray(value)) {
        value.forEach((url: string, idx: number) => {
          if (typeof url === "string" && url.startsWith("http")) {
            fetch(url)
              .then((res) => res.json())
              .then((data) => {
                setResolved((prev) => ({
                  ...prev,
                  [`${key}_${idx}`]: data.name || data.title || url,
                }));
              })
              .catch(() => { });
          }
        });
      }
    });
  }, [item]);

  // Filter out keys without meaningful values and hidden keys
  const filteredEntries = Object.entries(item).filter(([key, value]) => 
    hasValue(value) && !shouldHideKey(key)
  );

  return (
    <div className={`details-grid ${theme}`}>
      {filteredEntries.map(([key, value]) => (
        <div key={key} className={`detail-item ${theme}`}>
          <div className={`detail-label ${theme}`}>
            {formatFieldName(key)}
          </div>
          <div className={`detail-value ${theme}`}>
            {typeof value === "string" && value.startsWith("http") ? (
              <span>{resolved[key] || "Loading..."}</span>
            ) : Array.isArray(value) ? (
              <div className="detail-list">
                {value.map((url: string, idx: number) =>
                  typeof url === "string" && url.startsWith("http") ? (
                    <span key={url} className="detail-list-item">
                      {resolved[`${key}_${idx}`] || "Loading..."}
                      {idx < value.length - 1 && ", "}
                    </span>
                  ) : (
                    <span key={idx} className="detail-list-item">
                      {url}
                      {idx < value.length - 1 && ", "}
                    </span>
                  )
                )}
              </div>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const DetailPage = ({ theme }: { theme: string }) => {
  const router = useRouter();
  const { category, id } = router.query;
  const [data, setData] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    if (category && id) {
      fetch(`https://swapi.info/api/${category}/${id}`)
        .then((res) => res.json())
        .then(setData)
        .catch(console.error);
    }
  }, [category, id]);

  return (
    <motion.div
      className={`detail-root ${theme}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {data ? (
        <div className={`detail-container ${theme}`}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="detail-header"
          >
            <h1 className={`detail-title ${theme}`}>{data.name || data.title}</h1>
            <div className={`detail-category-badge ${theme}`}>
              {String(category).charAt(0).toUpperCase() + String(category).slice(1)}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="detail-content"
          >
            <Details item={data} theme={theme} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="detail-actions"
          >
            <Link
              href={`/${category}`}
              className={`detail-back-button ${theme}`}
            >
              <span className="back-arrow">←</span>
              Back to {String(category).charAt(0).toUpperCase() + String(category).slice(1)}
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className={`detail-loading-container ${theme}`}>
          <div className={`detail-loading-spinner ${theme}`}></div>
          <p className={`detail-loading-text ${theme}`}>Loading details...</p>
        </div>
      )}
    </motion.div>
  );
};

export default DetailPage;