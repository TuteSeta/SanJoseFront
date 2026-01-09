export default function HeroVisual({ children }) {
  return (
    <div
      className="rounded-[28px] p-4 md:p-6 shadow-2xl"
      style={{
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
      }}
    >
      {children}
    </div>
  );
}
