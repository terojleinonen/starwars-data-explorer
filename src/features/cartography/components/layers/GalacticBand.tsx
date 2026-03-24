"use client";

function seededRandom(seed:number){
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function GalacticBand(){

  const stars=[]

  const count=140

  for(let i=0;i<count;i++){

    const x=seededRandom(i)*1600
    const y=420+(seededRandom(i+1)-0.5)*240
    const r=0.4+seededRandom(i+2)*1.2

    stars.push(

      <circle
        key={i}
        cx={x}
        cy={y}
        r={r}
        className="galacticStar"
      />

    )

  }

  return (

    <g className="galacticDisc" transform="rotate(-12 800 450)">

      <ellipse
        cx="800"
        cy="450"
        rx="900"
        ry="260"
        className="galaxyHalo"
      />

      <ellipse
        cx="800"
        cy="450"
        rx="650"
        ry="140"
        className="galaxyCore"
     />
      {stars}
    </g>
  )
}