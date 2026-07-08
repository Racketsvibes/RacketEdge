'use client';

import React, { useState } from 'react';

export default function FAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const expandAll = () => setOpenIndex('all');
  const collapseAll = () => setOpenIndex(null);

  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2 className="faq-main-heading">❓ Frequently Asked Questions</h2>
        <div className="faq-controls">
          <button className="faq-control-btn" onClick={expandAll}>Expand All</button>
          <button className="faq-control-btn" onClick={collapseAll}>Collapse All</button>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="faq-accordion">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index || openIndex === 'all';
          return (
            <div key={index} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
              <button
                className="faq-question-btn"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon-arrow"></span>
              </button>
              <div className="faq-answer-container" style={{ maxHeight: isOpen ? '500px' : '0px' }}>
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
