export default function UpcomingGamesSection() {
  const upcomingGames = [
    { label: "Quimsa vs UDSJ", when: "Jue 09/10 • 20:00" },
    { label: "UDSJ vs Gorriones", when: "Sáb 18/10 • 19:00" },
    { label: "Bochas vs UDSJ", when: "Dom 26/10 • 18:00" },
  ];

  return (
    <section
      id="calendario"
      className="mx-auto max-w-7xl px-6 py-14"
      style={{ color: "var(--foreground)" }}
    >
      <div
        className="rounded-3xl p-6 md:p-8"
        style={{
          background: "color-mix(in srgb, var(--surface) 92%, transparent)",
          border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
        }}
      >
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">Próximos partidos</h2>
            <p className="mt-1 text-sm md:text-base" style={{ color: "var(--muted)" }}>
              Liga Femenina • Local y Visitante
            </p>
          </div>

          <a
            href="/liga-femenina"
            className="text-sm font-semibold"
            style={{ color: "var(--brand)" }}
          >
            Ver calendario completo →
          </a>
        </div>

        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {upcomingGames.map((g) => (
            <li
              key={g.label}
              className="rounded-2xl p-4"
              style={{
                background: "color-mix(in srgb, var(--surface) 96%, transparent)",
                border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
              }}
            >
              <div className="font-bold">{g.label}</div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                {g.when}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
