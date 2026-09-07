import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from '@better-auth/passkey/client';
import { twoFactorClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [
    passkeyClient(),
    twoFactorClient(),
  ],
});

export const { signIn, signUp, useSession, signOut, sendVerificationEmail } = authClient;
