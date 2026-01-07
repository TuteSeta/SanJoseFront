"use client";

import { useState } from "react";

function formatDateHuman(d) {
  const t = Date.parse(d ?? "");
  if (isNaN(t)) return d ?? "";
  return new Date(t).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function NewsCard({ item }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article
      className={[
        "h-full flex flex-col",
        "group relative overflow-hidden rounded-2xl border border-app",
        "bg-[color-mix(in_srgb,var(--blanco)_80%,transparent)] backdrop-blur",
        "shadow-sm ring-1 ring-transparent",
        "transform-gpu will-change-transform transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:shadow-md",
        "hover:bg-[color-mix(in_srgb,var(--celeste-sanjo)_14%,var(--blanco))]",
        "hover:ring-[color-mix(in_srgb,var(--celeste-sanjo)_35%,transparent)], cursor-pointer"
      ].join(" ")}
    >
      <div className="relative h-48 w-full">
        {item.img ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 animate-pulse rounded-t-2xl bg-[var(--surface)]" />
            )}
            <img
              src={item.img}
              alt={item.title ?? "Noticia"}
              className={[
                "h-48 w-full object-cover",
                "transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
                "md:transition-transform md:duration-500 md:ease-out md:group-hover:scale-[1.03]"
              ].join(" ")}
              onLoad={() => setLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div
            className="
              flex h-48 w-full items-center justify-center
              bg-[linear-gradient(to_br,
                color-mix(in_srgb,var(--celeste-sanjo)_55%,transparent),
                color-mix(in_srgb,var(--brand)_12%,transparent)
              )]
            "
          >
            <span className="text-5xl">📰</span>
          </div>
        )}

      
        <div
          className="
            pointer-events-none absolute inset-x-0 bottom-0 h-20
            bg-gradient-to-t
            from-[color-mix(in_srgb,var(--negro)_25%,transparent)]
            to-transparent
            opacity-0 transition-opacity duration-300 group-hover:opacity-100
          "
        />
      </div>

      <div className="flex flex-col p-4 flex-1">
        <a
          href={item.href}
          target="_blank"
          rel="noopener"
          className="block text-lg font-semibold leading-snug text-app hover:text-brand no-underline"
        >
          {item.title}
        </a>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {item.date && (
            <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-app border border-app">
              {formatDateHuman(item.date)}
            </span>
          )}
          <span
            className="
              rounded-full px-2.5 py-1 text-xs font-semibold
              text-brand
              ring-1 ring-[color-mix(in_srgb,var(--celeste-sanjo)_30%,transparent)]
              bg-[color-mix(in_srgb,var(--celeste-sanjo)_12%,transparent)]
            "
          >
            Fuente: La Liga Femenina
          </span>
        </div>

        {item.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm text-muted">
            {item.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
