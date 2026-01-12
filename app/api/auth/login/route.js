import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { query } from "@/lib/db";

function bad(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function cookieName() {
  return process.env.SESSION_COOKIE_NAME || "session";
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const dni = (body?.dni ?? "").toString().trim();
    const password = (body?.password ?? "").toString();

    if (!dni || !password) return bad("DNI y contraseña son requeridos.", 400);

    const { rows } = await query(
      `
      select id, dni, email, first_name, last_name,
             password_hash, app_role, member_type, member_number, is_active
      from users
      where dni = $1
      limit 1
      `,
      [dni]
    );

    if (rows.length === 0) return bad("Credenciales inválidas.", 401);

    const user = rows[0];
    if (!user.is_active) return bad("Cuenta deshabilitada.", 403);

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return bad("Credenciales inválidas.", 401);

    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
      return bad("AUTH_SECRET inválido o no configurado.", 500);
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60 * 24 * 7; // 7 días

    const token = await new SignJWT({
      app_role: user.app_role,
      member_type: user.member_type,
      member_number: user.member_number,
      dni: user.dni,
      email: user.email,

      // ✅ NUEVO
      first_name: user.first_name,
      last_name: user.last_name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(String(user.id))
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .sign(new TextEncoder().encode(secret));

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        dni: user.dni,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        app_role: user.app_role,
        member_type: user.member_type,
        member_number: user.member_number,
      },
    });

    res.cookies.set({
      name: cookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    return res;
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return bad("Error interno.", 500);
  }
}
