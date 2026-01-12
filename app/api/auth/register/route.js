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

function normalizeName(v) {
  return (v ?? "").toString().trim();
}

function isValidDni(dni) {
  return /^[0-9]{7,9}$/.test(dni);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(v) {
  const s = normalizeName(v);
  if (s.length < 2) return false;
  if (/^\d+$/.test(s)) return false;
  return /^[A-Za-zÀ-ÿ\u00f1\u00d1' -]+$/.test(s);
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
    let email = normalizeEmail(body?.email); 

    const first_name = normalizeName(body?.first_name);
    const last_name = normalizeName(body?.last_name);

    const password = (body?.password ?? "").toString();
    const confirmPassword = (body?.confirmPassword ?? "").toString();
    const member_type = (body?.member_type ?? "").toString().trim();

    const is_minor = Boolean(body?.is_minor);
    const responsible_dni = normalizeDni(body?.responsible_dni);

    const app_role = "USER";

    if (!dni) return bad("El DNI es requerido.", 400);
    if (!isValidDni(dni)) return bad("DNI inválido.", 400);

    if (!first_name || !isValidName(first_name)) return bad("El nombre es requerido.", 400);
    if (!last_name || !isValidName(last_name)) return bad("El apellido es requerido.", 400);

    if (!password) return bad("La contraseña es requerida.", 400);
    if (!isValidPassword(password))
      return bad("La contraseña debe tener al menos 8 caracteres.", 400);

    if (!confirmPassword) return bad("Confirmá tu contraseña.", 400);
    if (password !== confirmPassword) return bad("Las contraseñas no coinciden.", 400);

    if (!ALLOWED_MEMBER_TYPES.has(member_type)) {
      return bad("Tipo de socio inválido.", 400);
    }

    {
      const { rows } = await query(`select id from users where dni = $1 limit 1`, [dni]);
      if (rows.length > 0) return bad("Ya existe una cuenta con ese DNI.", 409);
    }

    if (is_minor) {
      if (!responsible_dni) return bad("El DNI del responsable es requerido para un menor.", 400);
      if (!isValidDni(responsible_dni)) return bad("DNI del responsable inválido.", 400);

      const { rows: resp } = await query(
        `select email from users where dni = $1 limit 1`,
        [responsible_dni]
      );

      if (resp.length === 0) {
        return bad("No existe una cuenta responsable con ese DNI.", 404);
      }

      const respEmail = normalizeEmail(resp[0].email);
      if (!respEmail || !isValidEmail(respEmail)) {
        return bad("El responsable no tiene un email válido cargado.", 400);
      }

      email = respEmail;
    } else {
      if (!email) return bad("El email es requerido.", 400);
      if (!isValidEmail(email)) return bad("Email inválido.", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { rows: created } = await query(
      `
      insert into users (dni, email, first_name, last_name, password_hash, app_role, member_type, is_active)
      values ($1, $2, $3, $4, $5, $6::app_role, $7::member_type, true)
      returning id, dni, email, first_name, last_name, app_role, member_type, is_active
      `,
      [dni, email, first_name, last_name, passwordHash, app_role, member_type]
    );

    const user = created[0];

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        dni: user.dni,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        app_role: user.app_role,
        member_type: user.member_type,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    if (err?.code === "23505") {
      // ahora el 23505 debería ser casi siempre por DNI, porque email ya no es unique
      return bad("Ya existe una cuenta con ese DNI.", 409);
    }
    console.error("REGISTER_ERROR:", err);
    return bad("Error interno.", 500);
  }
}
