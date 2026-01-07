import fs from "node:fs/promises";
import path from "node:path";
import NewsClient from "./NewsClient";

export const dynamic = "force-static";

export default async function NewsPortal() {
  let data = { items: [], fetchedAt: null };
  try {
    const filePath = path.join(process.cwd(), "public", "news.json");
    const raw = await fs.readFile(filePath, "utf8");
    data = JSON.parse(raw);
  } catch {
    
  }

  return (
    <section
      className={[
        "relative isolate min-h-[100svh] w-full",
        "bg-[radial-gradient(120%_120%_at_10%_0%,color-mix(in_srgb,var(--blanco)_100%,transparent)_0%,",
        "color-mix(in_srgb,var(--celeste-sanjo)_18%,transparent)_45%,",
        "color-mix(in_srgb,var(--brand)_8%,transparent)_100%)]"
      ].join(" ")}
    >
      
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--blanco)_70%,transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:py-16">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-brand">
            Noticias del Club
          </h1>
          <p className="mt-3 text-lg md:text-xl text-celeste">
            Lo último de La Liga Femenina — San José (Mendoza)
          </p>

          {data?.fetchedAt && (
            <div
              className={[
                "mt-4 inline-flex items-center gap-2 rounded-full",
                "px-4 py-1.5 text-sm font-medium",
                "bg-[color-mix(in_srgb,var(--blanco)_80%,transparent)]",
                "text-app ring-1 ring-[var(--border)] backdrop-blur"
              ].join(" ")}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--celeste-sanjo)]" />
              Actualizado: {new Date(data.fetchedAt).toLocaleString()}
            </div>
          )}
        </header>

        <NewsClient items={data.items || []} />
      </div>
    </section>
  );
}
