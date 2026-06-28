'use client';

import React, { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Locate the article body container
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    // Find all H2 and H3 elements inside the article
    const headingElements = Array.from(articleBody.querySelectorAll('h2, h3'));
    
    // Process and assign IDs
    const items = headingElements.map((el, index) => {
      const text = el.textContent || '';
      // Create a URL-friendly ID if not already present
      const id = el.id || text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `heading-${index}`;
      
      el.id = id; // Ensure the element has this ID on the DOM

      return {
        id,
        text,
        level: el.tagName.toLowerCase(), // 'h2' or 'h3'
      };
    });

    setHeadings(items);

    // Setup intersection observer to highlight the heading currently in viewport
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
      <div className="toc-title">Table of Contents</div>
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
    </nav>
  );
}
