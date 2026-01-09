import HeroActions from "./HeroActions";
import HeroChips from "./HeroChips";

export default function HeroContent() {
  return (
    <>
      <h1
        className="text-left text-5xl md:text-6xl lg:text-7xl font-black tracking-widehumane leading-humane"
        style={{ color: "var(--brand)" }}
      >
        Unión Deportiva San José
      </h1>

      <p
        className="mt-4 max-w-prose text-left text-lg md:text-xl leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        Un club social y deportivo de barrio, con foco en la formación, la identidad mendocina y la comunidad.
      </p>

      <HeroActions />
      <HeroChips />
    </>
  );
}
