'use client';

import React, { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    const headingElements = Array.from(articleBody.querySelectorAll('h2, h3'));

    const items = headingElements.map((el, index) => {
      const text = el.textContent || '';
      const id = el.id || text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `heading-${index}`;

      el.id = id;

      return { id, text, level: el.tagName.toLowerCase() };
    });

    setHeadings(items);

    // Collapse by default on mobile
    if (window.innerWidth < 992) {
      setIsCollapsed(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="toc-container">
      <button className="toc-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        <span className="toc-title">📑 Table of Contents</span>
        <span className={`toc-chevron ${isCollapsed ? '' : 'toc-chevron-open'}`}>▾</span>
      </button>
      <div className={`toc-body ${isCollapsed ? 'toc-collapsed' : ''}`}>
        <ul className="toc-list">
          {headings.map((item) => (
            <li
              key={item.id}
              className={`toc-item ${item.level === 'h3' ? 'toc-subitem' : ''} ${activeId === item.id ? 'toc-active' : ''}`}
            >
              <a href={`#${item.id}`} onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
