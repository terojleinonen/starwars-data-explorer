// Hand-authored introduction copy. These sources support the historical framing;
// they are not runtime dependencies or permission to republish external assets.
export const eras = [
  {
    id: "lucas",
    label: "The Lucas years",
    eyebrow: "GEORGE LUCAS / THE FOUNDATION",
    title: "Where the galaxy began.",
    description: "A farm boy. A fallen knight. A rebellion against an empire. George Lucas’s six films built a modern mythology, and The Clone Wars opened new paths through it.",
    visual: "I — VI",
    visualLabel: "THE SIX-FILM FOUNDATION",
    themes: ["Original trilogy", "Prequel trilogy", "The Clone Wars"],
    note: "The original vision is part of today’s canon. The Lucas era and Legends are different classifications.",
    source: "https://www.starwars.com/news/the-legendary-star-wars-expanded-universe-turns-a-new-page",
    sourceLabel: "Lucasfilm’s continuity announcement, 2014",
  },
  {
    id: "disney",
    label: "The Disney years",
    eyebrow: "LUCASFILM AT DISNEY / THE EXPANSION",
    title: "New voices. Wider horizons.",
    description: "The sequel trilogy. Stories on the edges of the saga. From Rogue One to Andor and The Mandalorian, new filmmakers explore different corners of the same galaxy.",
    visual: "VII — IX",
    visualLabel: "THE SAGA CONTINUES. THE WORLD EXPANDS.",
    themes: ["Sequel trilogy", "Standalone films", "A growing series universe"],
    note: "Production era describes when and by whom a story was made. Canon and Legends describe its continuity.",
    source: "https://www.lucasfilm.com/who-we-are/our-story/",
    sourceLabel: "Lucasfilm’s production history",
  },
] as const;
