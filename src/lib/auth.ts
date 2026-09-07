import { betterAuth } from 'better-auth';
import { passkey } from '@better-auth/passkey';
import { twoFactor } from 'better-auth/plugins';
import { pool } from './db';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === 'production') return 'https://somo.bgtulk.dev';
  return 'http://localhost:3000';
};

export const auth = betterAuth({
  database: pool,
  baseURL: getBaseURL(),
  trustedOrigins: async (request) => {
    const origin = request?.headers?.get('origin') || request?.headers?.get('referer');
    const staticOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://somo.bgtulk.dev',
      'http://somo.bgtulk.dev',
      'https://*.bgtulk.dev',
      'http://*.bgtulk.dev',
      'https://*.vercel.app',
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
      ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
    ].filter(Boolean) as string[];

    if (origin) {
      try {
        const parsed = new URL(origin);
        if (
          parsed.hostname.endsWith('bgtulk.dev') ||
          parsed.hostname.endsWith('vercel.app') ||
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1'
        ) {
          return [...staticOrigins, parsed.origin];
        }
      } catch {}
    }
    return staticOrigins;
  },
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-key-change-in-production',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const apiKey = process.env.RESEND_API_KEY;
      const resendClient = apiKey ? new Resend(apiKey) : null;
      if (resendClient) {
        try {
          const { data, error } = await resendClient.emails.send({
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
          if (error) {
            console.error('[Resend Error]:', error);
            console.log('Verification URL fallback:', url);
          }
        } catch (error) {
          console.error('[Resend Error]:', error);
          console.log('Verification URL fallback:', url);
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
