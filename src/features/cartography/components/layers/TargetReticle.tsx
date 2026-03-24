export default function TargetReticle(){

  return (
    <svg
      className="targetReticle"
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
    >

      {/* outer ring */}
      <circle
        cx="800"
        cy="450"
        r="160"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".25"
      />

      {/* inner ring */}
      <circle
        cx="800"
        cy="450"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".35"
      />

      {/* crosshair horizontal */}
      <line
        x1="760"
        y1="450"
        x2="840"
        y2="450"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* crosshair vertical */}
      <line
        x1="800"
        y1="410"
        x2="800"
        y2="490"
        stroke="currentColor"
        strokeWidth="1"
      />

    </svg>
  )
}