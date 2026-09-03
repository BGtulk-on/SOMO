'use client';

import { forwardRef } from 'react';
import styles from './ContactSection.module.scss';

export const ContactSection = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section ref={ref} className={styles.contactContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>
          Have thoughts or questions about <span className={styles.accentWord}>SOMO</span>?
        </h2>

        <p className={styles.subtitle}>
          Reach out for feature suggestions, feedback, bug reports, or anything regarding the app.
        </p>

        <div className={styles.cardsGrid}>
          <a
            href="https://bgtulk.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactCard}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span className={styles.cardTag}>Creator</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardLabel}>Creator Portfolio</div>
              <div className={styles.cardValue}>bgtulk.dev</div>
              <p className={styles.cardDescription}>
                See more tools, visual experiments, and the builder behind SOMO.
              </p>
            </div>

            <div className={styles.cardFooter}>
              <span>View portfolio</span>
              <span className={styles.actionArrow}>→</span>
            </div>
          </a>

          <a
            href="mailto:bgtulk123@gmail.com"
            className={styles.contactCard}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <span className={styles.cardTag}>App Feedback</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardLabel}>Direct Email</div>
              <div className={styles.cardValue}>bgtulk123@gmail.com</div>
              <p className={styles.cardDescription}>
                Send feedback, suggest features, or report any issues with the app.
              </p>
            </div>

            <div className={styles.cardFooter}>
              <span>Send message</span>
              <span className={styles.actionArrow}>→</span>
            </div>
          </a>
        </div>

        <div className={styles.footerNote}>
          <span>SOMO App</span>
          <span className={styles.footerDot} />
          <span>Built by bgtulk</span>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';
