"use client";

export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-[color:var(--border)]" />
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="h-px flex-1 bg-[color:var(--border)]" />
    </div>
  );
}
