'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './DesignCanvasElements.module.scss';

export function DesignCanvasElements() {
  const stageRef = useRef<HTMLDivElement>(null);
  const colorSwatchRef = useRef<HTMLDivElement>(null);
  const fontSpecimenRef = useRef<HTMLDivElement>(null);
  const imageHolderRef = useRef<HTMLDivElement>(null);
  const iconCardRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(colorSwatchRef.current, {
        y: -18,
        rotation: -12,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(fontSpecimenRef.current, {
        y: 14,
        x: -6,
        rotation: 3,
        duration: 4.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(imageHolderRef.current, {
        y: -20,
        rotation: -2,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(iconCardRef.current, {
        y: 16,
        rotation: 6,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(ringRef.current, {
        y: -12,
        x: 8,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(stampRef.current, {
        y: 12,
        rotation: 15,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const xPos = (e.clientX / innerWidth - 0.5) * 30;
        const yPos = (e.clientY / innerHeight - 0.5) * 30;

        gsap.to(colorSwatchRef.current, {
          x: xPos * 1.2,
          y: yPos * 1.2,
          duration: 1.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        gsap.to(fontSpecimenRef.current, {
          x: xPos * 0.8,
          y: yPos * 0.8,
          duration: 1.4,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        gsap.to(imageHolderRef.current, {
          x: xPos * 1.5,
          y: yPos * 1.5,
          duration: 1,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        gsap.to(iconCardRef.current, {
          x: xPos * 1.8,
          y: yPos * 1.8,
          duration: 0.9,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        gsap.to(stampRef.current, {
          x: xPos * 1.1,
          y: yPos * 1.1,
          duration: 1.3,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={stageRef} className={styles.canvasStage}>
      <div ref={colorSwatchRef} className={styles.colorSwatchBox}>
        <div className={styles.swatchStrip}>
          <div className={styles.swatchSegmentGreen} />
          <div className={styles.swatchSegmentOrange} />
          <div className={styles.swatchSegmentWhite} />
        </div>
        <div className={styles.swatchFooter}>
          <span className={styles.swatchCode}>#439B38 / #F16B24</span>
          <span className={styles.swatchName}>BRAND SPECTRUM</span>
        </div>
      </div>

      <div ref={fontSpecimenRef} className={styles.fontSpecimenBox}>
        <div className={styles.fontDisplay}>Aa Zz</div>
        <div className={styles.fontMeta}>
          <span>DISPLAY MONO</span>
          <span>48PT</span>
        </div>
      </div>

      <div ref={imageHolderRef} className={styles.imageHolderBox}>
        <div className={styles.imageFrame}>
          <span className={styles.frameTag}>See it</span>
        </div>
        <div className={styles.imageCaption}>16:9 CANVAS</div>
      </div>

      <div ref={iconCardRef} className={styles.radiantIconCard}>
        <div className={styles.radiantRays}>
          <span className={styles.ray} />
          <span className={styles.ray} />
          <span className={styles.ray} />
          <span className={styles.ray} />
          <span className={styles.ray} />
          <span className={styles.ray} />
          <span className={styles.ray} />
          <span className={styles.ray} />
        </div>
        <div className={styles.iconInner}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </div>

      <div ref={ringRef} className={styles.floatingRing}>
        <div className={styles.ringCircle} />
      </div>

      <div ref={stampRef} className={styles.stampBadge}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f16b24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
    </div>
  );
}
