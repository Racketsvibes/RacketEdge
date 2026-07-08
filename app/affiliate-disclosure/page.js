import React from 'react';

export const metadata = {
  title: 'Affiliate Disclosure',
  description: 'Learn about our affiliate relationships and how we fund our hands-on racket sports gear reviews.',
  alternates: {
    canonical: 'https://racketedge.com/affiliate-disclosure',
  }
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="container">
      <article className="disclosure-page">
        <header className="page-header">
          <span className="category-badge">Transparency</span>
          <h1 className="page-title">Affiliate &amp; Advertising Disclosure</h1>
        </header>
        <div className="page-content-wrapper">
          <p>
            In compliance with the Federal Trade Commission (FTC) guidelines, this page describes our affiliate partnerships and how we keep this website running.
          </p>
          <h2>Who We Are &amp; Our Mission</h2>
          <p>
            RacketEdge.com is owned and edited by Chris Davies. We provide detailed, hands-on gear playtesting, specifications analyses, and playing guides for racket sports like tennis, squash, and badminton. Our mission is to offer honest, buyer-first reviews that help you select the best equipment for your individual playing style.
          </p>
          <h2>Amazon Associates Program Participation</h2>
          <p>
            RacketEdge.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for website owners to earn advertising fees by advertising and linking to Amazon.com and affiliated websites.
          </p>
          <p>
            This means that throughout RacketEdge.com, we include links to products on Amazon. If you click on one of these links and purchase a product, we may receive a small referral commission. <strong>This commission is paid by Amazon at absolutely no additional cost to you.</strong> The price you pay is exactly the same whether you use our link or go directly to Amazon yourself.
          </p>
          <h2>How Affiliate Links Impact Our Content</h2>
          <p>
            Our product assessments are based entirely on Chris Davies' firsthand playing experience, spec comparisons, and collective community feedback. We never accept payment or free gear in exchange for a positive review.
          </p>
          <p>
            If a racket has poor vibration dampening, low structural stability, or is not worth the price, we will state that clearly in the cons section of the review. Our primary loyalty is to you, the reader. Providing untrustworthy reviews would destroy our reputation and search authority, which violates our core values.
          </p>
          <h2>Disclaimer Regarding Prices</h2>
          <p>
            Amazon product prices change frequently. We do not hard-code specific prices on our pages. Any pricing information or references (like "under $100") are accurate at the time of writing, but you must check Amazon directly for current pricing.
          </p>
          <p>
            If you have any questions regarding our affiliate relationships, testing process, or editorial standards, please do not hesitate to contact us.
          </p>
        </div>
      </article>
    </div>
  );
}
