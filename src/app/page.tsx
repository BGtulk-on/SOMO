'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { RollingLogo } from '@/components/home/RollingLogo';
import { BrandNav } from '@/components/home/BrandNav';
import { HeroCanvas } from '@/components/home/HeroCanvas';
import { WhatSection } from '@/components/home/WhatSection';
import { PricesSection } from '@/components/home/PricesSection';
import { ContactSection } from '@/components/home/ContactSection';
import { InfoModal } from '@/components/home/InfoModal';
import styles from './page.module.scss';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<'HOME' | 'WHAT' | 'PRICES' | 'CONTACT'>('HOME');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const heroCanvasRef = useRef<HTMLDivElement>(null);
  const whatSectionRef = useRef<HTMLDivElement>(null);
  const pricesSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getTargetX = () => {
        const vw = window.innerWidth;
        return vw - (vw < 768 ? 70 : 100);
      };

      const getTargetY = () => {
        const vh = window.innerHeight;
        return vh - (vh < 768 ? 70 : 100);
      };

      const getExitX = () => {
        const vw = window.innerWidth;
        return vw + 350;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTrackRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.5,
          snap: {
            snapTo: (value, self) => {
              if (isNavigatingRef.current) {
                return value;
              }
              if (self?.direction === 1) {
                if (value > 0.78) return 1;
                if (value > 0.45) return 0.6667;
                if (value > 0.12) return 0.3333;
                return 0;
              } else if (self?.direction === -1) {
                if (value < 0.22) return 0;
                if (value < 0.55) return 0.3333;
                if (value < 0.88) return 0.6667;
                return 1;
              }
              return gsap.utils.snap([0, 0.3333, 0.6667, 1], value);
            },
            duration: { min: 0.25, max: 0.5 },
            delay: 0.08,
            ease: 'power1.out',
          },
          onUpdate: (self) => {
            if (self.progress > 0.82) {
              setActiveSection('CONTACT');
            } else if (self.progress > 0.48) {
              setActiveSection('PRICES');
            } else if (self.progress > 0.15) {
              setActiveSection('WHAT');
            } else {
              setActiveSection('HOME');
            }
          },
        },
      });

      const heroElements = heroCanvasRef.current?.querySelectorAll('[data-hero-elem]');
      const heroMotto = heroCanvasRef.current?.querySelector('[data-hero-motto]');

      if (heroElements && heroElements.length > 0) {
        tl.to(
          heroElements,
          {
            opacity: 0,
            scale: 0.5,
            y: -50,
            stagger: 0.02,
            ease: 'power2.inOut',
          },
          0
        );
      }

      if (heroMotto) {
        tl.to(
          heroMotto,
          {
            opacity: 0,
            y: 35,
            ease: 'power2.inOut',
          },
          0
        );
      }

      tl.to(
        logoWrapperRef.current,
        {
          x: getTargetX,
          y: getTargetY,
          rotation: 720,
          scale: 0.6,
          ease: 'power2.inOut',
        },
        0
      );

      if (heroCanvasRef.current) {
        tl.to(
          heroCanvasRef.current,
          {
            autoAlpha: 0,
            pointerEvents: 'none',
            ease: 'power2.inOut',
          },
          0.1
        );
      }

      tl.fromTo(
        whatSectionRef.current,
        {
          autoAlpha: 0,
          y: 40,
          pointerEvents: 'none',
        },
        {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto',
          ease: 'power2.out',
        },
        0.3
      );

      tl.to(
        whatSectionRef.current,
        {
          autoAlpha: 0,
          y: -40,
          pointerEvents: 'none',
          ease: 'power2.in',
        },
        1.0
      );

      tl.to(
        logoWrapperRef.current,
        {
          x: getExitX,
          y: 0,
          rotation: 1440,
          ease: 'power2.inOut',
        },
        1.0
      );

      tl.fromTo(
        pricesSectionRef.current,
        {
          autoAlpha: 0,
          y: 40,
          pointerEvents: 'none',
        },
        {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto',
          ease: 'power2.out',
        },
        1.3
      );

      tl.to(
        pricesSectionRef.current,
        {
          autoAlpha: 0,
          y: -40,
          pointerEvents: 'none',
          ease: 'power2.in',
        },
        2.0
      );

      tl.to(
        logoWrapperRef.current,
        {
          x: 0,
          y: 0,
          rotation: 720,
          scale: 0.7,
          ease: 'power2.inOut',
        },
        2.0
      );

      tl.fromTo(
        contactSectionRef.current,
        {
          autoAlpha: 0,
          y: 40,
          pointerEvents: 'none',
        },
        {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto',
          ease: 'power2.out',
        },
        2.3
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleUserInterrupt = () => {
      isNavigatingRef.current = false;
    };
    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
    };
  }, []);

  const scrollToHome = () => {
    isNavigatingRef.current = true;
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0.7,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        isNavigatingRef.current = false;
        window.scrollTo(0, 0);
      },
    });
  };

  const scrollToWhat = () => {
    isNavigatingRef.current = true;
    const targetY = window.innerHeight;
    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.7,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        isNavigatingRef.current = false;
        window.scrollTo(0, targetY);
      },
    });
  };

  const scrollToPrices = () => {
    isNavigatingRef.current = true;
    const targetY = window.innerHeight * 2;
    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.75,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        isNavigatingRef.current = false;
        window.scrollTo(0, targetY);
      },
    });
  };

  const scrollToContact = () => {
    isNavigatingRef.current = true;
    const targetY = window.innerHeight * 3;
    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.8,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        isNavigatingRef.current = false;
        window.scrollTo(0, targetY);
      },
    });
  };

  return (
    <div ref={containerRef} className={styles.pageContainer}>
      <div ref={pinTrackRef} className={styles.pinnedViewport}>
        <RollingLogo ref={logoWrapperRef} />

        <BrandNav
          activeSection={activeSection}
          onNavigateHome={scrollToHome}
          onNavigateWhat={scrollToWhat}
          onNavigatePrices={scrollToPrices}
          onOpenContact={scrollToContact}
        />

        <HeroCanvas ref={heroCanvasRef} onNavigatePrices={scrollToPrices} />

        <WhatSection ref={whatSectionRef} />

        <PricesSection ref={pricesSectionRef} />

        <ContactSection ref={contactSectionRef} />

        <InfoModal
          isOpen={isContactOpen}
          type="CONTACT"
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </div>
  );
}
