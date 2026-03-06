export default function CartographyGrid(){

  return (

    <g className="cartographyGrid">
      <defs>
        <pattern
          id="cartoGrid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            opacity=".25"
          />
        </pattern>
      </defs>
      <rect
        width="1600"
        height="900"
        fill="url(#cartoGrid)"
      />
    </g>
  )
}