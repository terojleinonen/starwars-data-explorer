// FILE: CategoryPage.tsx
// Super-premium category grid page using SWAPI

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface CategoryPageProps {
  theme: "light" | "dark";
}

const API_BASE = "https://swapi.info/api";

const CategoryPage: React.FC<CategoryPageProps> = ({ theme }) => {
  const { category } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/${category}`);
        if (!res.ok) throw new Error("Failed to fetch SWAPI list");
        const json = await res.json();
        setItems(json.results || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const isDark = theme === "dark";
  const title =
    (category && category.charAt(0).toUpperCase() + category.slice(1)) ||
    "Category";

  return (
    <div className="px-4 pb-16 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header band (simple version – PlanetHeader is for detail view) */}
        <div
          className={`mb-8 overflow-hidden rounded-3xl border px-5 py-6 sm:px-8 sm:py-8 ${
            isDark
              ? "border-slate-700/80 bg-slate-950/80 backdrop-blur-xl"
              : "border-slate-200 bg-slate-50/80 backdrop-blur-xl"
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
            <div className="space-y-2">
              <div className="text-[0.65rem] uppercase tracking-[0.4em] text-sky-400/80">
                SWAPI · Category
              </div>
              <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl md:text-4xl">
                {title}
              </h1>
              <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
                Browse all {title.toLowerCase()} records exposed via SWAPI. Select a
                record to open a full starship-grade detail console.
              </p>
            </div>
            <div className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
              Total records:{" "}
              {loading ? "…" : items.length ? items.length : "No data"}
            </div>
          </div>
        </div>

        {/* Status messages */}
        {loading && (
          <div className="mb-4 text-sm text-slate-400">
            Retrieving records from SWAPI…
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            Transmission error: {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            !error &&
            items.map((item, idx) => {
              const id =
                item.url?.split("/").filter(Boolean).pop() ?? String(idx);
              const name =
                item.name || item.title || `Record ${id}`;

              // A tiny helper summary
              const secondary =
                item.model ||
                item.classification ||
                item.director ||
                item.climate ||
                item.gender ||
                item.starship_class ||
                "";

              return (
                <Link
                  key={id}
                  to={`/${category}/${id}`}
                  className={`group block rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                    isDark
                      ? "border-slate-700/80 bg-slate-900/80 hover:border-sky-400/70"
                      : "border-slate-200 bg-slate-50/80 hover:border-sky-500/60"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                      Record
                    </div>
                    <div className="text-[0.65rem] text-slate-400">
                      ID: {id}
                    </div>
                  </div>
                  <div className="mb-1 text-base font-semibold tracking-wide sm:text-lg">
                    {name}
                  </div>
                  {secondary && (
                    <div className="mb-1 text-xs text-slate-400 group-hover:text-slate-200">
                      {secondary}
                    </div>
                  )}
                  <div className="mt-2 text-[0.7rem] uppercase tracking-[0.25em] text-sky-400/90">
                    Open detail console →
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
