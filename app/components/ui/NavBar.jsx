"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar({
  items = [],
  interactive = false,
  activeIndex = 0,
  onHoverStart,
  onHoverEnd,
}) {
  const [path, setPath] = useState("/");
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setPath(window.location.pathname || "/");
  }, []);

  useEffect(() => {
    setOpenMobile(false);
  }, [path]);

  const handleEnter = (idx) => onHoverStart?.(idx);
  const handleLeave = () => onHoverEnd?.();
  const isPathActive = (href) => path === href || path.startsWith(href + "/");

  const NO_UNDERLINE =
    "no-underline decoration-transparent hover:no-underline focus:no-underline active:no-underline visited:no-underline";

  const ACTIVE_BG =
    "bg-[color-mix(in_srgb,var(--celeste-sanjo)_18%,transparent)]";
  const HOVER_BG =
    "hover:bg-[color-mix(in_srgb,var(--celeste-sanjo)_15%,transparent)]";

  return (
    <nav
      role="navigation"
      className="sticky top-0 z-30 bg-app border-b border-app shadow-sm"
      onMouseLeave={handleLeave}
    >
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-3 group ${NO_UNDERLINE}`}>
          <img
            src="/img/escudoClub.png"
            alt="Escudo Club San José"
            className="h-10 w-10 md:h-12 md:w-12 drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-xl md:text-3xl font-extrabold tracking-tight text-brand">
            San <span className="text-celeste">José</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-6 text-base font-semibold">
          {items.map(({ label, href }, idx) => {
            const routeActive = isPathActive(href);
            const carouselActive = interactive && idx === activeIndex;
            const styledActive = interactive ? carouselActive : routeActive;

            return (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={routeActive ? "page" : undefined}
                  className={[
                    "relative inline-flex items-center rounded-xl px-3 py-2",
                    "transition-transform duration-200 ease-out will-change-transform",
                    NO_UNDERLINE,
                    "text-app",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--celeste-sanjo)]",
                    styledActive
                      ? `${ACTIVE_BG} text-brand scale-110`
                      : `hover:text-brand ${HOVER_BG} hover:scale-[1.08]`
                  ].join(" ")}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(idx)}
                  onBlur={handleLeave}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile: hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 ring-1 ring-[color-mix(in_srgb,var(--negro)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--negro)_5%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--celeste-sanjo)]"
          aria-label="Abrir menú"
          aria-controls="mobile-menu"
          aria-expanded={openMobile}
          onClick={() => setOpenMobile((v) => !v)}
        >
          {/* Icono hamburguesa / close */}
          <svg
            className={`h-6 w-6 ${openMobile ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            className={`h-6 w-6 ${openMobile ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
      </div>

      {/* Mobile: panel */}
      {openMobile && (
        <button
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setOpenMobile(false)}
          className="md:hidden fixed inset-0 z-[29] bg-[color-mix(in_srgb,var(--negro)_20%,transparent)]"
        />
      )}
      <div
        id="mobile-menu"
        className={[
          "md:hidden relative z-[30] bg-app border-t border-app overflow-hidden",
          "transition-[max-height] duration-300 ease-out",
          openMobile ? "max-h-[70vh]" : "max-h-0"
        ].join(" ")}
      >
        <ul className="px-4 py-3 flex flex-col gap-1">
          {items.map(({ label, href }, idx) => {
            const routeActive = isPathActive(href);
            const carouselActive = interactive && idx === activeIndex;
            const styledActive = interactive ? carouselActive : routeActive;

            return (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={routeActive ? "page" : undefined}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold",
                    NO_UNDERLINE,
                    "text-app",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--celeste-sanjo)]",
                    styledActive
                      ? `${ACTIVE_BG} text-brand`
                      : `hover:text-brand ${HOVER_BG}`
                  ].join(" ")}
                  onClick={() => setOpenMobile(false)}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(idx)}
                  onBlur={handleLeave}
                >
                  <span>{label}</span>
                  {styledActive && (
                    <span className="ml-3 inline-flex h-2 w-2 rounded-full bg-[var(--celeste-sanjo)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
