'use client';

import React, { useState, useEffect } from 'react';

export default function MobileAffiliateCTA({ affiliateUrl, productName }) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300 && !dismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (dismissed || !affiliateUrl) return null;

  return (
    <div className={`mobile-affiliate-cta ${isVisible ? 'mobile-cta-visible' : ''}`}>
      <div className="mobile-cta-content">
        <div className="mobile-cta-info">
          <span className="mobile-cta-badge">Best Price</span>
          <span className="mobile-cta-product">{productName || 'View Top Pick'}</span>
        </div>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="nofollow sponsored"
          className="mobile-cta-button"
        >
          🛒 Check on Amazon
        </a>
      </div>
      <button
        className="mobile-cta-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
