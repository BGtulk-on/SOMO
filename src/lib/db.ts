import { Pool } from 'pg';

const rawConnectionString =
  process.env.SOMO_DB_POSTGRES_URL_NON_POOLING ||
  process.env.SOMO_DB_POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

const connectionString = rawConnectionString
  ? rawConnectionString.replace(/\?.*$/, '')
  : undefined;

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForDb.pool ??
  (connectionString
    ? new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
      })
    : undefined);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}
