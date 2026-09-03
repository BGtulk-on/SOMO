'use client';

import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './HeroCanvas.module.scss';

interface HeroCanvasProps {
  onNavigatePrices?: () => void;
}

export const HeroCanvas = forwardRef<HTMLDivElement, HeroCanvasProps>(({ onNavigatePrices }, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const stemRef = useRef<SVGLineElement>(null);
  const topWingRef = useRef<SVGLineElement>(null);
  const bottomWingRef = useRef<SVGLineElement>(null);

  const handleHoverEnter = () => {
    if (!stemRef.current || !topWingRef.current || !bottomWingRef.current) return;
    gsap.to(stemRef.current, {
      attr: { x1: 2, y1: 15.5, x2: 21, y2: 15.5 },
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(topWingRef.current, {
      attr: { x1: 13, y1: 7.5, x2: 21, y2: 15.5 },
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(bottomWingRef.current, {
      attr: { x1: 13, y1: 23.5, x2: 21, y2: 15.5 },
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleHoverLeave = () => {
    if (!stemRef.current || !topWingRef.current || !bottomWingRef.current) return;
    gsap.to(stemRef.current, {
      attr: { x1: 5, y1: 4.5, x2: 5, y2: 19.5 },
      duration: 0.25,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
    gsap.to(topWingRef.current, {
      attr: { x1: 5, y1: 26.5, x2: 5, y2: 26.5 },
      duration: 0.25,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
    gsap.to(bottomWingRef.current, {
      attr: { x1: 5, y1: 26.5, x2: 5, y2: 26.5 },
      duration: 0.25,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  };

  useEffect(() => {
    const el = (ref && 'current' in ref && ref.current) || localRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const swatch = el.querySelector('[data-elem="swatch"]');
      const font = el.querySelector('[data-elem="font"]');
      const photo = el.querySelector('[data-elem="photo"]');
      const icon = el.querySelector('[data-elem="icon"]');
      const ring = el.querySelector('[data-elem="ring"]');
      const sticker = el.querySelector('[data-elem="sticker"]');
      const bgGrid = el.querySelector('[data-elem="bg-grid"]');
      const bgCross = el.querySelector('[data-elem="bg-cross"]');

      gsap.to(swatch, {
        y: -16,
        rotation: -8,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(font, {
        y: 12,
        x: -4,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(photo, {
        y: -18,
        rotation: 4,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(icon, {
        y: 14,
        rotation: 6,
        duration: 4.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(ring, {
        y: -10,
        x: 6,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(sticker, {
        y: 12,
        rotation: 15,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(bgGrid, {
        y: -8,
        x: 8,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(bgCross, {
        y: 10,
        x: -6,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const normX = (e.clientX / innerWidth - 0.5) * 40;
        const normY = (e.clientY / innerHeight - 0.5) * 40;

        gsap.to(swatch, { x: normX * 1.3, y: normY * 1.3, duration: 1.2, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(font, { x: normX * 0.7, y: normY * 0.7, duration: 1.4, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(photo, { x: normX * 1.6, y: normY * 1.6, duration: 1, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(icon, { x: normX * 1.9, y: normY * 1.9, duration: 0.9, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(ring, { x: normX * 0.5, y: normY * 0.5, duration: 1.5, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(sticker, { x: normX * 1.1, y: normY * 1.1, duration: 1.1, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(bgGrid, { x: normX * 0.25, y: normY * 0.25, duration: 1.8, ease: 'power1.out', overwrite: 'auto' });
        gsap.to(bgCross, { x: normX * 0.3, y: normY * 0.3, duration: 1.6, ease: 'power1.out', overwrite: 'auto' });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, el);

    return () => ctx.revert();
  }, [ref]);

  return (
    <div ref={ref || localRef} className={styles.heroCanvasWrapper}>
      {/* Background Ambient Elements */}
      <div className={styles.bgGridDots} data-elem="bg-grid">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="12" cy="12" r="1.5" fill="#3a4454" />
          <circle cx="36" cy="12" r="1.5" fill="#3a4454" />
          <circle cx="60" cy="12" r="1.5" fill="#3a4454" />
          <circle cx="12" cy="36" r="1.5" fill="#3a4454" />
          <circle cx="36" cy="36" r="1.5" fill="#3a4454" />
          <circle cx="60" cy="36" r="1.5" fill="#3a4454" />
          <circle cx="12" cy="60" r="1.5" fill="#3a4454" />
          <circle cx="36" cy="60" r="1.5" fill="#3a4454" />
          <circle cx="60" cy="60" r="1.5" fill="#3a4454" />
        </svg>
      </div>

      <div className={styles.bgCoordinateCross} data-elem="bg-cross">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2d3644" strokeWidth="1">
          <line x1="16" y1="4" x2="16" y2="28" />
          <line x1="4" y1="16" x2="28" y2="16" />
        </svg>
      </div>

      {/* 1. Star Stamp Badge (Placed away from top-left wheel) */}
      <div className={styles.stickerStamp} data-hero-elem data-elem="sticker">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f16b24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      {/* 2. Unboxed Floating Typography */}
      <div className={styles.fontSpecimen} data-hero-elem data-elem="font">
        <span className={styles.fontBig}>Aa Zz</span>
        <span className={styles.fontTag}>48px Fraunces Serif</span>
      </div>

      {/* 3. Polaroid / Wireframe Aspect Photo Card */}
      <div className={styles.photoFrame} data-hero-elem data-elem="photo">
        <div className={styles.photoInner}>
          <div className={styles.photoCrossL} />
          <div className={styles.photoCrossR} />
          <span className={styles.photoLabel}>See it</span>
        </div>
      </div>

      {/* 4. Radiant Icon Burst */}
      <div className={styles.radiantIcon} data-hero-elem data-elem="icon">
        <div className={styles.rays}>
          <span className={styles.ray} /><span className={styles.ray} />
          <span className={styles.ray} /><span className={styles.ray} />
          <span className={styles.ray} /><span className={styles.ray} />
          <span className={styles.ray} /><span className={styles.ray} />
        </div>
        <div className={styles.iconCenter}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </div>

      {/* 5. Geometric Ring with Crosshair */}
      <div className={styles.ringGraphic} data-hero-elem data-elem="ring">
        <div className={styles.ringCircle} />
        <span className={styles.ringCrosshairH} />
        <span className={styles.ringCrosshairV} />
      </div>

      {/* 6. Color Fan Swatch */}
      <div className={styles.colorSwatch} data-hero-elem data-elem="swatch">
        <div className={styles.colorChipGreen}>
          <span>#439B38</span>
        </div>
        <div className={styles.colorChipOrange}>
          <span>#F16B24</span>
        </div>
        <div className={styles.colorChipWhite}>
          <span>#F2F4F8</span>
        </div>
      </div>

      <div className={styles.mottoWrapper} data-hero-motto>
        <h2 className={styles.mottoText}>
          First see it, then{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNavigatePrices?.();
            }}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            className={styles.makeItBtn}
          >
            <span className={styles.makeItLabel}>make it</span><span className={styles.morphSlot}>
              <svg
                className={styles.morphSvg}
                viewBox="0 0 26 32"
                fill="none"
              >
                <line
                  ref={stemRef}
                  x1="5"
                  y1="4.5"
                  x2="5"
                  y2="19.5"
                  stroke="#f16b24"
                  strokeWidth="3.0"
                  strokeLinecap="round"
                />
                <line
                  ref={topWingRef}
                  x1="5"
                  y1="26.5"
                  x2="5"
                  y2="26.5"
                  stroke="#f16b24"
                  strokeWidth="3.0"
                  strokeLinecap="round"
                />
                <line
                  ref={bottomWingRef}
                  x1="5"
                  y1="26.5"
                  x2="5"
                  y2="26.5"
                  stroke="#f16b24"
                  strokeWidth="3.0"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <svg
              className={styles.makeItWave}
              viewBox="0 0 100 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 6 Q 12.5 0, 25 6 T 50 6 T 75 6 T 100 6"
                stroke="#439b38"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </h2>
      </div>
    </div>
  );
});

HeroCanvas.displayName = 'HeroCanvas';
