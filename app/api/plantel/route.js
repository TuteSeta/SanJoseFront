import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/plantel?branch=MASCULINO|FEMENINO
 * Público — solo devuelve jugadores activos y no eliminados.
 * No expone: bio, birth_date, height_cm, photo_path (raw), is_deleted, updated_at.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch")?.toUpperCase();

  if (branch && branch !== "MASCULINO" && branch !== "FEMENINO") {
    return NextResponse.json({ ok: false, message: "branch inválido." }, { status: 400 });
  }

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
        ${branch ? "AND branch = $1" : ""}
      ORDER BY branch, sort_order ASC, last_name ASC
      `,
      branch ? [branch] : []
    );

    // Normalizar para los componentes existentes (nombre, dorsal, posicion, imagen_url)
    const items = rows.map((r) => ({
      id: r.id,
      branch: r.branch,
      nombre: `${r.first_name} ${r.last_name}`.trim(),
      first_name: r.first_name,
      last_name: r.last_name,
      dorsal: r.jersey_number,
      posicion: r.position,
      is_captain: r.is_captain,
      sort_order: r.sort_order,
      imagen_url: r.photo_path ?? null,
    }));

    return NextResponse.json(items, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("[plantel GET]", err);
    return NextResponse.json({ ok: false, message: "Error al obtener el plantel." }, { status: 500 });
  }
}
