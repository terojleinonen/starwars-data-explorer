import type { Category } from "@/lib/archive/types";

export default function ArchiveGlyph({category,className=""}:{category:Category;className?:string}) {
  return <svg className={`archive-glyph ${className}`} viewBox="0 0 300 240" fill="none" aria-hidden="true">
    <path className="glyph-grid" d="M0 60h300M0 120h300M0 180h300M75 0v240M150 0v240M225 0v240" />
    <path className="glyph-cross" d="M18 16v12m-6-6h12m258 190v12m-6-6h12" />
    {category === "planets" ? <><circle cx="150" cy="120" r="65"/><ellipse cx="150" cy="120" rx="126" ry="29" transform="rotate(-24 150 120)"/><path d="M96 85c34 16 73 17 108 0M86 118h128M97 155c31-15 72-15 107 0M150 55c-44 35-44 95 0 130M150 55c44 35 44 95 0 130"/></>
      :category === "people" ? <><circle cx="150" cy="89" r="27"/><path d="M99 174v-14c0-26 23-47 51-47s51 21 51 47v14M65 49h35M65 49v35M235 49h-35M235 49v35M65 191h35M65 191v-35M235 191h-35M235 191v-35"/><circle className="glyph-faint" cx="150" cy="120" r="101"/></>
      :category === "starships" || category === "vehicles" ? <><path d={category==="starships"?"M150 37 194 116 247 156 182 157 165 199 150 177 135 199 118 157 53 156 106 116Z":"M62 104h176v56H62zM91 104V82h91l34 22M96 160v20m108-20v20M45 191h210"}/><path d="M150 22v196M27 120h246M52 45v16m-8-8h16M247 45v16m-8-8h16" className="glyph-faint"/></>
      :category==="species" ? <><path d="M104 29c111 60-19 124 92 184M196 29C85 89 215 153 104 213M117 50h66m-58 26h50m-54 28h58m-58 29h58m-53 28h48m-57 28h66"/><circle cx="150" cy="120" r="97" className="glyph-faint"/></>
      :<><rect x="58" y="53" width="184" height="135" rx="3"/><path d="m134 88 47 32-47 32ZM73 53v135M227 53v135M58 73h15m-15 29h15m-15 29h15m-15 29h15m154-87h15m-15 29h15m-15 29h15m-15 29h15"/>{category==="series"&&<path d="M80 204h140M94 218h112"/>}</>}
  </svg>;
}
