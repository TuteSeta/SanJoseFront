const NEWS = [
  {
    tag: "INSTITUCIONAL",
    title: "Liga Femenina 2025/26: Presentación oficial",
    excerpt: "Sanjo presenta su proyecto histórico con identidad mendocina y foco formativo.",
    href: "/noticias/liga-femenina-presentacion",
  },
  {
    tag: "FORMATIVAS",
    title: "Plan Formativo 2025–2026",
    excerpt: "Cronograma de talleres, encuentros y plan de captación para Mini y Formativas.",
    href: "/noticias/plan-formativo-2025-2026",
  },
  {
    tag: "SOCIOS",
    title: "Abonos y Socios: ¡Sumate a Tierra Santa!",
    excerpt: "Beneficios, categorías y cómo asociarte para apoyar al club.",
    href: "/noticias/abonos-y-socios",
  },
  {
    tag: "DEPORTES",
    title: "Agenda semanal de entrenamientos",
    excerpt: "Horarios actualizados por categoría y staff técnico.",
    href: "/noticias/agenda-entrenamientos",
  },
];

function NewsCard({ item }) {
  return (
    <a
      href={item.href}
      className="block rounded-3xl p-6 transition hover:-translate-y-0.5"
      style={{
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
      }}
    >
      <div className="text-xs font-extrabold tracking-wide" style={{ color: "var(--brand)" }}>
        {item.tag}
      </div>
      <div className="mt-2 text-lg font-extrabold" style={{ color: "var(--foreground)" }}>
        {item.title}
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {item.excerpt}
      </p>
      <div className="mt-4 text-sm font-semibold" style={{ color: "var(--brand)" }}>
        Leer más →
      </div>
    </a>
  );
}

export default function NewsHighlightsSection() {
  const highlights = NEWS.slice(0, 3); 

  return (
    <section className="mx-auto max-w-7xl rounded-3xl p-6 md:p-8 mb-10"
      style={{
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
      }}
    >
      <div className="flex items-end justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--foreground)" }}>
            Noticias
          </h2>
          <p className="mt-1 text-sm md:text-base" style={{ color: "var(--muted)" }}>
            Actualidad institucional y deportiva
          </p>
        </div>

        <a href="/noticias" className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
          Ver todas las noticias →
        </a>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {highlights.map((n) => (
          <NewsCard key={n.href} item={n} />
        ))}
      </div>
    </section>
  );
}
