import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

const ALLOWED_MEMBER_TYPES = new Set([
  "SOCIO_PLENO",
  "SOCIO_SIMPLE",
  "SOCIO_DEPORTIVO",
]);

function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

function randomToken() {
  return crypto.randomBytes(32).toString("hex"); // 64 chars
}

function randomTempPassword() {
  return crypto.randomBytes(24).toString("base64url"); // seguro y largo
}

async function pickFamilyPlanId(memberCount) {
  const { rows } = await query(
    `
    select id, code
    from membership_plans
    where is_family = true
      and is_active = true
      and min_members <= $1
      and (max_members is null or max_members >= $1)
    order by
      case when max_members is null then 999999 else max_members end asc
    limit 1
    `,
    [memberCount]
  );
  if (!rows.length) return null;
  return rows[0]; // {id, code}
}

async function getOrCreateUser({ dni, email, password, member_type, is_minor }) {
  const { rows } = await query(
    `select id, dni, email, password_hash, app_role, member_type, is_active, plan_id
     from users
     where dni = $1
     limit 1`,
    [dni]
  );

  if (rows.length) {
    const u = rows[0];
    if (!u.is_active) throw new Error("Cuenta deshabilitada.");
    if (password) {
      const ok = await bcrypt.compare(password, u.password_hash);
      if (!ok) throw new Error("Credenciales inválidas para el DNI ingresado.");
    }
    return { user: u, created: false, invite: null };
  }

  // Crear usuario
  const app_role = "USER";

  let passwordToUse = password;

  // Si es mayor y no hay password (porque se setea por mail), generamos un temporal
  let invite = null;
  if (!is_minor && !passwordToUse) {
    passwordToUse = randomTempPassword();
    const token = randomToken();
    invite = { token, token_hash: sha256(token) };
  }

  if (!passwordToUse) {
    // menor SIN password => no permitido
    throw new Error("Falta contraseña para un menor.");
  }

  const passwordHash = await bcrypt.hash(passwordToUse, 12);

  const { rows: createdRows } = await query(
    `
    insert into users (dni, email, password_hash, app_role, member_type, is_active)
    values ($1, $2, $3, $4::app_role, $5::member_type, true)
    returning id, dni, email, app_role, member_type, is_active, plan_id
    `,
    [dni, email, passwordHash, app_role, member_type]
  );

  const newUser = createdRows[0];

  if (invite) {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 días
    await query(
      `
      insert into auth_invites (user_id, token_hash, purpose, expires_at)
      values ($1, $2, 'SET_PASSWORD', $3)
      `,
      [newUser.id, invite.token_hash, expiresAt]
    );
    return { user: newUser, created: true, invite: invite.token };
  }

  return { user: newUser, created: true, invite: null };
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    // Responsable
    const responsible = body?.responsible ?? {};
    const rDni = normalizeDni(responsible?.dni);
    const rEmail = normalizeEmail(responsible?.email);
    const rPassword = (responsible?.password ?? "").toString(); 
    const rMemberType = (responsible?.member_type ?? "").toString().trim();

    // Miembros
    const members = Array.isArray(body?.members) ? body.members : [];

    if (!rDni || !isValidDni(rDni)) return bad("DNI del responsable inválido.", 400);
    if (!rEmail || !isValidEmail(rEmail)) return bad("Email del responsable inválido.", 400);
    if (!rPassword || rPassword.length < 8) return bad("Contraseña del responsable inválida (mínimo 8).", 400);

    if (!ALLOWED_MEMBER_TYPES.has(rMemberType)) return bad("Tipo de socio del responsable inválido.", 400);

    // Validar miembros
    if (members.length < 1) return bad("El plan familiar debe incluir al menos 1 miembro adicional.", 400);

    const normalizedMembers = members.map((m, idx) => {
      const dni = normalizeDni(m?.dni);
      const email = normalizeEmail(m?.email);
      const member_type = (m?.member_type ?? "").toString().trim();
      const is_minor = Boolean(m?.is_minor);
      const password = (m?.password ?? "").toString(); 
      const relation = (m?.relation ?? "").toString().trim() || null;

      if (!dni || !isValidDni(dni)) throw new Error(`Miembro #${idx + 1}: DNI inválido.`);
      if (!email || !isValidEmail(email)) throw new Error(`Miembro #${idx + 1}: Email inválido.`);
      if (!ALLOWED_MEMBER_TYPES.has(member_type)) throw new Error(`Miembro #${idx + 1}: Tipo de socio inválido.`);

      return { dni, email, member_type, is_minor, password, relation };
    });

    const totalCount = 1 + normalizedMembers.length;

    const plan = await pickFamilyPlanId(totalCount);
    if (!plan) return bad("No hay un plan familiar activo para esa cantidad de miembros.", 400);

    await query("BEGIN");

    const rRes = await getOrCreateUser({
      dni: rDni,
      email: rEmail,
      password: rPassword,
      member_type: rMemberType,
      is_minor: false,
    });

    const responsibleUser = rRes.user;

    const { rows: fgRows } = await query(
      `
      insert into family_groups (plan_id, responsible_user_id)
      values ($1, $2)
      returning id, plan_id, responsible_user_id
      `,
      [plan.id, responsibleUser.id]
    );

    const familyGroup = fgRows[0];

    const responsibleBillingMode =
      responsibleUser.member_type === "SOCIO_PLENO" ? "INDIVIDUAL" : "FAMILY";

    await query(
      `
      insert into family_group_members (family_group_id, user_id, is_responsible, billing_mode, relation)
      values ($1, $2, true, $3::family_billing_mode, $4)
      `,
      [familyGroup.id, responsibleUser.id, responsibleBillingMode, "responsable"]
    );

    const createdUsers = [];
    const existingUsers = [];
    const invitesToSend = [];


    for (const m of normalizedMembers) {
      const result = await getOrCreateUser({
        dni: m.dni,
        email: m.email,
        password: m.password || "", 
        member_type: m.member_type,
        is_minor: m.is_minor,
      });

      const u = result.user;

      const billingMode = u.member_type === "SOCIO_PLENO" ? "INDIVIDUAL" : "FAMILY";

      await query(
        `
        insert into family_group_members (family_group_id, user_id, is_responsible, billing_mode, relation)
        values ($1, $2, false, $3::family_billing_mode, $4)
        `,
        [familyGroup.id, u.id, billingMode, m.relation]
      );

      if (result.created) createdUsers.push({ id: u.id, dni: u.dni, email: u.email, member_type: u.member_type });
      else existingUsers.push({ id: u.id, dni: u.dni, email: u.email, member_type: u.member_type });

      if (result.invite) {
        invitesToSend.push({
          dni: u.dni,
          email: u.email,
          invite_token: result.invite, 
        });
      }
    }

    await query("COMMIT");

    return NextResponse.json({
      ok: true,
      family: {
        id: familyGroup.id,
        plan_code: plan.code,
        total_members: totalCount,
        responsible: {
          id: responsibleUser.id,
          dni: responsibleUser.dni,
          email: responsibleUser.email,
          member_type: responsibleUser.member_type,
          billing_mode: responsibleBillingMode,
        },
      },
      created_users: createdUsers,
      existing_users: existingUsers,
      invites_to_send: invitesToSend, 
      note:
        "Para socios plenos dentro del plan familiar, el billing_mode queda en INDIVIDUAL (siguen pagando su plan).",
    });
  } catch (err) {
    try {
      await query("ROLLBACK");
    } catch {}
    
    if (err?.code === "23505") {
      return bad("Algún miembro ya pertenece a otro plan familiar.", 409);
    }
    console.error("FAMILY_REGISTER_ERROR:", err);
    return bad(err?.message || "Error interno.", 500);
  }
}
