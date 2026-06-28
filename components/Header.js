'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo-link" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="RacketEdge Logo" className="site-logo" />
        </Link>

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
            <li className="nav-item">
              <Link href="/" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li className="nav-item dropdown">
              <span className="dropdown-label">Gear Reviews</span>
              <ul className="dropdown-menu">
                <li><Link href="/posts/best-wilson-tennis-rackets" onClick={closeMobileMenu}>Wilson Rackets</Link></li>
                <li><Link href="/posts/best-babolat-tennis-racket" onClick={closeMobileMenu}>Babolat Rackets</Link></li>
                <li><Link href="/posts/best-head-tennis-racquets" onClick={closeMobileMenu}>Head Rackets</Link></li>
                <li><Link href="/posts/best-tennis-bags" onClick={closeMobileMenu}>Tennis Bags</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/posts/types-of-tennis-shots" onClick={closeMobileMenu}>Playing Guides</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" onClick={closeMobileMenu}>About Chris</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
