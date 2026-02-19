import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";

/**
 * Verifica que la request proviene de un usuario con app_role = 'ADMIN'.
 *
 * Uso en route handlers:
 *   const { payload, errorResponse } = await requireAdmin();
 *   if (errorResponse) return errorResponse;
 *
 * @returns {{ payload: object, errorResponse: null } | { payload: null, errorResponse: NextResponse }}
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return {
      payload: null,
      errorResponse: NextResponse.json(
        { ok: false, message: "No autenticado." },
        { status: 401 }
      ),
    };
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    return {
      payload: null,
      errorResponse: NextResponse.json(
        { ok: false, message: "Error de configuración del servidor." },
        { status: 500 }
      ),
    };
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (payload.app_role !== "ADMIN") {
      return {
        payload: null,
        errorResponse: NextResponse.json(
          { ok: false, message: "Acceso denegado. Se requiere rol ADMIN." },
          { status: 403 }
        ),
      };
    }

    return { payload, errorResponse: null };
  } catch {
    return {
      payload: null,
      errorResponse: NextResponse.json(
        { ok: false, message: "Token inválido o expirado." },
        { status: 401 }
      ),
    };
  }
}
