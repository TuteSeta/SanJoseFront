"use client";

export default function FamilySizePills({ count, setCount }) {
  const presets = [2, 3, 4];

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {presets.map((n) => {
        const active = count === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => setCount(n)}
            className={[
              "px-3 py-2 rounded-xl border text-sm font-semibold transition",
              active
                ? "bg-[color:var(--brand)] text-white border-transparent"
                : "bg-white border-app text-app hover:bg-surface",
            ].join(" ")}
          >
            {n} personas
          </button>
        );
      })}

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Otro:</span>
        <input
          value={count}
          onChange={(e) => {
            const v = parseInt(e.target.value || "0", 10);
            setCount(Number.isFinite(v) && v > 0 ? v : 2);
          }}
          className="w-24 rounded-xl border border-app bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
          type="number"
          min={2}
        />
      </div>
    </div>
  );
}
