"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function HitoContent({ item }) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 h-full">
      <span
        className="inline-flex w-fit items-center px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide border"
        style={{ background: "var(--celeste-sanjo)", color: "white", borderColor: "transparent" }}
      >
        {item.year}
      </span>
      <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow">
        {item.title}
      </h2>
      <p className="text-sm sm:text-base leading-relaxed text-white/90 max-w-prose">
        {item.text}
      </p>
    </div>
  );
}

function HitoImage({ item }) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-2xl aspect-[16/10] md:aspect-[4/3]">
      <div
        className="w-full h-full bg-center bg-cover transition-transform duration-500 ease-out hover:scale-105"
        style={{ backgroundImage: `url(${item.image})` }}
        role="img"
        aria-label={item.title}
      />
    </div>
  );
}

export default function HistoriaTimeline({
  items = [],
  accentVar = "var(--azul-sanjo)",
  introKicker = "NUESTRA HISTORIA",
  introHashtag = "#ELBARRIOSANTO",
  introTitle = "Club Barrio Santo",
  introSubtitle = "Seleccioná un período para explorar los hitos del club",
  navOffset = 80, // 👈 altura estimada del navbar (px)
}) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (!items.length) return;

    let raf = 0;

    const updateActive = () => {
      const viewportCenter = navOffset + (window.innerHeight - navOffset) / 2;

      let bestIdx = 0;
      let bestDist = Infinity;

      refs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActive(bestIdx);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };

    updateActive(); // inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length, navOffset]);

  const goTo = (idx) => {
    const el = refs.current[idx];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (navOffset + 16);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full isolate overflow-hidden"
      style={{ background: "var(--background)", color: "var(--content-text)" }}
      aria-label="Historias del club"
    >
      {/* Header */}
      <header className="relative w-full text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 400px at 50% -10%, rgba(0,0,0,0.12), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
          <p className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase opacity-80">{introKicker}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{introHashtag}</h1>
          <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-black">{introTitle}</h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto opacity-90">{introSubtitle}</p>
        </div>
      </header>

      {/* Timeline wrapper */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
        {/* Línea central */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block" />

        <div className="space-y-10 md:space-y-16">
          {items.map((it, idx) => {
            const isEven = idx % 2 === 0;
            const isActive = idx === active;

            return (
              <article
                key={it.id ?? idx}
                ref={(el) => (refs.current[idx] = el)}
                data-index={idx}
                className="relative"
                style={{ scrollMarginTop: `${navOffset + 16}px` }}
              >
                {/* Fondo por item */}
                <div className="absolute inset-0 -z-10 opacity-60 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${it.image})` }} />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.80) 100%)",
                    }}
                  />
                </div>

                
                <div className="relative grid gap-6 md:gap-10 md:grid-cols-[1fr_auto_1fr] p-4 sm:p-6 md:p-8 rounded-2xl">
                  
                  <div className={isEven ? "md:order-1" : "md:order-3"}>
                    <div className="md:hidden">
                      <HitoImage item={it} />
                      <div className="mt-6">
                        <HitoContent item={it} onNext={idx < items.length - 1 ? () => goTo(idx + 1) : null} />
                      </div>
                    </div>

                    <div className="hidden md:block">
                      {isEven ? <HitoImage item={it} /> : <HitoContent item={it} onNext={idx < items.length - 1 ? () => goTo(idx + 1) : null} />}
                    </div>
                  </div>

                  {/* Columna centro */}
                  <div className="hidden md:flex md:order-2 items-start justify-center pt-2">
                    <div
                      className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${isActive ? "scale-125 border-4" : ""}`}
                      style={{
                        background: isActive ? accentVar : "var(--background)",
                        borderColor: isActive
                          ? accentVar
                          : "color-mix(in srgb, var(--foreground) 30%, transparent)",
                      }}
                    />
                  </div>

                  {/* Columna derecha */}
                  <div className={isEven ? "hidden md:block md:order-3" : "hidden md:block md:order-1"}>
                    {isEven ? (
                      <HitoContent item={it} onNext={idx < items.length - 1 ? () => goTo(idx + 1) : null} />
                    ) : (
                      <HitoImage item={it} />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
