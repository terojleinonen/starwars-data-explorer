"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/CartographyBackground.module.css";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  theme?: "dark" | "light";
  className?: string;
};

// Star particle for constellation map
interface Star {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  brightness: number;
  size: number;
  constellation?: number;
  isStatic?: boolean; // For background stars
}

// Sector point for war map
interface Sector {
  x: number;
  y: number;
  radius: number;
  activity: number;
  angle: number;
}

class ConstellationMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private time = 0;
  private mouseX = 0;
  private mouseY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.initStars();
    this.setupMouseTracking();
  }

  private initStars() {
    // Add static background stars first
    for (let i = 0; i < 200; i++) {
      const star: Star = {
        x: (Math.random() - 0.5) * 4, // Spread wider than constellations
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 2,
        vx: 0, // Static stars don't move
        vy: 0,
        vz: 0,
        brightness: Math.random() * 0.3 + 0.1, // Dim background stars
        size: Math.random() * 0.5 + 0.2,
        isStatic: true,
      };
      this.stars.push(star);
    }

    // Create constellation clusters with better distribution
    for (let c = 0; c < 8; c++) {
      // Distribute constellation centers more evenly across the space
      const angle = (c / 8) * Math.PI * 2;
      const radius = 1.2 + Math.random() * 0.8; // Spread constellations wider
      const centerX = Math.cos(angle) * radius;
      const centerY = Math.sin(angle) * radius;
      const centerZ = (Math.random() - 0.5) * 1.5;

      for (let i = 0; i < 120; i++) {
        // Create more spread out clusters
        const clusterAngle = Math.random() * Math.PI * 2;
        const clusterRadius = Math.random() * 0.5;
        const star: Star = {
          x: centerX + Math.cos(clusterAngle) * clusterRadius,
          y: centerY + Math.sin(clusterAngle) * clusterRadius,
          z: centerZ + (Math.random() - 0.5) * 0.6,
          vx: (Math.random() - 0.5) * 0.002, // Slower movement for older computers
          vy: (Math.random() - 0.5) * 0.002,
          vz: (Math.random() - 0.5) * 0.002,
          brightness: 0.5 + Math.random() * 0.5,
          size: 1.0 + Math.random() * 1.5,
          constellation: c,
          isStatic: false,
        };
        this.stars.push(star);
      }
    }
  }

  private setupMouseTracking() {
    // Simpler mouse tracking for older computers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      // Convert to normalized coordinates (-1 to 1)
      this.mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      this.mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    this.canvas.addEventListener("mousemove", handleMouseMove);
  }

  update() {
    this.time += 0.0005; // Slower animation for older computers

    this.stars.forEach((star) => {
      if (star.isStatic) return; // Static stars don't move

      // Gentler mouse interaction
      const mouseInfluence = 0.00005;
      star.vx += (this.mouseX - star.x) * mouseInfluence;
      star.vy += (this.mouseY - star.y) * mouseInfluence;

      // Update position
      star.x += star.vx;
      star.y += star.vy;
      star.z += star.vz;

      // Wrap around with gentler damping
      const wrapLimit = 3.0;
      if (Math.abs(star.x) > wrapLimit) {
        star.x *= -0.95;
        star.vx *= -0.3;
      }
      if (Math.abs(star.y) > wrapLimit) {
        star.y *= -0.95;
        star.vy *= -0.3;
      }
      if (Math.abs(star.z) > wrapLimit) {
        star.z *= -0.95;
        star.vz *= -0.3;
      }

      // Add gentler damping
      star.vx *= 0.998;
      star.vy *= 0.998;
      star.vz *= 0.998;

      // Subtle pulsing brightness
      star.brightness = 0.5 + 0.3 * Math.sin(this.time * 0.001 + star.x * 5 + star.y * 5);
    });
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    // Dark space background
    this.ctx.fillStyle = "rgba(2, 8, 20, 0.9)";
    this.ctx.fillRect(0, 0, w, h);

    // Draw stars with depth sorting
    const projected = this.stars.map((star) => {
      const rotX = Math.cos(this.time) * star.x - Math.sin(this.time) * star.z;
      const rotZ = Math.sin(this.time) * star.x + Math.cos(this.time) * star.z;
      const rotY = Math.cos(this.time * 0.3) * star.y - Math.sin(this.time * 0.3) * rotZ;

      // More spread out projection
      const distance = 2.5 + rotZ;
      const scale = Math.min(w, h) * 0.6 / distance; // Increased from 0.4 to 0.6
      const px = centerX + rotX * scale;
      const py = centerY + rotY * scale;
      const brightness = star.isStatic ? star.brightness * 0.8 : star.brightness * (0.6 + 0.4 / distance);

      return { x: px, y: py, size: star.size * scale * 0.15, brightness, z: rotZ, distance, isStatic: star.isStatic };
    });

    projected.sort((a, b) => a.distance - b.distance);

    // Draw static background stars first (no connections)
    const staticStars = projected.filter(p => p.isStatic);
    staticStars.forEach((star) => {
      this.ctx.fillStyle = `rgba(200, 220, 255, ${star.brightness * 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, Math.max(0.5, star.size * 0.5), 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw connections between nearby constellation stars
    const constellationStars = projected.filter(p => !p.isStatic);
    for (let i = 0; i < constellationStars.length; i++) {
      for (let j = i + 1; j < Math.min(i + 6, constellationStars.length); j++) {
        const dx = constellationStars[i].x - constellationStars[j].x;
        const dy = constellationStars[i].y - constellationStars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250 && constellationStars[i].distance > 0.8 && constellationStars[j].distance > 0.8) {
          this.ctx.strokeStyle = `rgba(120, 180, 255, ${0.06 * Math.max(0, 1 - dist / 250) * constellationStars[i].brightness})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(constellationStars[i].x, constellationStars[i].y);
          this.ctx.lineTo(constellationStars[j].x, constellationStars[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw constellation stars with glow
    constellationStars.forEach((star) => {
      if (star.distance > 0.5) {
        // Glow
        const gradient = this.ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 5
        );
        gradient.addColorStop(0, `rgba(150, 200, 255, ${star.brightness * 0.5})`);
        gradient.addColorStop(1, "rgba(150, 200, 255, 0)");
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 5, 0, Math.PI * 2);
        this.ctx.fill();

        // Star
        this.ctx.fillStyle = `rgba(220, 240, 255, ${star.brightness})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, Math.max(1, star.size), 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }
}

class WarMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sectors: Sector[] = [];
  private time = 0;
  private pulse = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.initSectors();
  }

  private initSectors() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Calculate responsive sizes based on viewport
    const minDimension = Math.min(this.canvas.width, this.canvas.height);
    const maxDimension = Math.max(this.canvas.width, this.canvas.height);

    // Scale factors: larger on desktop, smaller on mobile
    const isDesktop = maxDimension > 1200;
    const sizeMultiplier = isDesktop ? 1.0 : Math.max(0.6, minDimension / 1200);

    // Create strategic sectors - spread them out more responsively
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const baseDistance = 120 + Math.random() * 80;
      const distance = baseDistance * sizeMultiplier;
      this.sectors.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: (60 + Math.random() * 40) * sizeMultiplier,
        activity: Math.random(),
        angle: angle,
      });
    }

    // Add central fortress - much bigger and responsive
    const fortressRadius = Math.min(200, maxDimension * 0.15) * sizeMultiplier;
    this.sectors.push({
      x: centerX,
      y: centerY,
      radius: Math.max(60, fortressRadius), // Minimum 60px, up to 200px on large screens
      activity: 1,
      angle: 0,
    });
  }

  update() {
    this.time += 0.01;
    this.pulse = Math.sin(this.time) * 0.3 + 0.7;

    this.sectors.forEach((sector, idx) => {
      sector.activity += (Math.random() - 0.5) * 0.05;
      sector.activity = Math.max(0, Math.min(1, sector.activity));
    });
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Light space background with grid
    const gradient = this.ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "rgba(245, 235, 220, 0.1)");
    gradient.addColorStop(1, "rgba(220, 200, 170, 0.1)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, w, h);

    // Add static background stars
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const brightness = Math.random() * 0.4 + 0.1;
      const size = Math.random() * 1 + 0.5;

      this.ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw tactical grid - make it responsive
    this.ctx.strokeStyle = "rgba(180, 140, 100, 0.12)";
    this.ctx.lineWidth = 1;
    const minDimension = Math.min(w, h);
    const gridSize = Math.max(80, Math.min(150, minDimension / 8)); // Responsive grid: 80-150px
    for (let x = 0; x <= w; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Draw sector connections
    for (let i = 0; i < this.sectors.length - 1; i++) {
      for (let j = i + 1; j < this.sectors.length; j++) {
        const s1 = this.sectors[i];
        const s2 = this.sectors[j];
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 280) {
          const opacity =
            (s1.activity + s2.activity) * 0.3 * (1 - dist / 280);
          this.ctx.strokeStyle = `rgba(210, 140, 60, ${opacity})`;
          this.ctx.lineWidth = 2 * (s1.activity + s2.activity) * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(s1.x, s1.y);
          this.ctx.lineTo(s2.x, s2.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw sectors
    this.sectors.forEach((sector, idx) => {
      const isCapital = idx === this.sectors.length - 1;
      const brightness = sector.activity * 0.7 + 0.3;

      // Outer ring (radar sweep effect)
      this.ctx.strokeStyle = `rgba(220, 150, 80, ${brightness * 0.4 * this.pulse})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(sector.x, sector.y, sector.radius * 1.3, 0, Math.PI * 2);
      this.ctx.stroke();

      // Sector fill
      const sectorGradient = this.ctx.createRadialGradient(
        sector.x,
        sector.y,
        0,
        sector.x,
        sector.y,
        sector.radius
      );
      sectorGradient.addColorStop(
        0,
        `rgba(255, 160, 80, ${brightness * 0.4})`
      );
      sectorGradient.addColorStop(
        1,
        `rgba(210, 120, 50, ${brightness * 0.15})`
      );
      this.ctx.fillStyle = sectorGradient;
      this.ctx.beginPath();
      this.ctx.arc(sector.x, sector.y, sector.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Sector border
      this.ctx.strokeStyle = `rgba(240, 160, 80, ${brightness * 0.8})`;
      this.ctx.lineWidth = isCapital ? 3 : 2;
      this.ctx.beginPath();
      this.ctx.arc(sector.x, sector.y, sector.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Activity pulse dots
      const dotCount = isCapital ? 8 : 4;
      for (let d = 0; d < dotCount; d++) {
        const angle = (d / dotCount) * Math.PI * 2 + this.time;
        const radius = sector.radius * 0.6;
        const px = sector.x + Math.cos(angle) * radius;
        const py = sector.y + Math.sin(angle) * radius;

        this.ctx.fillStyle = `rgba(255, 180, 100, ${brightness * 0.6})`;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Center marker
      this.ctx.fillStyle = isCapital
        ? `rgba(255, 200, 100, ${brightness})`
        : `rgba(220, 150, 80, ${brightness * 0.8})`;
      this.ctx.beginPath();
      this.ctx.arc(sector.x, sector.y, isCapital ? 8 : 5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
}

export default function CartographyBackground({
  theme,
  className = "",
}: Props) {
  const { theme: appTheme } = useTheme();
  const activeTheme = theme || appTheme;
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<ConstellationMap | WarMap | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reinitialize map with new dimensions
      if (activeTheme === "dark") {
        mapRef.current = new ConstellationMap(canvas);
      } else {
        mapRef.current = new WarMap(canvas);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial map creation
    if (activeTheme === "dark") {
      mapRef.current = new ConstellationMap(canvas);
      console.log('Created ConstellationMap');
    } else {
      mapRef.current = new WarMap(canvas);
      console.log('Created WarMap');
    }

    const animate = () => {
      if (mapRef.current) {
        mapRef.current.update();
        mapRef.current.render();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted, activeTheme]);

  if (!mounted) return null;

  return (
    <div className={`${styles.root} ${styles[activeTheme]} ${className} cartography`}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}