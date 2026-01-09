import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

function bad(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function normalizeDni(dni) {
  return (dni ?? "").toString().trim();
}

function normalizeEmail(email) {
  return (email ?? "").toString().trim().toLowerCase();
}

function isValidDni(dni) {
  return /^[0-9]{7,9}$/.test(dni);
}

function isValidEmail(email) {
  
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

const ALLOWED_MEMBER_TYPES = new Set([
  "SOCIO_PLENO",
  "SOCIO_SIMPLE",
  "SOCIO_DEPORTIVO",
]);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    const dni = normalizeDni(body?.dni);
    const email = normalizeEmail(body?.email);
    const password = (body?.password ?? "").toString();
    const confirmPassword = (body?.confirmPassword ?? "").toString();
    const member_type = (body?.member_type ?? "").toString().trim();

    // Registro público => nunca admin
    const app_role = "USER";

    if (!dni) return bad("El DNI es requerido.", 400);
    if (!isValidDni(dni)) return bad("DNI inválido.", 400);

    if (!email) return bad("El email es requerido.", 400);
    if (!isValidEmail(email)) return bad("Email inválido.", 400);

    if (!password) return bad("La contraseña es requerida.", 400);
    if (!isValidPassword(password))
      return bad("La contraseña debe tener al menos 8 caracteres.", 400);

    if (!confirmPassword) return bad("Confirmá tu contraseña.", 400);
    if (password !== confirmPassword) return bad("Las contraseñas no coinciden.", 400);

    if (!ALLOWED_MEMBER_TYPES.has(member_type)) {
      return bad("Tipo de socio inválido.", 400);
    }

    // Unicidad por DNI
    {
      const { rows } = await query(`select id from users where dni = $1 limit 1`, [dni]);
      if (rows.length > 0) return bad("Ya existe una cuenta con ese DNI.", 409);
    }

    // Unicidad por email
    {
      const { rows } = await query(`select id from users where email = $1 limit 1`, [email]);
      if (rows.length > 0) return bad("Ya existe una cuenta con ese email.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { rows: created } = await query(
      `
      insert into users (dni, email, password_hash, app_role, member_type, is_active)
      values ($1, $2, $3, $4::app_role, $5::member_type, true)
      returning id, dni, email, app_role, member_type, is_active
      `,
      [dni, email, passwordHash, app_role, member_type]
    );

    const user = created[0];

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        dni: user.dni,
        email: user.email,
        app_role: user.app_role,
        member_type: user.member_type,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    // Si se te escapa un duplicado por carrera, Postgres tira 23505
    if (err?.code === "23505") {
      return bad("Ya existe una cuenta con ese DNI o email.", 409);
    }
    console.error("REGISTER_ERROR:", err);
    return bad("Error interno.", 500);
  }
}
