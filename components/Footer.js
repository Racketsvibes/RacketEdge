import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* Column 1: Brand */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-logo-link">
              <img src="/logo.png" alt="RacketEdge" className="footer-logo" />
            </Link>
            <p className="footer-bio">
              Your premier source for honest, experience-based racket sports reviews, guides, and gear insights. Built by Chris Davies.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="/feed.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed" className="footer-social-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.503 20.752c0 1.241-1.008 2.248-2.25 2.248s-2.25-1.007-2.25-2.248c0-1.24 1.008-2.248 2.25-2.248s2.25 1.008 2.25 2.248zm-6.503-7.372v4.303c6.385.083 11.517 5.214 11.6 11.6h4.321c-.085-8.775-7.147-15.821-15.921-15.903zm0-8.258v4.3c10.941.085 19.8 8.945 19.885 19.886h4.318c-.088-13.315-10.883-24.1-24.203-24.186z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/posts/best-tennis-rackets">Best Rackets 2026</Link></li>
              <li><Link href="/about">About Chris</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links-list">
              <li><Link href="/category/tennis-rackets">Tennis Rackets</Link></li>
              <li><Link href="/category/tennis-guides">Playing Guides</Link></li>
              <li><Link href="/category/badminton">Badminton</Link></li>
              <li><Link href="/category/tennis-gear-equipment">Gear & Equipment</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Legal & Info</h4>
            <ul className="footer-links-list">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/affiliate-disclosure">Affiliate Disclosure</Link></li>
              <li><a href="/feed.xml" target="_blank" rel="noopener noreferrer">RSS Feed</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
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
