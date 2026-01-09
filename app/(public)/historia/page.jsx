import NavBar from "../../components/ui/NavBar.jsx";
import NAV_ITEMS from "../../components/ui/navItems.js";
import HistoriaTimeline from "../../components/historia/HistoriaTimeline.jsx";

export const dynamic = "force-static";


const HISTORIAS = [
  {
    id: "1907",
    year: 1907,
    title: "Fundación del Club",
    text:
      "Un grupo de jóvenes del barrio da origen al club. La identidad barrial y el espíritu amateur marcan los primeros años.",
    image: "/img/historia/1907.jpg",
  },
  {
    id: "1950",
    year: 1950,
    title: "Primera gran camada",
    text:
      "Surgen referentes que consolidan la mística del equipo. Se amplían las actividades y crece la masa societaria.",
    image: "/img/historia/1950.jpg",
  },
  {
    id: "1986",
    year: 1986,
    title: "Reformas e infraestructura",
    text:
      "Se inauguran nuevas canchas y espacios sociales. El club se proyecta a nivel provincial con nuevas disciplinas.",
    image: "/img/historia/1907.jpg",
  },
  {
    id: "2005",
    year: 2005,
    title: "Etapa de modernización",
    text:
      "Se incorporan tecnologías de gestión, escuelas formativas y acuerdos con instituciones educativas.",
    image: "/img/historia/1950.jpg",
  },
  {
    id: "2025",
    year: 2025,
    title: "Nueva identidad y proyección",
    text:
      "Se presenta la indumentaria 2025 y la estrategia digital. El club apuesta por la formación integral y la comunidad.",
    image: "/img/historia/1907.jpg",
  },
];


export default function Home() {
  return (
    <div className="min-h-dvh bg-[#F9FAFB] text-[#27303F]">
      <NavBar items={NAV_ITEMS} />
       <HistoriaTimeline items={HISTORIAS} />
    </div>
  );
}
