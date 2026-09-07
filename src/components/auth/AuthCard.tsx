'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { signIn, signUp, sendVerificationEmail, useSession } from '@/lib/auth-client';
import styles from './AuthCard.module.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;

interface AuthCardProps {
  initialMode: 'LOGIN' | 'REGISTER';
}

export function AuthCard({ initialMode }: AuthCardProps) {
  const { data: session, isPending } = useSession();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const btnTextRef = useRef<HTMLSpanElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const successBoxRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<SVGSVGElement>(null);
  const isSuccessAnimatingRef = useRef(false);

  const isNameValid = NAME_REGEX.test(name.trim());
  const showNameError = mode === 'REGISTER' && nameTouched && !isNameValid;

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = emailTouched && !isEmailValid;

  const isPasswordValid = password.length >= 8;
  const showPasswordError = passwordTouched && (mode === 'REGISTER' ? !isPasswordValid : !password);

  useEffect(() => {
    if (!isPending && session?.user && !isSuccessAnimatingRef.current) {
      window.location.href = '/dashboard';
    }
  }, [session, isPending]);

  useEffect(() => {
    const handlePopState = () => {
      const isRegisterPath = window.location.pathname.includes('/register');
      const targetMode = isRegisterPath ? 'REGISTER' : 'LOGIN';
      animateSwitch(targetMode, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (initialMode !== mode) {
      animateSwitch(initialMode, false);
    }
  }, [initialMode]);

  const animateSwitch = (targetMode: 'LOGIN' | 'REGISTER', pushState = true) => {
    if (targetMode === mode) return;

    if (pushState) {
      window.history.pushState(null, '', targetMode === 'LOGIN' ? '/login' : '/register');
    }

    setErrorMessage('');
    setIsVerificationSent(false);
    setResendStatus('');
    setNameTouched(false);
    setEmailTouched(false);
    setPasswordTouched(false);

    const isToRegister = targetMode === 'REGISTER';

    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { rotation: isToRegister ? -360 : 360, scale: 0.8 },
        { rotation: 0, scale: 1, duration: 0.65, ease: 'back.out(1.4)' }
      );
    }

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: isToRegister ? 14 : -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { y: isToRegister ? 10 : -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: 0.04, ease: 'power2.out' }
      );
    }

    if (isToRegister) {
      if (nameFieldRef.current) {
        nameFieldRef.current.style.display = 'block';
        gsap.fromTo(
          nameFieldRef.current,
          { height: 0, opacity: 0, y: -10 },
          { height: 'auto', opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    } else {
      if (nameFieldRef.current) {
        gsap.to(nameFieldRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            if (nameFieldRef.current) {
              nameFieldRef.current.style.display = 'none';
            }
          },
        });
      }
    }

    if (btnTextRef.current) {
      gsap.fromTo(
        btnTextRef.current,
        { y: isToRegister ? 10 : -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }

    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }

    setMode(targetMode);
  };

  const playSuccessAnimation = (isRegister = false) => {
    if (!successBoxRef.current) {
      if (isRegister) {
        setIsVerificationSent(true);
      } else {
        window.location.href = '/dashboard';
      }
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (isRegister) {
          setIsVerificationSent(true);
          gsap.to(successBoxRef.current, {
            autoAlpha: 0,
            duration: 0.35,
          });
        } else {
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 360);
        }
      },
    });

    tl.fromTo(
      successBoxRef.current,
      {
        x: 280,
        autoAlpha: 0,
        scale: 0.85,
        width: 78,
        height: 78,
        borderRadius: 18,
      },
      {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
      }
    );

    tl.to(
      successBoxRef.current,
      {
        scale: 1.15,
        duration: 0.16,
        ease: 'power1.out',
      },
      '+=0.06'
    );

    tl.to(
      successBoxRef.current,
      {
        width: '105%',
        height: '105%',
        borderRadius: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',
      }
    );

    if (tickRef.current) {
      tl.to(
        tickRef.current,
        {
          scale: 1.6,
          duration: 0.45,
          ease: 'back.out(1.4)',
        },
        '-=0.5'
      );
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    try {
      await sendVerificationEmail({
        email,
        callbackURL: '/dashboard',
      });
      setResendStatus('Verification email resent!');
      setTimeout(() => setResendStatus(''), 4000);
    } catch {
      setResendStatus('Failed to send verification email');
    }
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) return;
    if (!isEmailValid || !password) {
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res?.error) {
        if (res.error.message?.toLowerCase().includes('verify') || res.error.status === 403) {
          setErrorMessage('Please verify your email address before signing in.');
        } else {
          setErrorMessage(res.error.message || 'Invalid email or password');
        }
        setIsLoading(false);
        return;
      }

      isSuccessAnimatingRef.current = true;
      playSuccessAnimation(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setNameTouched(true);
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard',
      });

      if (res?.error) {
        setErrorMessage(res.error.message || 'Registration failed');
        setIsLoading(false);
        return;
      }

      isSuccessAnimatingRef.current = true;
      playSuccessAnimation(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'LOGIN') {
      handlePasswordLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className={styles.authContainer}>
      <div ref={cardRef} className={styles.authCard}>
        <div className={styles.header}>
          <Link href="/" className={styles.logoRow}>
            <div className={styles.logoTrack}>
              <div ref={logoRef} className={styles.logoEmblem}>
                <Image src="/logos/logo_nobg.png" alt="SOMO" width={34} height={34} priority />
              </div>
              <span className={styles.brandTitle}>SOMO</span>
            </div>
          </Link>

          <div className={styles.headerContent}>
            <h1 ref={titleRef} className={styles.title}>
              {mode === 'LOGIN' ? 'Sign in to your workspace' : 'Create your account'}
            </h1>
            <p ref={subtitleRef} className={styles.subtitle}>
              {mode === 'LOGIN'
                ? 'Enter your credentials or use hardware passkey'
                : 'Start collaborating with hardware-level security'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner}>
            <div>{errorMessage}</div>
            {errorMessage.toLowerCase().includes('verify') && (
              <button
                type="button"
                onClick={handleResendVerification}
                className={styles.resendInlineBtn}
              >
                {resendStatus || 'Resend verification email'}
              </button>
            )}
          </div>
        )}

        <div ref={successBoxRef} className={styles.successBox}>
          <svg
            ref={tickRef}
            className={styles.successTick}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {isVerificationSent ? (
          <div className={styles.verificationCard}>
            <h2 className={styles.verificationTitle}>Check your inbox</h2>
            <p className={styles.verificationSubtitle}>
              We sent a verification link to <strong>{email}</strong>. Please check your email to activate your workspace.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              className={styles.resendBtn}
            >
              {resendStatus || 'Resend verification email'}
            </button>
            <div className={styles.footer}>
              <button
                type="button"
                onClick={() => {
                  setIsVerificationSent(false);
                  animateSwitch('LOGIN');
                }}
                className={styles.switchBtn}
              >
                Back to sign in
              </button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div
                ref={nameFieldRef}
                className={styles.nameCollapsible}
                style={{
                  height: mode === 'LOGIN' ? 0 : 'auto',
                  opacity: mode === 'LOGIN' ? 0 : 1,
                  display: mode === 'LOGIN' ? 'none' : 'block',
                }}
              >
            <div className={styles.inputGroup}>
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setNameTouched(true)}
                disabled={isLoading}
                required={mode === 'REGISTER'}
                className={showNameError ? styles.inputError : ''}
              />
              {showNameError && (
                <span className={styles.errorHint}>
                  {name.trim().length === 0
                    ? 'Full name is required'
                    : 'Enter a valid name (at least 2 letters)'}
                </span>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="auth-email">Work Email</label>
            <input
              id="auth-email"
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
                {email.trim().length === 0
                  ? 'Work email is required'
                  : 'Please enter a valid email address'}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="auth-password">
              {mode === 'REGISTER' ? 'Password (min. 8 characters)' : 'Password'}
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                disabled={isLoading}
                minLength={mode === 'REGISTER' ? 8 : undefined}
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {showPasswordError && (
              <span className={styles.errorHint}>
                {password.length === 0
                  ? 'Password is required'
                  : 'Password must be at least 8 characters'}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !email ||
              !password ||
              (mode === 'REGISTER' && (!name || !isNameValid || !isPasswordValid))
            }
            className={styles.submitBtn}
          >
            <span ref={btnTextRef} className={styles.btnText}>
              {isLoading
                ? mode === 'LOGIN'
                  ? 'Authenticating...'
                  : 'Creating Account...'
                : mode === 'LOGIN'
                ? 'Continue Designing'
                : 'Start Designing'}
            </span>
          </button>
        </form>

        <div ref={footerRef} className={styles.footer}>
          <span>
            {mode === 'LOGIN' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={() => animateSwitch(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
            className={styles.switchBtn}
          >
            {mode === 'LOGIN' ? 'Create one' : 'Sign in'}
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
