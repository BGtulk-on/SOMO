import { betterAuth } from 'better-auth';
import { passkey } from '@better-auth/passkey';
import { twoFactor } from 'better-auth/plugins';
import { Pool } from 'pg';

const rawConnectionString =
  process.env.SOMO_DB_POSTGRES_URL ||
  process.env.SOMO_DB_POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

const connectionString = rawConnectionString
  ? rawConnectionString.replace(/\?.*$/, '')
  : undefined;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : undefined;

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-key-change-in-production',
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    window: 60,
    max: 100,
  },
  plugins: [
    passkey(),
    twoFactor(),
  ],
});
