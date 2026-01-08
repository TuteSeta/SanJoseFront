import NavBar from "../../components/ui/NavBar.jsx";
import NAV_ITEMS from "../../components/ui/navItems.js";
import NewsPortal from "../../components/noticias/NewsPortal.jsx";
import Noticias from "../../components/noticias/NewsPortal.jsx";
export default function Home() {
  return (
    <div className="min-h-dvh bg-[#F9FAFB] text-[#27303F]">
      <NavBar items={NAV_ITEMS} />
      <NewsPortal></NewsPortal>
    </div>
  );
}
