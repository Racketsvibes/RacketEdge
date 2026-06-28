import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { getPageData } from '../../lib/posts';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Read the RacketEdge privacy policy. Learn how we handle cookies, tracking, and personal data.',
  alternates: {
    canonical: 'https://racketedge.com/privacy-policy',
  }
};

export default function PrivacyPolicyPage() {
  const pageData = getPageData('privacy-policy');

  return (
    <div className="container">
      <article style={{ padding: '48px 0' }}>
        <header className="page-header">
          <span className="category-badge">Legal</span>
          <h1 className="page-title">{pageData ? pageData.title : 'Privacy Policy'}</h1>
        </header>
        <div className="page-content-wrapper">
          {pageData ? (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {pageData.contentHtml}
            </ReactMarkdown>
          ) : (
            <p>Privacy policy is currently being updated. Please check back soon!</p>
          )}
        </div>
      </article>
    </div>
  );
}
