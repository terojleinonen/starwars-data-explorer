// FILE: ThreePlanet.tsx
// Strict TypeScript + React Three Fiber + FBM 3D Perlin shader planet

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, Mesh, BackSide, ShaderMaterial } from "three";

export type Theme = "light" | "dark";

interface PlanetProps {
  theme: Theme;
}

//---------------------------------------------
// Planet Mesh Component
//---------------------------------------------
const PlanetMesh: React.FC<PlanetProps> = ({ theme }) => {
  const planetRef = useRef<Mesh | null>(null);
  const atmosphereRef = useRef<Mesh | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.06;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = t * 0.03;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = t;
    }
  });

  const isDark = theme === "dark";

  const baseColor = new Color(isDark ? "#0b1120" : "#1e3a8a");
  const highlightColor = new Color(isDark ? "#38bdf8" : "#0ea5e9");

  return (
    <>
      {/* Planet sphere with FBM 3D Perlin shader */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            u_time: { value: 0 },
            u_color1: { value: baseColor },
            u_color2: { value: highlightColor },
          }}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vPosition;

            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            precision highp float;

            uniform float u_time;
            uniform vec3 u_color1;
            uniform vec3 u_color2;

            varying vec2 vUv;
            varying vec3 vPosition;

            // 3D Perlin noise (Stefan Gustavson style)
            vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

            float perlin3d(vec3 P){
              vec3 Pi0 = floor(P);        // Integer part for indexing
              vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
              Pi0 = mod(Pi0, 289.0);
              Pi1 = mod(Pi1, 289.0);
              vec3 Pf0 = fract(P);        // Fractional part
              vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0

              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
              vec4 iz0 = vec4(Pi0.z);
              vec4 iz1 = vec4(Pi1.z);

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 / 7.0;
              vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 / 7.0;
              vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
              vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
              vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
              vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
              vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
              vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
              vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
              vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = Pf0 * Pf0 * Pf0 * (Pf0 * (Pf0 * 6.0 - 15.0) + 10.0);
              vec2 fade_xy = fade_xyz.xy;

              float n_z = mix(n000, n100, fade_xy.x) +
                          (n010 - n000) * fade_xy.y * (1.0 - fade_xy.x) +
                          (n110 - n100) * fade_xy.x * fade_xy.y;

              float n_z1 = mix(n001, n101, fade_xy.x) +
                           (n011 - n001) * fade_xy.y * (1.0 - fade_xy.x) +
                           (n111 - n101) * fade_xy.x * fade_xy.y;

              return mix(n_z, n_z1, fade_xyz.z);
            }

            // Fractal Brownian Motion (FBM)
            float fbm(vec3 p) {
              float value = 0.0;
              float amplitude = 0.5;
              float frequency = 1.0;

              for (int i = 0; i < 5; i++) {
                value += amplitude * perlin3d(p * frequency);
                frequency *= 2.0;
                amplitude *= 0.5;
              }
              return value;
            }

            void main() {
              // Map the sphere position into noise space
              vec3 p = normalize(vPosition) * 2.0;
              p += vec3(0.0, 0.0, u_time * 0.08);

              // FBM pattern
              float n = fbm(p);
              n = (n + 1.0) * 0.5; // remap to 0..1

              // Slight terminator darkening (fake nightside)
              float lighting = clamp(dot(normalize(vPosition), vec3(0.5, 0.4, 0.7)), 0.0, 1.0);
              float shade = mix(0.35, 1.0, lighting);

              vec3 col = mix(u_color1, u_color2, n) * shade;

              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>

      {/* Atmosphere aura */}
      <mesh ref={atmosphereRef} scale={1.06}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={highlightColor}
          transparent
          opacity={0.35}
          side={BackSide}
        />
      </mesh>
    </>
  );
};

//---------------------------------------------
// Wrapper Component with Canvas
//---------------------------------------------
const ThreePlanet: React.FC<PlanetProps> = ({ theme }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lights */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 5]} intensity={1.1} />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} color={"#38bdf8"} />

      {/* Animated Planet */}
      <PlanetMesh theme={theme} />
    </Canvas>
  );
};

export default ThreePlanet;