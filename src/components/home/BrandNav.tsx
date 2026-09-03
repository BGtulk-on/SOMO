'use client';

import styles from './BrandNav.module.scss';

interface BrandNavProps {
  activeSection: 'HOME' | 'WHAT' | 'PRICES' | 'CONTACT';
  onNavigateHome?: () => void;
  onNavigateWhat?: () => void;
  onNavigatePrices?: () => void;
  onOpenContact?: () => void;
}

export function BrandNav({
  activeSection,
  onNavigateHome,
  onNavigateWhat,
  onNavigatePrices,
  onOpenContact,
}: BrandNavProps) {
  return (
    <div className={styles.brandNavContainer}>
      <div className={styles.brandTitleWrapper} onClick={onNavigateHome}>
        <span className={styles.brandTitle}>SOMO</span>
      </div>

      <nav className={styles.navList}>
        <button
          type="button"
          onClick={onNavigateHome}
          className={`${styles.navItem} ${activeSection === 'HOME' ? styles.active : ''}`}
        >
          HOME
        </button>
        <button
          type="button"
          onClick={onNavigateWhat}
          className={`${styles.navItem} ${activeSection === 'WHAT' ? styles.active : ''}`}
        >
          WHAT?
        </button>
        <button
          type="button"
          onClick={onNavigatePrices}
          className={`${styles.navItem} ${activeSection === 'PRICES' ? styles.active : ''}`}
        >
          PRICES
        </button>
        <button
          type="button"
          onClick={onOpenContact}
          className={`${styles.navItem} ${activeSection === 'CONTACT' ? styles.active : ''}`}
        >
          CONTACT
        </button>
      </nav>
    </div>
  );
}
