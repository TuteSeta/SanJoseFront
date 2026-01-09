function Chip({ icon, text }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
      style={{
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
        color: "var(--foreground)",
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default function HeroChips() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Chip icon="🤝" text="Comunidad" />
      <Chip icon="💙" text="Inclusión" />
      <Chip icon="🏆" text="Excelencia" />
    </div>
  );
}
