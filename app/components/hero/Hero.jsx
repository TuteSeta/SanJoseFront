"use client";
import { useEffect, useRef, useState } from "react";
import NavBar from "../ui/NavBar";
import InteractiveCourt from "./InteractiveCourt";
import NAV_ITEMS from "../ui/navItems";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

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
    <div className="bg-app text-app relative">
      {/* Tooltip */}
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
        className={`relative isolate overflow-hidden w-full transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
       
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 md:pt-24 pb-12">
          <div className="grid gap-10 lg:gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6">
              <HeroContent />
            </div>

            <div className="lg:col-span-6">
              <HeroVisual>
                <InteractiveCourt onHover={setTooltip} activePart={activePart} />
              </HeroVisual>
            </div>
          </div>
        </div>

        {/* Velo superior suave */}
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
