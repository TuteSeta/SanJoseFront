import { Pool } from "pg";

const globalForPg = globalThis;

const pool =
  globalForPg.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForPg.__pgPool = pool;

export async function query(text, params) {
  return pool.query(text, params);
}
