import type { ArchiveRecord } from "./types";

type MotifShape =
  | { tag: "path"; d: string; className: string }
  | { tag: "circle"; cx: number; cy: number; r: number; className: string };
type TitleLine = { text: string; kind?: "small" | "secondary" };
export type TitleCardDesign = {
  id: string;
  accent: string;
  paper: string;
  surface: string;
  glow?: string;
  typography: readonly [number, number, number];
  lines: TitleLine[];
  motifs: MotifShape[];
};
const path = (d: string, className = "motif-thread"): MotifShape => ({ tag: "path", d, className });
const circle = (cx: number, cy: number, r: number, className = "motif-orbit"): MotifShape => ({ tag: "circle", cx, cy, r, className });
const line = (text: string, kind?: TitleLine["kind"]): TitleLine => ({ text, kind });
const design = (value: Omit<TitleCardDesign, "paper" | "typography"> & Partial<Pick<TitleCardDesign, "paper" | "typography">>): TitleCardDesign => ({ paper: "#eee9dd", typography: [28, 23, 54], ...value });

/** Authored per work, rather than assigning colors or motifs randomly. */
export const titleCardDesigns: Record<string, TitleCardDesign> = {
  "films/a-new-hope": design({
    id: "hope", accent: "#e1ba79", paper: "#f1eadb", surface: "#101110", typography: [32, 25, 58],
    glow: "radial-gradient(ellipse at 71% 26%, #dba95828, transparent 36%)",
    lines: [line("A NEW"), line("HOPE.")],
    motifs: [circle(167,88,40),circle(167,88,62,"motif-orbit motif-faint"),path("M167 19v25m0 88v24M99 88h24m88 0h23","motif-faint"),path("m43 264 124-176","motif-ray"),circle(167,88,5,"motif-light")],
  }),
  "films/the-empire-strikes-back": design({
    id: "empire", accent: "#b4d7e5", paper: "#e1edf0", surface: "linear-gradient(147deg, #26353e, #101a23 50%, #0c141c)", typography: [30,24,56],
    glow: "linear-gradient(147deg, transparent 27%, #b3d8ed14 28%, transparent 61%)",
    lines: [line("THE","small"),line("EMPIRE"),line("STRIKES BACK","secondary")],
    motifs: [path("M62 0H240v91L0 240v-63L172 66Z","motif-plane"),path("M-24 235 255 62","motif-cut"),path("M-24 245 255 72M19 135l71-44M147 55l42-26","motif-faint"),path("M211 25v32m-16-16h32","motif-faint")],
  }),
  "films/return-of-the-jedi": design({
    id: "jedi", accent: "#b6caa0", surface: "linear-gradient(155deg, #263329, #111b18 60%, #0d1513)", typography: [30,24,56],
    lines: [line("RETURN"),line("OF THE","small"),line("JEDI.")],
    motifs: [path("M66 158a91 91 0 0 1 182 0","motif-bold"),path("M84 158a73 73 0 0 1 146 0M103 158a54 54 0 0 1 108 0"),path("M157 26V9m-70 45-12-12m152 12 12-12M62 158H43m205 0h15","motif-faint"),path("M157 158V78","motif-cut"),circle(157,78,3,"motif-light")],
  }),
  "films/the-phantom-menace": design({
    id: "phantom", accent: "#c6a4b0", surface: "linear-gradient(135deg, #322832, #1a1720 65%, #11131a)", typography: [25,20,46],
    lines: [line("THE","small"),line("PHANTOM"),line("MENACE.")],
    motifs: [circle(158,86,43,"motif-orbit"),circle(181,86,43,"motif-slab"),path("M117 86h107M158 30v112","motif-faint"),path("m177 127-81 148M194 124l-37 151","motif-thread"),circle(117,86,2,"motif-light")],
  }),
  "films/attack-of-the-clones": design({
    id: "clones", accent: "#a4c6c2", surface: "linear-gradient(145deg, #203639, #15252a 60%, #11191e)", typography: [29,23,54],
    lines: [line("ATTACK"),line("OF THE","small"),line("CLONES.")],
    motifs: [path("M73 43h18v111H73zM106 43h18v111h-18zM139 43h18v111h-18zM172 43h18v111h-18zM205 43h18v111h-18z","motif-plane"),path("M73 74h150M73 123h150"),path("M73 43h18m15 0h18m15 0h18m15 0h18m15 0h18","motif-bold"),path("M62 167h173M62 172h50","motif-faint")],
  }),
  "films/revenge-of-the-sith": design({
    id: "sith", accent: "#dc9276", surface: "linear-gradient(148deg, #392925, #211817 60%, #151316)", typography: [27,21,50],
    lines: [line("REVENGE"),line("OF THE","small"),line("SITH.")],
    motifs: [path("M177-8l-27 66 33 31-57 49 24 28-76 124","motif-bold"),path("M185-8l-27 65 34 32-56 49 24 26-73 126","motif-faint"),path("M188 39l28-11M182 92l48 18M137 143l-32-7"),path("m143 72 10 13-23 31 9-31z","motif-slab")],
  }),
  "films/the-clone-wars": design({
    id: "clone-feature", accent: "#d9c18b", surface: "linear-gradient(140deg, #313032, #1b2027 65%, #131a21)", typography: [30,24,56],
    lines: [line("THE","small"),line("CLONE"),line("WARS.")],
    motifs: [circle(138,89,43),circle(180,89,43),path("M122 53h75m-84 19h96m-103 19h110m-103 19h96m-84 19h75","motif-faint"),path("M159 26v126","motif-bold"),circle(159,89,3,"motif-light")],
  }),
  "films/the-force-awakens": design({
    id: "awakens", accent: "#bed5e3", surface: "linear-gradient(150deg, #263344, #182232 55%, #101923)", typography: [27,21,50],
    lines: [line("THE","small"),line("FORCE"),line("AWAKENS.")],
    motifs: [circle(165,89,52,"motif-orbit motif-faint"),path("M165 25v128M101 89h128","motif-bold"),path("m137 61 56 56m-56 0 56-56","motif-faint"),path("m165 66 6 17 17 6-17 6-6 17-6-17-17-6 17-6z","motif-slab"),circle(165,89,3,"motif-light")],
  }),
  "films/rogue-one": design({
    id: "rogue", accent: "#bfc8a5", surface: "linear-gradient(145deg, #2c332b, #1a211f 60%, #111918)", typography: [32,28,64],
    lines: [line("ROGUE"),line("ONE.")],
    motifs: [path("M169-8v69m0 28v75m0 26v130","motif-bold"),path("M158-8v328","motif-faint"),circle(169,76,14,"motif-orbit"),path("m120 32 49 44 61-52M103 117l66-41 71 53"),path("M108 165h28m58 0h28","motif-faint")],
  }),
  "films/the-last-jedi": design({
    id: "last-jedi", accent: "#de9891", surface: "linear-gradient(145deg, #382429, #24171e 60%, #18131a)", typography: [34,29,68],
    lines: [line("THE","small"),line("LAST"),line("JEDI.")],
    motifs: [circle(166,90,51,"motif-orbit"),path("M0 77h240v26H0z","motif-plane"),path("M0 90h240","motif-bold"),path("m132 51 68 78M166 28v124","motif-faint"),circle(166,90,3,"motif-light")],
  }),
  "films/solo": design({
    id: "solo", accent: "#dcba82", surface: "linear-gradient(142deg, #39342c, #20242b 62%, #161e27)", typography: [40,36,82],
    lines: [line("SOLO.")],
    motifs: [path("M38 159 98 114l33 17 66-73 44 10","motif-bold"),path("M38 169 99 124l34 17 65-73 43 10","motif-faint"),circle(98,114,4,"motif-light"),circle(131,131,3,"motif-light"),circle(197,58,4,"motif-light"),path("M72 62h31m-31 6h12M177 162h40","motif-faint")],
  }),
  "films/the-rise-of-skywalker": design({
    id: "skywalker", accent: "#c0b3df", surface: "linear-gradient(140deg, #302f42, #1e2032 60%, #151929)", typography: [32,27,62],
    lines: [line("THE","small"),line("RISE"),line("OF SKYWALKER","secondary")],
    motifs: [path("M99 160 132 113l-14-44 61-37 37 51-31 47 6 37"),circle(99,160,2,"motif-light"),circle(132,113,3,"motif-light"),circle(118,69,2,"motif-light"),circle(179,32,4,"motif-light"),circle(216,83,2,"motif-light"),circle(185,130,2,"motif-light"),path("M173 32h12m-6-6v12","motif-faint")],
  }),
  "films/the-mandalorian-and-grogu": design({
    id: "grogu", accent: "#abc2a5", surface: "linear-gradient(145deg, #30382d, #222820 58%, #181e1b)", typography: [19,16.5,39],
    lines: [line("THE","small"),line("MANDALORIAN"),line("AND GROGU.")],
    motifs: [circle(148,84,32,"motif-metal"),circle(203,110,12,"motif-metal"),path("M92 129c21 23 65 28 104 14 28-10 39-25 32-37"),path("m171 105 20 1","motif-faint"),circle(203,110,3,"motif-light"),path("M98 49h12m-6-6v12","motif-faint")],
  }),
  "series/clone-wars-2d-micro-series": design({
    id: "clone-micro", accent: "#ddb185", surface: "linear-gradient(145deg, #3a302c, #272323 60%, #1b1b20)", typography: [28,24,56],
    lines: [line("CLONE"),line("WARS"),line("2D MICRO-SERIES","secondary")],
    motifs: [path("m100 25 20 6-37 145-20-5zM176 33l20 5-37 145-20-5z","motif-plane"),path("m97 25-37 145M173 33l-37 145","motif-bold"),path("M50 126h160m-155 7h80","motif-faint"),path("m85 84 108 15" )],
  }),
  "series/the-clone-wars": design({
    id: "clone-series", accent: "#9ab8d3", surface: "linear-gradient(145deg, #2c3745, #1b2635 60%, #121d2a)", typography: [30,24,56],
    lines: [line("THE","small"),line("CLONE"),line("WARS.")],
    motifs: [path("M71 142V76l47-32 47 32v66M101 154V88l47-32 47 32v66M131 166v-66l47-32 47 32v66","motif-thread"),path("M118 44v82m30-70v82m30-70v82","motif-faint"),path("m71 76 47 25 47-25m-64 12 47 25 47-25m-64 12 47 25 47-25","motif-bold")],
  }),
  "series/star-wars-rebels": design({
    id: "rebels", accent: "#dba487", surface: "linear-gradient(140deg, #392d35, #272333 65%, #191d2b)", typography: [32,28,66],
    lines: [line("STAR WARS","small"),line("REBELS.")],
    motifs: [path("M165 151 165 25m-10 126L117 42m27 109L80 71m96 80 38-109m-27 109 64-80","motif-thread"),path("M107 129c23 13 94 13 117-2","motif-bold"),path("M101 139c32 15 104 14 130-3","motif-faint"),circle(165,151,4,"motif-light")],
  }),
  "series/the-mandalorian": design({
    id: "mandalorian", accent: "#c5b18a", paper: "#e9dfc9", surface: "linear-gradient(0deg, #151411, #28261f)", typography: [19,16.5,39],
    glow: "radial-gradient(ellipse at 65% 32%, #d0bb8230, transparent 42%)",
    lines: [line("THE","small"),line("MANDALORIAN.")],
    motifs: [circle(158,88,28,"motif-metal"),path("M130 88h56m-28-28v56","motif-faint"),path("M-10 149c41 7 54-12 89-6s51 8 82-1 64-9 90 0","motif-horizon"),path("M-10 167c36 3 54-12 85-8s47 10 81 2 65-13 95-8M-10 178c43 2 64-8 93-4s51 6 78 0 53-10 90-7","motif-faint"),path("M21 221h35m4 0h7m-46 8h18","motif-faint")],
  }),
  "series/the-bad-batch": design({
    id: "bad-batch", accent: "#b7c4a9", surface: "linear-gradient(145deg, #303731, #202725 60%, #171f20)", typography: [32,27,64],
    lines: [line("THE","small"),line("BAD"),line("BATCH.")],
    motifs: [path("M74 61v87m27-108v108m27-98v98m27-113v113m27-84v32m0 18v49","motif-bold"),path("M62 165h139M62 171h87","motif-faint"),path("M68 58h12m15-21h12m15 10h12m15-15h12m15 29h12","motif-thread"),circle(182,103,2,"motif-light")],
  }),
  "series/andor": design({
    id: "andor", accent: "#d97968", paper: "#eae7dd", surface: "linear-gradient(135deg, #242525, #121516)", typography: [38,31,74],
    glow: "radial-gradient(ellipse at 71% 25%, #c4523b1c, transparent 50%)",
    lines: [line("ANDOR.")],
    motifs: [path("M0 42h240M0 74h240M0 106h240M0 138h240M0 170h240M0 202h240M0 234h240M0 266h240M0 298h240M30 0v320M62 0v320M94 0v320M126 0v320M158 0v320M190 0v320M222 0v320","motif-grid"),path("M176-8v70l-48 48v37m0 24v31l48 48v78","motif-signal"),path("M183-8v73l-48 48v34m0 24v28l48 48v81","motif-signal-echo"),circle(128,158,2,"motif-light")],
  }),
  "series/obi-wan-kenobi": design({
    id: "kenobi", accent: "#d3bb9e", surface: "linear-gradient(140deg, #34343b, #262735 62%, #191e2b)", typography: [28,22,52],
    lines: [line("OBI-WAN"),line("KENOBI.")],
    motifs: [path("M57 157a101 101 0 0 1 202 0M76 157a82 82 0 0 1 164 0"),path("M57 157h202","motif-faint"),path("M83 173 222 43","motif-bold"),circle(158,57,3,"motif-light"),path("M73 137h34m107 0h30","motif-faint")],
  }),
  "series/ahsoka": design({
    id: "ahsoka", accent: "#d6cbb4", surface: "linear-gradient(140deg, #293937, #1c2c2e 60%, #142125)", typography: [34,29,70],
    lines: [line("AHSOKA.")],
    motifs: [path("M79 41c-7 63 40 105 98 130M229 35c8 63-41 106-99 135","motif-bold"),path("M90 38c-6 52 32 90 86 119M218 32c6 53-33 91-87 120","motif-faint"),path("m154 68 9 12-9 12-9-12z","motif-thread"),path("M154 21v27","motif-faint")],
  }),
  "series/skeleton-crew": design({
    id: "skeleton", accent: "#9dc7d2", surface: "linear-gradient(140deg, #2b3447, #1c283a 62%, #142232)", typography: [24,20,46],
    lines: [line("SKELETON"),line("CREW.")],
    motifs: [path("m98 65 88-31 36 98-104 22z"),path("m98 65 124 67M186 34l-68 120","motif-faint"),circle(98,65,4,"motif-light"),circle(186,34,3,"motif-light"),circle(222,132,4,"motif-light"),circle(118,154,3,"motif-light"),path("M94 65h8m-4-4v8M218 132h8m-4-4v8","motif-faint")],
  }),
  "series/the-acolyte": design({
    id: "acolyte", accent: "#b6a0ca", surface: "linear-gradient(140deg, #382d43, #281e34 62%, #1d182b)", typography: [28,23,54],
    lines: [line("THE","small"),line("ACOLYTE.")],
    motifs: [path("M207 119a52 52 0 1 0-17 17","motif-bold"),path("M198 111a40 40 0 1 0-16 16","motif-faint"),circle(168,84,15,"motif-plane"),path("M133 27 201 147"),circle(201,147,3,"motif-light")],
  }),
  "series/maul-shadow-lord": design({
    id: "maul", accent: "#d18d80", surface: "linear-gradient(140deg, #3b2932, #2a1e2a 62%, #1b1925)", typography: [36,31,72],
    lines: [line("MAUL"),line("SHADOW LORD","secondary")],
    motifs: [path("M104 24 81 83l48 29-36 70M161 22l-23 59 48 29-36 70M218 20l-23 59 48 29-36 70","motif-bold"),path("M99 20 76 79l48 29-36 70M156 18l-23 59 48 29-36 70","motif-faint"),path("M91 199h136","motif-faint")],
  }),
};

export function titleCardDesign(record: Pick<ArchiveRecord, "category" | "slug">): TitleCardDesign | undefined {
  return titleCardDesigns[`${record.category}/${record.slug}`];
}
