import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function bad(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

// GET /api/admin/senior-squad?branch=MASCULINO|FEMENINO
export async function GET(req) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch")?.toUpperCase();

  if (branch && branch !== "MASCULINO" && branch !== "FEMENINO") {
    return bad("branch debe ser MASCULINO o FEMENINO.");
  }

  try {
    const { rows } = await query(
      `
      SELECT
        id, branch, first_name, last_name, jersey_number,
        position, birth_date, height_cm, photo_path, bio,
        is_captain, sort_order, is_active, is_deleted,
        created_at, updated_at
      FROM senior_squads
      WHERE is_deleted = false
        ${branch ? "AND branch = $1" : ""}
      ORDER BY branch, sort_order ASC, last_name ASC
      `,
      branch ? [branch] : []
    );

    return NextResponse.json({ ok: true, items: rows });
  } catch (err) {
    console.error("[senior-squad GET]", err);
    return bad("Error al obtener el plantel.", 500);
  }
}

// POST /api/admin/senior-squad
export async function POST(req) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  let body;
  try {
    body = await req.json();
  } catch {
    return bad("Body inválido.");
  }

  const {
    branch,
    first_name,
    last_name,
    jersey_number,
    position,
    birth_date,
    height_cm,
    photo_path,
    bio,
    is_captain = false,
    sort_order = 99,
    is_active = true,
  } = body ?? {};

  // Validaciones mínimas
  if (!branch || !["MASCULINO", "FEMENINO"].includes(branch)) {
    return bad("branch debe ser MASCULINO o FEMENINO.");
  }
  if (!first_name?.trim()) return bad("first_name es requerido.");
  if (!last_name?.trim()) return bad("last_name es requerido.");

  try {
    // Si se marca como capitán, quitar capitanía previa de la misma rama
    if (is_captain) {
      await query(
        `UPDATE senior_squads SET is_captain = false WHERE branch = $1 AND is_deleted = false`,
        [branch]
      );
    }

    const { rows } = await query(
      `
      INSERT INTO senior_squads
        (branch, first_name, last_name, jersey_number, position,
         birth_date, height_cm, photo_path, bio,
         is_captain, sort_order, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
      `,
      [
        branch,
        first_name.trim(),
        last_name.trim(),
        jersey_number ?? null,
        position?.trim() ?? null,
        birth_date ?? null,
        height_cm ?? null,
        photo_path?.trim() ?? null,
        bio?.trim() ?? null,
        is_captain,
        sort_order,
        is_active,
      ]
    );

    return NextResponse.json({ ok: true, item: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("[senior-squad POST]", err);
    return bad("Error al crear el jugador.", 500);
  }
}
