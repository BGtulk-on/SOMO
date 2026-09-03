import { betterAuth } from 'better-auth';
import { passkey } from '@better-auth/passkey';
import { twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
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
