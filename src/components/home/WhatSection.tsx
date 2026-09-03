'use client';

import { forwardRef } from 'react';
import styles from './WhatSection.module.scss';

export const WhatSection = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section ref={ref} className={styles.whatContainer}>
      <div className={styles.sketchMosaic}>
        {/* Top Row: [Wide Swatch Deck (65%)] + [Squarish Type Glyph (35%)] */}
        <div className={styles.topRow}>
          <div className={styles.swatchDeck}>
            <div className={styles.chipGreen}>
              <span className={styles.chipHex}>#439B38</span>
            </div>
            <div className={styles.chipOrange}>
              <span className={styles.chipHex}>#F16B24</span>
            </div>
            <div className={styles.chipWhite}>
              <span className={styles.chipHex}>#F2F4F8</span>
            </div>
          </div>

          <div className={styles.typeTile}>
            <span className={styles.typeLarge}>Aa</span>
            <span className={styles.typeSub}>Fraunces Serif 48</span>
          </div>
        </div>

        {/* Middle Row: [Compact Icon Stamp (30%)] + [Long UI Token Bar (70%)] */}
        <div className={styles.middleRow}>
          <div className={styles.stampTile}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f16b24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          <div className={styles.tokenBar}>
            <div className={styles.buttonToken}>Button Primary</div>
            <div className={styles.scaleSteps}>
              <span>12</span>
              <span>16</span>
              <span className={styles.activeStep}>24</span>
              <span>48</span>
            </div>
            <div className={styles.toggleKnobWrapper}>
              <div className={styles.knob} />
            </div>
          </div>
        </div>

        {/* Bottom Row: [Large Wireframe Canvas (60%)] + [Tall Polaroid Aspect Slide (40%)] */}
        <div className={styles.bottomRow}>
          <div className={styles.wireframeCanvas}>
            <div className={styles.wireNav}>
              <span className={styles.wireLogo} />
              <div className={styles.wireLinks}>
                <span />
                <span />
              </div>
            </div>
            <div className={styles.wireHero}>
              <div className={styles.wireHeadline} />
              <div className={styles.wireTextLine} />
              <div className={styles.wireCta} />
            </div>
          </div>

          <div className={styles.polaroidSlide}>
            <div className={styles.slideInner}>
              <div className={styles.aspectCross1} />
              <div className={styles.aspectCross2} />
              <span className={styles.slideTag}>16:9 Canvas</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentColumn}>
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>
            Choose your fonts, colors, icons, images, and style before you build it.
          </h2>
          <p className={styles.description}>
            SOMO lets you design and test your entire visual foundation—from typography scales and color harmonies to iconography and component layouts—before writing a single line of code.
          </p>
        </div>
      </div>
    </section>
  );
});

WhatSection.displayName = 'WhatSection';
