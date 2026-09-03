'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from '@/lib/auth-client';
import styles from './login.module.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = emailTouched && !isEmailValid;
  const showPasswordError = passwordTouched && !password;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isEmailValid || !password) {
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (res?.error) {
        setErrorMessage(res.error.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await signIn.passkey();
      setSuccessMessage('Passkey verified! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Passkey authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/logos/logo_nobg.png" alt="SOMO" width={32} height={32} />
            <span className={styles.brandTitle}>SOMO</span>
          </Link>
          <h1 className={styles.title}>Sign in to your workspace</h1>
          <p className={styles.subtitle}>Enter your credentials or use hardware passkey</p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner}>{errorMessage}</div>
        )}

        {successMessage && (
          <div className={styles.successBanner}>{successMessage}</div>
        )}

        <button
          type="button"
          onClick={handlePasskeyLogin}
          disabled={true}
          className={styles.passkeyBtn}
        >
          <span className={styles.passkeyIcon}>🔑</span>
          Sign in with Passkey (currently not working)
        </button>

        <div className={styles.divider}>
          <span>or continue with email</span>
        </div>

        <form onSubmit={handlePasswordLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Work Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              disabled={isLoading}
              required
              className={showEmailError ? styles.inputError : ''}
            />
            {showEmailError && (
              <span className={styles.errorHint}>
                {email.trim().length === 0 ? 'Work email is required' : 'Please enter a valid email address'}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                disabled={isLoading}
                required
                className={showPasswordError ? styles.inputError : ''}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {showPasswordError && (
              <span className={styles.errorHint}>Password is required</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={styles.submitBtn}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Don&apos;t have an account?</span>{' '}
          <Link href="/register" className={styles.switchLink}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
