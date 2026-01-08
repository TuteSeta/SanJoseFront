"use client";
import { useEffect, useRef, useState } from "react";
import NavBar from "../ui/NavBar";
import InteractiveCourt from "./InteractiveCourt";
import NAV_ITEMS from "../ui/navItems";

export default function Hero() {
  const items = NAV_ITEMS;

  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const stepMs = 1800;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, stepMs);
    return () => clearInterval(intervalRef.current);
  }, [paused, items.length]);

  const handleHoverStart = (index) => {
    setPaused(true);
    setActiveIndex(index);
  };
  const handleHoverEnd = () => setPaused(false);

  const activePart = items[activeIndex]?.part ?? null;

  return (
    <div className="min-h-dvh bg-app text-app">
      {tooltip.visible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm font-semibold rounded-md shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -120%)",
            background: "var(--brand)",
            color: "var(--blanco)",
          }}
        >
          {tooltip.content}
        </div>
      )}

      <NavBar
        items={items}
        interactive
        activeIndex={activeIndex}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      />

      <section
        className={`relative isolate overflow-hidden min-h-dvh w-full transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        // Fondo con gradiente basado en tokens 
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--background) 0%, color-mix(in srgb, var(--brand) 8%, var(--background)) 40%, var(--surface) 100%)",
          color: "var(--foreground)",
        }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 md:pt-24 pb-12 flex flex-col items-center">
          <h1 className="text-center text-5xl md:text-7xl font-black tracking-widehumane leading-humane"
              style={{ color: "var(--brand)" }}>
            Union Deportiva San José
          </h1>

          <p
            className="mt-4 max-w-prose text-center text-xl md:text-2xl leading-relaxed text-muted"
            style={{ color: "var(--muted)" }}
          >
            Pasión, formación y comunidad en la cancha.
          </p>

          {/* Cancha */}
          <div className="w-full mt-10">
            <InteractiveCourt onHover={setTooltip} activePart={activePart} />
          </div>

          {/* CTA usando el sistema de botones de tu CSS global */}
          <a href="#plantel" className="btn mt-8">
            Ver plantel
          </a>
        </div>

        {/* Velo superior suave en tokens */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, color-mix(in srgb, var(--foreground) 8%, transparent) 0%, transparent 60%)",
          }}
        />
      </section>
    </div>
  );
}
