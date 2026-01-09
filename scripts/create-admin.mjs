import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Falta DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

// Cambiá estos datos
const dni = "12345678";
const email = "admin@club.com";
const password = "ClaveMuySegura2026!";

const app_role = "ADMIN";        
const member_type = null;       

const passwordHash = await bcrypt.hash(password, 12);
console.log("Generated hash len:", passwordHash.length); // 60

await pool.query(
  `
  insert into users (dni, email, password_hash, app_role, member_type, is_active)
  values ($1, $2, $3, $4::app_role, $5::member_type, true)
  on conflict (dni) do update
    set email = excluded.email,
        password_hash = excluded.password_hash,
        app_role = excluded.app_role,
        member_type = excluded.member_type,
        is_active = true
  `,
  [dni, email, passwordHash, app_role, member_type]
);

console.log("Admin creado/actualizado:", dni, app_role);

await pool.end();
