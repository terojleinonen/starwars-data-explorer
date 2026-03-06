export default function GalacticGrid(){

  const cols = ["A","B","C","D","E","F","G","H"]
  const rows = ["1","2","3","4","5","6"]
  const w = 1600 / cols.length
  const h = 900 / rows.length

  return (
    <g className="galacticGrid">
      {cols.map((_, i)=>(
        <line
          key={i}
          x1={i*w}
          y1="0"
          x2={i*w}
          y2="900"
          className="gridLine"
        />
      ))}
      {rows.map((_, i)=>(
        <line
          key={i}
          x1="0"
          y1={i*h}
          x2="1600"
          y2={i*h}
          className="gridLine"
        />
      ))}
    </g>
  )
}