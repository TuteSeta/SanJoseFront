"use client";

export default function RegisterModeToggle({ mode, setMode }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => setMode("INDIVIDUAL")}
        className={[
          "card p-4 text-left transition",
          mode === "INDIVIDUAL"
            ? "border-[color:var(--brand)] ring-2 ring-[color:rgba(21,28,71,0.12)]"
            : "hover:shadow-sm",
        ].join(" ")}
      >
        <div className="font-semibold">Individual</div>
        <div className="mt-1 text-xs text-muted">Registrás una sola cuenta.</div>
      </button>

      <button
        type="button"
        onClick={() => setMode("FAMILY")}
        className={[
          "card p-4 text-left transition",
          mode === "FAMILY"
            ? "border-[color:var(--brand)] ring-2 ring-[color:rgba(21,28,71,0.12)]"
            : "hover:shadow-sm",
        ].join(" ")}
      >
        <div className="font-semibold">Plan familiar</div>
        <div className="mt-1 text-xs text-muted">Responsable + miembros (2+).</div>
      </button>
    </div>
  );
}
