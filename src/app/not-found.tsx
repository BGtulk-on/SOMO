'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './not-found.module.scss';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.notFoundContainer}>
      <header className={styles.topNav}>
        <Link href="/dashboard" className={styles.tabPremium}>
          Premium
        </Link>

        <Link href="/dashboard" className={styles.tabHome}>
          Home
        </Link>

        <Link href="/dashboard" className={styles.tabAccount}>
          Account
        </Link>
      </header>

      <main className={styles.canvasArea}>
        <div className={styles.diamondShape} />

        <div className={styles.topRightGroup}>
          <div className={styles.outlineRectangle} />
          <div className={styles.accentSquare} />
        </div>

        <div className={styles.bottomLeftGroup}>
          <div className={styles.greenSquare} />
          <div className={styles.circleShape} />
        </div>

        <div className={styles.centerPrompt}>
          <h1 className={styles.errorCode}>Error 404</h1>
          <p className={styles.errorMessage}>This page does not exist...</p>
          <button
            type="button"
            onClick={handleGoBack}
            className={styles.backLink}
          >
            Try going back?
          </button>
        </div>
      </main>
    </div>
  );
}
