"use client";

import { MEMBER_OPTIONS } from "./registerConstants";

export default function MemberTypeCards({ value, onChange }) {
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-3">
      {MEMBER_OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "text-left card p-4 transition",
              active
                ? "border-[color:var(--brand)] ring-2 ring-[color:rgba(21,28,71,0.12)]"
                : "hover:shadow-sm",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">{opt.title}</div>
              <span className="badge">{opt.badge}</span>
            </div>
            <div className="mt-2 text-xs text-muted">{opt.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
