"use client";
import Hero from "./components/hero/Hero.jsx";
import UpcomingGamesSection from "./components/home/UpcomingGamesSection.jsx";
import NewsHighlightsSection from "./components/home/NewsHighlightsSection.jsx";

export default function Home() {
  return (
    <main
      className="relative"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--background) 0%, color-mix(in srgb, var(--brand) 8%, var(--background)) 40%, var(--surface) 100%)",
      }}
    >
      <Hero />
      <UpcomingGamesSection />
      <NewsHighlightsSection />
    </main>
  );
}
