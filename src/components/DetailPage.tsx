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

  // Filter out keys without meaningful values
  const filteredEntries = Object.entries(item).filter(([key, value]) => hasValue(value));

  return (
    <div className={`details-root ${theme}`}>
      {filteredEntries.map(([key, value]) => (
        <div key={key} className="details-field">
          <span className={`details-field-name ${theme}`}>{formatFieldName(key)}: </span>
          {typeof value === "string" && value.startsWith("http") ? (
            <span className={`details-field-value ${theme}`}>{resolved[key] || "Loading..."}</span>
          ) : Array.isArray(value) ? (
            value.map((url: string, idx: number) =>
              typeof url === "string" && url.startsWith("http") ? (
                <span key={url} className={`details-field-value ${theme}`}>{resolved[`${key}_${idx}`] || "Loading..."}, </span>
              ) : (
                <span key={idx} className={`details-field-value ${theme}`}>{url}, </span>
              )
            )
          ) : (
            <span className={`details-field-value ${theme}`}>{String(value)}</span>
          )}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {data ? (
        <div className={`detail-container ${theme}`}>
          <h2 className={`detail-title ${theme}`}>{data.name || data.title}</h2>
          <div className="detail-fields">
            <Details item={data} theme={theme} />
          </div>
          <Link
            href={`/${category}`}
            className={`detail-back-link ${theme}`}
          >
            ← Back to {category}
          </Link>
        </div>
      ) : (
        <p className={`detail-loading ${theme}`}>Loading...</p>
      )}
    </motion.div>
  );
};

export default DetailPage;