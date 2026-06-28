import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { getPageData } from '../../lib/posts';

export const metadata = {
  title: 'About Chris Davies & RacketEdge',
  description: 'Learn more about Chris Davies, editor of RacketEdge, his playing history, gear testing methodology, and mission.',
  alternates: {
    canonical: 'https://racketedge.com/about',
  }
};

export default function AboutPage() {
  const pageData = getPageData('about-us');

  return (
    <div className="container">
      <article style={{ padding: '48px 0' }}>
        <header className="page-header">
          <span className="category-badge">About Chris</span>
          <h1 className="page-title">{pageData ? pageData.title : 'About Us'}</h1>
        </header>
        <div className="page-content-wrapper">
          {pageData ? (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {pageData.contentHtml}
            </ReactMarkdown>
          ) : (
            <p>Biography content is currently being updated. Please check back soon!</p>
          )}
        </div>
      </article>
    </div>
  );
}
