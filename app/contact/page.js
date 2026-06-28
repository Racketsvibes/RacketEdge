import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { getPageData } from '../../lib/posts';

export const metadata = {
  title: 'Contact RacketEdge & Chris Davies',
  description: 'Get in touch with Chris Davies at RacketEdge. Share your racket playtesting questions, feedback, or business inquiries.',
  alternates: {
    canonical: 'https://racketedge.com/contact',
  }
};

export default function ContactPage() {
  const pageData = getPageData('contact-us');

  return (
    <div className="container">
      <article style={{ padding: '48px 0' }}>
        <header className="page-header">
          <span className="category-badge">Get in Touch</span>
          <h1 className="page-title">{pageData ? pageData.title : 'Contact Us'}</h1>
        </header>
        <div className="page-content-wrapper">
          {pageData ? (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {pageData.contentHtml}
            </ReactMarkdown>
          ) : (
            <p>Contact details are currently being updated. Please check back soon!</p>
          )}
        </div>
      </article>
    </div>
  );
}
