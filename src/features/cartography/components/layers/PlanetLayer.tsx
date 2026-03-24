"use client";

import Planet from "../planets/Planet";

const planets = [
 { name:"Coruscant", x:980, y:420, size:14 },
 { name:"Corellia", x:860, y:360, size:10 },
 { name:"Tatooine", x:640, y:520, size:8 },
 { name:"Yavin", x:1120, y:500, size:7 },
 { name:"Hoth", x:760, y:220, size:7 }
]

export default function PlanetLayer(){

  return (

    <g className="planetLayer">
      {planets.map(p => (
        <Planet key={p.name} {...p} />
      ))}
    </g>
  )
}