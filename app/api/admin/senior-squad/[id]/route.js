import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function bad(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

async function getPlayer(id) {
  const { rows } = await query(
    `SELECT * FROM senior_squads WHERE id = $1 AND is_deleted = false LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

// PUT /api/admin/senior-squad/[id]
export async function PUT(req, { params }) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return bad("Body inválido.");
  }

  const existing = await getPlayer(id);
  if (!existing) return bad("Jugador no encontrado.", 404);

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
    is_captain,
    sort_order,
    is_active,
  } = body ?? {};

  const newBranch = branch ?? existing.branch;
  if (!["MASCULINO", "FEMENINO"].includes(newBranch)) {
    return bad("branch debe ser MASCULINO o FEMENINO.");
  }

  try {
    // Si se marca como capitán, quitar capitanía previa de la misma rama (excepto este jugador)
    const becomingCaptain = is_captain === true && !existing.is_captain;
    if (becomingCaptain) {
      await query(
        `UPDATE senior_squads SET is_captain = false WHERE branch = $1 AND id != $2 AND is_deleted = false`,
        [newBranch, id]
      );
    }

    const { rows } = await query(
      `
      UPDATE senior_squads SET
        branch        = COALESCE($1, branch),
        first_name    = COALESCE($2, first_name),
        last_name     = COALESCE($3, last_name),
        jersey_number = $4,
        position      = $5,
        birth_date    = $6,
        height_cm     = $7,
        photo_path    = $8,
        bio           = $9,
        is_captain    = COALESCE($10, is_captain),
        sort_order    = COALESCE($11, sort_order),
        is_active     = COALESCE($12, is_active),
        updated_at    = NOW()
      WHERE id = $13 AND is_deleted = false
      RETURNING *
      `,
      [
        branch ?? null,
        first_name?.trim() ?? null,
        last_name?.trim() ?? null,
        jersey_number !== undefined ? jersey_number : existing.jersey_number,
        position !== undefined ? position?.trim() ?? null : existing.position,
        birth_date !== undefined ? birth_date : existing.birth_date,
        height_cm !== undefined ? height_cm : existing.height_cm,
        photo_path !== undefined ? photo_path?.trim() ?? null : existing.photo_path,
        bio !== undefined ? bio?.trim() ?? null : existing.bio,
        is_captain !== undefined ? is_captain : null,
        sort_order !== undefined ? sort_order : null,
        is_active !== undefined ? is_active : null,
        id,
      ]
    );

    if (rows.length === 0) return bad("Jugador no encontrado.", 404);

    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (err) {
    console.error("[senior-squad PUT]", err);
    return bad("Error al actualizar el jugador.", 500);
  }
}

// DELETE /api/admin/senior-squad/[id]  → soft delete
export async function DELETE(req, { params }) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await params;

  const existing = await getPlayer(id);
  if (!existing) return bad("Jugador no encontrado.", 404);

  try {
    await query(
      `UPDATE senior_squads SET is_deleted = true, updated_at = NOW() WHERE id = $1`,
      [id]
    );
    return NextResponse.json({ ok: true, message: "Jugador eliminado." });
  } catch (err) {
    console.error("[senior-squad DELETE]", err);
    return bad("Error al eliminar el jugador.", 500);
  }
}
