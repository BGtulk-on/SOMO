'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './RotatingQuarterLogo.module.scss';

export function RotatingQuarterLogo() {
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 32,
        repeat: -1,
        ease: 'none',
      });
    }, wheelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={wheelRef} className={styles.wheel}>
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
}
