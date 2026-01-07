"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function HitoContent({ item, onNext }) {
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

      {onNext && (
        <div className="pt-2">
          <button
            onClick={onNext}
            className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border backdrop-blur-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80"
            style={{
              borderColor: "color-mix(in srgb, white 40%, transparent)",
              background: "color-mix(in srgb, rgba(255,255,255,0.06) 100%, transparent)",
              color: "white",
              outline: "none",
            }}
          >
            Continuar
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="transition-transform duration-200 ease-in-out group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
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

    const obs = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (best) {
          const idx = Number(best.target.getAttribute("data-index"));
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      {
        threshold: [0.35, 0.5, 0.65],
        rootMargin: `-${navOffset}px 0px 0px 0px`,
      }
    );

    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
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
        {/* Línea central solo en md+ */}
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
                {/* Fondo por item (opcional) */}
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

                {/* Grid único: mobile 1 col, md 3 cols */}
                <div className="relative grid gap-6 md:gap-10 md:grid-cols-[1fr_auto_1fr] p-4 sm:p-6 md:p-8 rounded-2xl">
                  {/* Columna izquierda (en md alterna) */}
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

                  {/* Columna centro (punto) solo en md */}
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

                  {/* Columna derecha (en md alterna) */}
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
