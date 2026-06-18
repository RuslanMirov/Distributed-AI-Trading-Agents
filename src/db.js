import pg from "pg";
const { Pool } = pg;
const dotenv = require('dotenv').config()

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_assets (
      user_id TEXT PRIMARY KEY,
      assets  JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log("✅ user_assets table ready");
}

// upsert whole asset map for a user
export async function setAssets(userId, assets) {
  const { rows } = await pool.query(
    `INSERT INTO user_assets (user_id, assets, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (user_id)
     DO UPDATE SET assets = $2::jsonb, updated_at = now()
     RETURNING *`,
    [userId, JSON.stringify(assets)]
  );
  return rows[0];
}

// merge new assets into existing (add to balances)
export async function addAssets(userId, incoming) {
  const current = await getAssets(userId);
  const merged = { ...current };
  for (const [sym, amt] of Object.entries(incoming)) {
    merged[sym] = (merged[sym] ?? 0) + Number(amt);
  }
  return setAssets(userId, merged);
}

export async function getAssets(userId) {
  const { rows } = await pool.query(
    `SELECT assets FROM user_assets WHERE user_id = $1`,
    [userId]
  );
  return rows[0]?.assets ?? {};
}