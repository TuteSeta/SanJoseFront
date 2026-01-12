import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";

export async function GET(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET)
    );
    console.log("JWT payload:", payload);

    return NextResponse.json({

      ok: true,
      user: {
        id: payload.sub,
        dni: payload.dni,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        full_name: `${payload.first_name ?? ""} ${payload.last_name ?? ""}`.trim(),
        app_role: payload.app_role,
        member_type: payload.member_type,
        member_number: payload.member_number,
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
