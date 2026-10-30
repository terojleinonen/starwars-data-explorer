import type { Category } from "@/lib/archive/types";

type AtmosphereTheme = Category | "archive";
const artwork: Record<AtmosphereTheme, string> = {
  films: "films-dawn",
  series: "series-transmissions",
  people: "people-copper",
  planets: "worlds-observatory",
  starships: "starships-hangar",
  vehicles: "vehicles-dust",
  species: "species-forest",
  archive: "galaxy",
};

/** One decorative responsive image, rendered on the server and outside page flow. */
export default function ArchiveAtmosphere({ theme }: { theme: AtmosphereTheme }) {
  const base = artwork[theme];
  const variants = (format: string) =>
    [800, 1200, 1672].map(width => `/images/${base}-${width}.${format} ${width}w`).join(", ");

  return (
    <div className="archive-atmosphere" data-theme={theme} aria-hidden="true">
      <picture>
        <source type="image/avif" srcSet={variants("avif")} sizes="100vw" />
        <img
          src={`/images/${base}-1200.webp`}
          srcSet={variants("webp")}
          sizes="100vw"
          width={1672}
          height={941}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="archive-atmosphere-shade" />
    </div>
  );
}
