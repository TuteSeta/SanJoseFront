import { query } from "@/lib/db";
import NavBar from "../../components/ui/NavBar.jsx";
import NAV_ITEMS from "../../components/ui/navItems.js";
import PlantelTabs from "../../components/plantel/PlantelTabs.jsx";

export const dynamic = "force-dynamic";

async function fetchActivePlayers() {
  try {
    const { rows } = await query(
      `
      SELECT
        id,
        branch,
        first_name,
        last_name,
        jersey_number,
        position,
        photo_path,
        is_captain,
        sort_order
      FROM senior_squads
      WHERE is_active = true
        AND is_deleted = false
      ORDER BY branch, sort_order ASC, last_name ASC
      `
    );

    return rows.map((r) => ({
      id: r.id,
      branch: r.branch,
      nombre: `${r.first_name} ${r.last_name}`.trim(),
      dorsal: r.jersey_number ?? null,
      posicion: r.position ?? null,
      is_captain: r.is_captain,
      imagen_url: r.photo_path ?? null,
    }));
  } catch (err) {
    console.error("[plantel page RSC]", err);
    return [];
  }
}

export default async function PlantelPage() {
  const players = await fetchActivePlayers();

  const femenino = players.filter((p) => p.branch === "FEMENINO");
  const masculino = players.filter((p) => p.branch === "MASCULINO");

  return (
    <div className="min-h-dvh bg-[#F9FAFB] text-[#27303F]">
      <NavBar items={NAV_ITEMS} />
      <PlantelTabs femenino={femenino} masculino={masculino} />
    </div>
  );
}
