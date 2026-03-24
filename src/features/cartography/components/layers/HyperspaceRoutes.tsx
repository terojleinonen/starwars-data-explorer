"use client";

type Node = {
  id: string;
  x: number;
  y: number;
};

type Route = {
  id: string;
  from: string;
  to: string;
  label?: string;
  lift?: number;
};

const nodes: Node[] = [
  { id: "coruscant", x: 980, y: 420 },
  { id: "corellia", x: 860, y: 360 },
  { id: "tatooine", x: 640, y: 520 },
  { id: "yavin", x: 1120, y: 500 },
  { id: "hoth", x: 760, y: 220 },
];

const routes: Route[] = [
  { id: "r1", from: "coruscant", to: "corellia", label: "CORELLIAN RUN", lift: 40 },
  { id: "r2", from: "corellia", to: "tatooine", label: "OUTER RIM LANE", lift: 90 },
  { id: "r3", from: "coruscant", to: "yavin", label: "REBEL CORRIDOR", lift: 70 },
  { id: "r4", from: "corellia", to: "hoth", label: "MID RIM PATH", lift: 55 },
];

function getNode(id: string): Node | undefined {
  return nodes.find((n) => n.id === id);
}

function makeQuadraticPath(a: Node, b: Node, lift = 60): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - lift;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export default function HyperspaceRoutes() {
  return (
    <g className="hyperspaceRoutes">
      <defs>
        {routes.map((route) => {
          const from = getNode(route.from);
          const to = getNode(route.to);
          if (!from || !to) return null;

          return (
            <path
              key={`def-${route.id}`}
              id={`route-${route.id}`}
              d={makeQuadraticPath(from, to, route.lift ?? 60)}
              fill="none"
            />
          );
        })}
      </defs>

      {routes.map((route, index) => {
        const from = getNode(route.from);
        const to = getNode(route.to);
        if (!from || !to) return null;

        const d = makeQuadraticPath(from, to, route.lift ?? 60);

        return (
          <g key={route.id}>
            <path d={d} className="routeGlow" fill="none" />
            <path d={d} className="routeCore" fill="none" />

            {route.label && (
              <text className="routeLabel">
                <textPath
                  href={`#route-${route.id}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {route.label}
                </textPath>
              </text>
            )}

            <circle className="routePulse" r="2.5">
              <animateMotion
                dur={`${10 + index * 2}s`}
                repeatCount="indefinite"
                rotate="auto"
                path={d}
              />
            </circle>
          </g>
        );
      })}
    </g>
  );
}