import React from "react";

export type HoloIconName =
  | "people"
  | "planets"
  | "starships"
  | "films"
  | "species"
  | "vehicles";

type Props = {
  name: HoloIconName;
  className?: string;
  title?: string;
};

export default function HoloIcon({ name, className, title }: Props) {
  const common = {
    className,
    role: "img" as const,
    "aria-label": title ?? name,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case "people":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M20 34c-6 0-10 3.6-10 8.5V48h20v-5.5C30 37.6 26 34 20 34z" />
            <path d="M20 18a7 7 0 1 0 0 14a7 7 0 0 0 0-14z" />
            <path d="M44 36c-5 0-8.5 3-8.5 7.2V48H54v-4.8C54 39 49.8 36 44 36z" opacity="0.75" />
            <path d="M44 20a6 6 0 1 0 0 12a6 6 0 0 0 0-12z" opacity="0.75" />
            <path d="M10 50h44" opacity="0.55" />
          </g>
        </svg>
      );

    case "planets":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <circle cx="30" cy="32" r="12" />
            <path d="M18 32c0 5.5 5.4 10 12 10" opacity="0.7" />
            <path d="M8 30c8-7 22-12 34-12c8 0 13.5 2.2 14 5.7c.6 4-5.8 8.7-15.8 12.2C30.5 39.8 16.8 42.2 8 38" />
            <path d="M10 44c11 4 28 2 42-6" opacity="0.55" />
          </g>
        </svg>
      );

    case "starships":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M12 38l18-18h12l10 10v8L40 52H24L12 40v-2z" />
            <path d="M30 20l14 14" opacity="0.7" />
            <path d="M26 46l-8-8" opacity="0.7" />
            <path d="M52 30l6-2v8l-6-2" opacity="0.8" />
            <path d="M6 42l6-2v8l-6-2" opacity="0.55" />
          </g>
        </svg>
      );

    case "films":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <rect x="14" y="18" width="36" height="28" rx="3.5" />
            <path d="M14 26h36" opacity="0.7" />
            <path d="M20 18v8M28 18v8M36 18v8M44 18v8" opacity="0.65" />
            <path d="M26 32l14 8l-14 8v-16z" opacity="0.85" />
          </g>
        </svg>
      );

    case "species":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M22 16c10 6 10 26 0 32" />
            <path d="M42 16c-10 6-10 26 0 32" />
            <path d="M22 24h20M22 32h20M22 40h20" opacity="0.7" />
            <path d="M18 52h28" opacity="0.55" />
            <path d="M20 52l-4-6M40 52l4-6" opacity="0.55" />
          </g>
        </svg>
      );

    case "vehicles":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M14 40l6-12h24l6 12" />
            <path d="M12 40h40v8H12v-8z" />
            <path d="M18 48a4 4 0 1 0 0.01 0zM46 48a4 4 0 1 0 0.01 0z" opacity="0.75" />
            <path d="M26 28l-4 12M38 28l4 12" opacity="0.65" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}