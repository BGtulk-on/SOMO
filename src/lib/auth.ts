import { betterAuth } from 'better-auth';
import { passkey } from '@better-auth/passkey';
import { twoFactor } from 'better-auth/plugins';
import { Pool } from 'pg';
import { Resend } from 'resend';

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

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-key-change-in-production',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      if (resend) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'SOMO <onboarding@resend.dev>',
            to: user.email,
            subject: 'Verify your email - SOMO',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0d11; color: #f2f4f8; padding: 40px 20px;">
                <div style="max-width: 480px; margin: 0 auto; background-color: #12151c; border: 1px solid #222834; border-radius: 12px; padding: 32px; text-align: center;">
                  <h1 style="font-size: 20px; font-weight: 700; color: #f2f4f8; margin: 0 0 12px 0;">Verify your SOMO account</h1>
                  <p style="font-size: 14px; color: #8b94a0; line-height: 1.5; margin: 0 0 24px 0;">
                    Click the button below to verify your email address and activate your workspace.
                  </p>
                  <a href="${url}" style="display: inline-block; background-color: #f16b24; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 8px;">
                    Verify Email Address
                  </a>
                  <p style="font-size: 12px; color: #5c6470; margin: 24px 0 0 0;">
                    If you did not request this, you can safely ignore this email.
                  </p>
                </div>
              </div>
            `,
          });
        } catch (error) {
          console.error('[Resend Error]:', error);
        }
      } else {
        console.log('\n================ VERIFICATION EMAIL ================');
        console.log('To:', user.email);
        console.log('Verification URL:', url);
        console.log('====================================================\n');
      }
    },
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
