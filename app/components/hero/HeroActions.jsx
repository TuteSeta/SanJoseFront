export default function HeroActions() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
      <a href="#socios" className="btn w-full sm:w-auto text-center">
        Quiero asociarme
      </a>

      <a
        href="#proyecto"
        className="w-full sm:w-auto text-center rounded-full px-5 py-3 font-semibold transition"
        style={{
          border: "1px solid color-mix(in srgb, var(--foreground) 18%, transparent)",
          color: "var(--foreground)",
          background: "transparent",
        }}
      >
        Conocer el proyecto
      </a>
    </div>
  );
}
