"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { eras } from "@/content/eras";
import { Arrow } from "./icons";

export default function EraExplorer() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = (index + 1) % eras.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = eras.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="era-explorer">
      <div className="era-tabs" role="tablist" aria-label="Creative eras">
        {eras.map((era, index) => (
          <button key={era.id} id={`tab-${era.id}`} role="tab" aria-selected={selected === index}
            aria-controls={`panel-${era.id}`} tabIndex={selected === index ? 0 : -1}
            ref={(node) => { tabRefs.current[index] = node; }}
            onKeyDown={(event) => onKeyDown(event, index)} onClick={() => setSelected(index)}>
            <span className="tab-index">0{index + 1}</span>{era.label}<Arrow diagonal />
          </button>
        ))}
      </div>
      {eras.map((era, index) => (
        <div key={era.id} role="tabpanel" id={`panel-${era.id}`} aria-labelledby={`tab-${era.id}`}
          hidden={selected !== index} tabIndex={0} className={`era-panel era-${era.id}`}>
          <div className="era-art" aria-hidden="true">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <span className="era-star star-one">+</span><span className="era-star star-two">+</span>
            <span className="era-art-kicker">A CONTINUING STORY</span>
            <span className="era-numeral">{era.visual}</span>
            <span className="era-art-caption">{era.visualLabel}</span>
            <span className="era-art-coordinate">CREATIVE ERA / 0{index + 1}</span>
          </div>
          <div className="era-copy">
            <p className="eyebrow">{era.eyebrow}</p>
            <h3>{era.title}</h3>
            <p className="era-description">{era.description}</p>
            <ul className="era-themes">{era.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
            <p className="era-note">{era.note}</p>
            <a className="text-link" href={era.source} target="_blank" rel="noreferrer">
              Read the source <Arrow diagonal /><span className="sr-only">: {era.sourceLabel} (opens in a new tab)</span>
            </a>
          </div>
        </div>
      ))}
      <noscript><p className="no-script-note">This era selector uses JavaScript. Both eras are covered in <a href="https://www.lucasfilm.com/who-we-are/our-story/">Lucasfilm’s production history</a>.</p></noscript>
    </div>
  );
}
