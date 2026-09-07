'use client';

import { forwardRef, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import styles from './PricesSection.module.scss';

export const PricesSection = forwardRef<HTMLDivElement>((_, ref) => {
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = (ref && 'current' in ref && ref.current) || localRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const iconFloat = el.querySelector('[data-elem="icon-float"]');
      const startFloat = el.querySelector('[data-elem="start-float"]');
      const photoFloat = el.querySelector('[data-elem="photo-float"]');
      const colorFloat = el.querySelector('[data-elem="color-float"]');

      const iconParallax = el.querySelector('[data-elem="icon-parallax"]');
      const startParallax = el.querySelector('[data-elem="start-parallax"]');
      const photoParallax = el.querySelector('[data-elem="photo-parallax"]');
      const colorParallax = el.querySelector('[data-elem="color-parallax"]');

      gsap.to(iconFloat, {
        y: -5,
        x: 2,
        rotation: -7,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(startFloat, {
        y: 4,
        x: -2,
        rotation: -8,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(photoFloat, {
        y: -6,
        x: 3,
        rotation: 6,
        duration: 6.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(colorFloat, {
        y: 5,
        x: -2,
        rotation: -10,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const normX = (e.clientX / innerWidth - 0.5) * 14;
        const normY = (e.clientY / innerHeight - 0.5) * 14;

        gsap.to(iconParallax, {
          x: normX * 0.5,
          y: normY * 0.5,
          duration: 1.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(startParallax, {
          x: normX * 0.7,
          y: normY * 0.7,
          duration: 1.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(photoParallax, {
          x: normX * 0.8,
          y: normY * 0.8,
          duration: 1.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(colorParallax, {
          x: normX * 0.6,
          y: normY * 0.6,
          duration: 1.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, el);

    return () => ctx.revert();
  }, [ref]);

  return (
    <section ref={ref || localRef} className={styles.pricesContainer}>
      <div className={styles.iconParallax} data-elem="icon-parallax">
        <div className={styles.iconCard} data-elem="icon-float">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f16b24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z" />
          </svg>
        </div>
      </div>

      <div className={styles.layoutBody}>
        <div className={styles.tiersWrapper}>
          <div className={styles.waveWrapper}>
            <svg className={styles.waveSvg} width="100%" height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="none">
              <path d="M 0 12 C 40 2, 60 22, 100 12 S 160 2, 200 12" stroke="#439b38" strokeWidth="2" strokeDasharray="4 3" />
            </svg>
          </div>

          <div className={styles.columnsGrid}>
            <div className={styles.tierColumn}>
              <div className={styles.pillFree}>FREE</div>
              <div className={styles.verticalStem}>
                <svg width="2" height="14" viewBox="0 0 2 14" fill="none">
                  <line x1="1" y1="0" x2="1" y2="14" stroke="#334255" strokeWidth="2" />
                </svg>
              </div>

              <div className={styles.pricingCard}>
                <div className={styles.cardHeading}>
                  <span className={styles.planName}>Basic</span>
                  <div className={styles.priceLine}>
                    <span className={styles.priceAmount}>0€</span>
                    <span className={styles.priceCadence}>/ mo</span>
                  </div>
                </div>

                <ul className={styles.featuresList}>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Dashboard with colors up to 6</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Fonts up to 3</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Images up to 6</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Icons up to 9</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Signature elements up to 3</span>
                  </li>
                </ul>

                <div className={styles.cardAction}>
                  <Link href="/register" className={styles.actionButtonSecondary}>
                    Start for free!
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.tierColumn}>
              <div className={styles.pillPremium}>PREMIUM</div>
              <div className={styles.verticalStem}>
                <svg width="2" height="14" viewBox="0 0 2 14" fill="none">
                  <line x1="1" y1="0" x2="1" y2="14" stroke="#f16b24" strokeWidth="2" />
                </svg>
              </div>

              <div className={`${styles.pricingCard} ${styles.highlightedCard}`}>
                <div className={styles.cardHeading}>
                  <span className={styles.planName}>Pro</span>
                  <div className={styles.priceLine}>
                    <span className={styles.priceAmount}>2€</span>
                    <span className={styles.priceCadence}>/ mo</span>
                  </div>
                </div>

                <ul className={styles.featuresList}>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Infinity colors, fonts & icons</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Images up to 20</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Signature elements up to 8</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>+ Detailed view</span>
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Live collaboration</span>
                  </li>
                </ul>

                <div className={styles.cardAction}>
                  <Link href="/register" className={styles.actionButtonPrimary}>
                    Start with boost!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.startNowParallax} data-elem="start-parallax">
          <div className={styles.startNowFloat} data-elem="start-float">
            <span className={styles.startNowText}>Start Now?</span>
          </div>
        </div>
      </div>

      <div className={styles.photoParallax} data-elem="photo-parallax">
        <div className={styles.photoFloat} data-elem="photo-float">
          <div className={styles.photoFrame}>
            <div className={styles.photoInner}>
              <div className={styles.photoCrossL} />
              <div className={styles.photoCrossR} />
              <span className={styles.photoLabel}>16:9 Canvas</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.colorParallax} data-elem="color-parallax">
        <div className={styles.colorFloat} data-elem="color-float">
          <div className={styles.colorChip}>
            <span className={styles.chipHex}>#439B38</span>
          </div>
        </div>
      </div>
    </section>
  );
});

PricesSection.displayName = 'PricesSection';
