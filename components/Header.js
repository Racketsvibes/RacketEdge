'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* Top Header Row: Large Centered Logo */}
      <div className="header-top-row" style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <Link href="/" className="logo-link" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="RacketEdge Logo" className="site-logo" />
        </Link>
      </div>

      {/* Bottom Header Row: Navigation Links & Social Media */}
      <div className="header-bottom-row">
        <div className="header-bottom-container">
          {/* Mobile menu trigger */}
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'toggle-active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation links */}
          <nav className={`site-navigation ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item" style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
                <span className="header-date" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{currentDate}</span>
              </li>
              <li className="nav-item">
                <Link href="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              
              <li className="nav-item dropdown">
                <span className="dropdown-label">Racket Reviews</span>
                <ul className="dropdown-menu">
                  <li><Link href="/posts/best-wilson-tennis-rackets" onClick={closeMobileMenu}>Wilson Rackets</Link></li>
                  <li><Link href="/posts/best-babolat-tennis-racket" onClick={closeMobileMenu}>Babolat Rackets</Link></li>
                  <li><Link href="/posts/best-head-tennis-racquets" onClick={closeMobileMenu}>Head Rackets</Link></li>
                  <li><Link href="/posts/best-tennis-rackets" onClick={closeMobileMenu}>All Tennis Rackets</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <span className="dropdown-label">Gear Guides</span>
                <ul className="dropdown-menu">
                  <li><Link href="/posts/best-tennis-strings-experts-choice" onClick={closeMobileMenu}>Tennis Strings</Link></li>
                  <li><Link href="/posts/best-tennis-bags" onClick={closeMobileMenu}>Tennis Bags</Link></li>
                  <li><Link href="/posts/best-tennis-shoes-for-women" onClick={closeMobileMenu}>Tennis Shoes</Link></li>
                  <li><Link href="/posts/best-tennis-ball-machines" onClick={closeMobileMenu}>Ball Machines</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link href="/category/tennis-guides" onClick={closeMobileMenu}>Playing Guides</Link>
              </li>
              <li className="nav-item">
                <Link href="/about" onClick={closeMobileMenu}>About Chris</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Social Icons & Date */}
          <div className="header-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" className="social-svg-icon"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="social-svg-icon"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed">
              <svg viewBox="0 0 24 24" className="social-svg-icon"><path d="M6.503 20.752c0 1.241-1.008 2.248-2.25 2.248s-2.25-1.007-2.25-2.248c0-1.24 1.008-2.248 2.25-2.248s2.25 1.008 2.25 2.248zm-6.503-7.372v4.303c6.385.083 11.517 5.214 11.6 11.6h4.321c-.085-8.775-7.147-15.821-15.921-15.903zm0-8.258v4.3c10.941.085 19.8 8.945 19.885 19.886h4.318c-.088-13.315-10.883-24.1-24.203-24.186z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
