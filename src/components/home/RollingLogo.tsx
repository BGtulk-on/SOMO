'use client';

import { forwardRef, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './RollingLogo.module.scss';

export const RollingLogo = forwardRef<HTMLDivElement>((_, ref) => {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 26,
        repeat: -1,
        ease: 'none',
      });
    }, spinnerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={styles.logoWrapper}>
      <div ref={spinnerRef} className={styles.spinner}>
        <Image
          src="/logos/logo_nobg.png"
          alt="SOMO Wheel"
          width={480}
          height={480}
          priority
          className={styles.image}
        />
      </div>
    </div>
  );
});

RollingLogo.displayName = 'RollingLogo';
