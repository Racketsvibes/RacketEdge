'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link href="/" className="header-logo-link" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="RacketEdge" className="header-logo-img" />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`site-navigation ${mobileMenuOpen ? 'nav-open' : ''}`}>
          {/* Mobile overlay backdrop */}
          {mobileMenuOpen && <div className="nav-overlay" onClick={closeMobileMenu} />}
          <div className="nav-inner">
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/category/tennis-rackets" onClick={closeMobileMenu}>Tennis Rackets</Link>
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
            {/* Mobile-only deals button */}
            <div className="nav-mobile-cta">
              <a href="/posts/best-tennis-rackets" className="header-deals-btn" onClick={closeMobileMenu}>
                🏆 Best Racket Picks
              </a>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <ThemeToggle />
          <a href="/posts/best-tennis-rackets" className="header-deals-btn header-deals-desktop">
            🏆 Best Picks
          </a>
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'toggle-active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
