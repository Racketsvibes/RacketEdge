import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-info">
          <Link href="/" className="footer-logo-link">
            <img src="/logo.png" alt="RacketEdge Logo" className="footer-logo" />
          </Link>
          <p className="footer-bio">
            RacketEdge is your premier source for comprehensive, experience-based racket sports reviews, guides, and insights. Built by Chris Davies, club player and enthusiast.
          </p>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Chris</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Legal & Info</h4>
          <ul className="footer-links-list">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/affiliate-disclosure">Affiliate Disclosure</Link></li>
            <li><a href="/feed.xml" target="_blank" rel="noopener noreferrer">RSS Feed</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-disclaimer-box">
          <p className="amazon-disclaimer">
            Disclaimer: racketedge.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to amazon.com. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
          <p className="copyright-text">
            © {currentYear} RacketEdge. All rights reserved. Built with passion for Racket Sports.
          </p>
        </div>
      </div>
    </footer>
  );
}
