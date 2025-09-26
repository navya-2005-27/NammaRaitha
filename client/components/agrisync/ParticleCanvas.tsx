import React, { useEffect, useRef } from "react";
import { useFPS } from "@/hooks/useFPS";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function ParticleCanvas({
  className = "",
  color = "#00F0FF",
}: {
  className?: string;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fps = useFPS(1000);
  const target = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const create = () => {
      particles.current = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.8 + 0.6,
      }));
    };
    create();

    const handle = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.current.x = e.clientX - rect.left;
      target.current.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handle);

    const onResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      create();
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (fps < 30) return; // skip drawing when low FPS
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles.current) {
        const dx = target.current.x - p.x;
        const dy = target.current.y - p.y;
        const d = Math.hypot(dx, dy) + 0.01;
        p.vx += (dx / d) * 0.005;
        p.vy += (dy / d) * 0.005;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", handle);
    };
  }, [fps, color]);

  return <canvas ref={canvasRef} className={className} />;
}
