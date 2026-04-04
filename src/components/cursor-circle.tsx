"use client";

import { useEffect, useRef } from "react";

const CIRCLE_RADIUS = 14;
const LERP = 0.15;

export function CursorCircle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setSize();

    const getAccentColor = () => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim();
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onLeave = () => {
      mouse.current = { x: -100, y: -100 };
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Smooth follow
      pos.current.x += (mouse.current.x - pos.current.x) * LERP;
      pos.current.y += (mouse.current.y - pos.current.y) * LERP;

      const color = getAccentColor();

      ctx.beginPath();
      ctx.arc(pos.current.x, pos.current.y, CIRCLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", setSize);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
