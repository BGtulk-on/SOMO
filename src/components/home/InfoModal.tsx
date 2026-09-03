'use client';

import styles from './InfoModal.module.scss';

interface InfoModalProps {
  isOpen: boolean;
  type: 'WHAT' | 'CONTACT' | null;
  onClose: () => void;
}

export function InfoModal({ isOpen, type, onClose }: InfoModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {type === 'WHAT' ? 'What is SOMO?' : 'Get in Touch'}
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {type === 'WHAT' ? (
            <div className={styles.bodyText}>
              <p>
                SOMO is the collaborative visual workspace to craft the design language, color spectrums, typography, and layout prototypes for your web projects before writing code.
              </p>
              <div className={styles.highlights}>
                <div className={styles.highlightItem}>
                  <span className={styles.highlightTag}>01</span>
                  <div>
                    <strong>Visual Design Tokens</strong>
                    <p>Curate palettes, typefaces, and image aspect ratios collaboratively.</p>
                  </div>
                </div>
                <div className={styles.highlightItem}>
                  <span className={styles.highlightTag}>02</span>
                  <div>
                    <strong>Hardware Security</strong>
                    <p>Protected by WebAuthn Passkeys and PostgreSQL Row Level Security.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.bodyText}>
              <p>
                Connect with the SOMO engineering and design team.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email:</span>
                  <a href="mailto:hello@somo.design" className={styles.contactLink}>hello@somo.design</a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Workspace:</span>
                  <span>Sofia / Remote Worldwide</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
