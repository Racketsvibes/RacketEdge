import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { getPostData, getAllPostSlugs, getSortedPostsData } from '../../../lib/posts';
import Link from 'next/link';
import AffiliateDisclosure from '../../../components/AffiliateDisclosure';
import TableOfContents from '../../../components/TableOfContents';
import FAQ from '../../../components/FAQ';
import ReadingProgressBar from '../../../components/ReadingProgressBar';
import MobileAffiliateCTA from '../../../components/MobileAffiliateCTA';

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export async function generateMetadata({ params }) {
  const postData = getPostData(params.slug);
  if (!postData) return {};

  return {
    title: postData.seoTitle || postData.title,
    description: postData.description,
    alternates: {
      canonical: `https://racketedge.com/posts/${postData.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://racketedge.com/posts/${postData.slug}`,
      title: postData.seoTitle || postData.title,
      description: postData.description,
      images: [
        {
          url: postData.featuredImage || '/logo.png',
          alt: postData.title,
        }
      ],
      publishedTime: postData.date,
      modifiedTime: postData.dateModified,
      authors: ['Chris Davies'],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.seoTitle || postData.title,
      description: postData.description,
      images: [postData.featuredImage || '/logo.png'],
    }
  };
}

function extractFaqs(markdown) {
  const faqStartIndex = markdown.search(/##\s+(?:FAQ|Frequently Asked Questions)/i);
  if (faqStartIndex === -1) return [];
  const faqText = markdown.substring(faqStartIndex);

  const faqs = [];
  const matches = faqText.matchAll(/###\s+([^\n]+)\n+([\s\S]*?)(?=\n+###|\n+##|\n*---|$)/g);
  for (const match of matches) {
    const question = match[1].trim().replace(/\*\*/g, '');
    const answer = match[2]
      .trim()
      .replace(/[\*\-]/g, '')
      .replace(/\n+/g, ' ');
    faqs.push({ question, answer });
  }
  return faqs;
}

function getReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export default function Post({ params }) {
  const postData = getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  const allPosts = getSortedPostsData();
  let relatedPosts = allPosts.filter(p => p.slug !== params.slug && p.category === postData.category);
  if (relatedPosts.length < 3) {
    const otherPosts = allPosts.filter(p => p.slug !== params.slug && !relatedPosts.some(rp => rp.slug === p.slug));
    relatedPosts = [...relatedPosts, ...otherPosts];
  }
  relatedPosts = relatedPosts.slice(0, 3);

  const readingTime = getReadingTime(postData.contentHtml);
  const isCommercialPost = postData.slug.includes('best-') || postData.slug.includes('review') || postData.slug.includes('vs-');

  const paragraphs = postData.contentHtml.split('\n\n');
  const answerCapsule = paragraphs[0];
  let restOfBody = paragraphs.slice(1).join('\n\n');

  const faqs = extractFaqs(postData.contentHtml);

  const faqStartIndex = restOfBody.search(/##\s+(?:FAQ|Frequently Asked Questions)/i);
  if (faqStartIndex !== -1) {
    restOfBody = restOfBody.substring(0, faqStartIndex);
  }

  const contiguousRatingsRegex = /(?:###\s+[^\n]+\s+\*\*[\d\.]+\/10\*\*\s*)+/g;
  restOfBody = restOfBody.replace(contiguousRatingsRegex, (match) => {
    const individualRegex = /###\s+([^\n]+)\s+\*\*([\d\.]+\/10)\*\*/g;
    let cardsHtml = '<div class="rating-cards-grid">\n';
    let cardMatch;
    while ((cardMatch = individualRegex.exec(match)) !== null) {
      cardsHtml += `  <div class="rating-card"><div class="rating-label">${cardMatch[1].trim()}</div><div class="rating-score">${cardMatch[2].trim()}</div></div>\n`;
    }
    cardsHtml += '</div>\n\n';
    return cardsHtml;
  });

  const isReview = postData.slug.includes('review') || postData.slug.includes('vs-') || postData.slug.includes('best-');
  const schemaGraph = [
    {
      '@type': 'BreadcrumbList',
      '@id': `https://racketedge.com/posts/${postData.slug}/#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://racketedge.com' },
        { '@type': 'ListItem', position: 2, name: postData.category, item: `https://racketedge.com/category/${postData.slug}` },
        { '@type': 'ListItem', position: 3, name: postData.title, item: `https://racketedge.com/posts/${postData.slug}` }
      ]
    },
    {
      '@type': 'BlogPosting',
      '@id': `https://racketedge.com/posts/${postData.slug}/#article`,
      isPartOf: { '@id': 'https://racketedge.com/#website' },
      headline: postData.title,
      datePublished: postData.date,
      dateModified: postData.dateModified,
      author: { '@id': 'https://racketedge.com/#author' },
      publisher: { '@id': 'https://racketedge.com/#organization' },
      description: postData.description,
      image: postData.featuredImage || 'https://racketedge.com/logo.png',
      mainEntityOfPage: `https://racketedge.com/posts/${postData.slug}`
    }
  ];

  if (isReview) {
    const titleParts = postData.title.split('Review');
    const productName = titleParts[0].trim();
    const brandName = productName.split(' ')[0] || 'Tennis Brand';

    schemaGraph.push({
      '@type': 'Product',
      '@id': `https://racketedge.com/posts/${postData.slug}/#product`,
      name: productName,
      brand: { '@type': 'Brand', name: brandName },
      image: postData.featuredImage || 'https://racketedge.com/logo.png',
      description: postData.description,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8', reviewCount: '1', bestRating: '5', worstRating: '1'
      },
      review: {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Chris Davies' },
        reviewRating: { '@type': 'Rating', ratingValue: '4.8', bestRating: '5' },
        reviewBody: postData.description
      }
    });
  }

  const combinedSchema = { '@context': 'https://schema.org', '@graph': schemaGraph };

  // Extract first Amazon link for mobile CTA
  const amazonLinkMatch = postData.contentHtml.match(/href="(https:\/\/amzn\.to\/[^"]+)"/);
  const firstAmazonLink = amazonLinkMatch ? amazonLinkMatch[1] : null;

  return (
    <article className="post-page-layout">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="post-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-separator">›</span>
          <a href={`/category/${postData.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}>{postData.category.replace(/&amp;/g, '&')}</a>
          <span className="breadcrumb-separator">›</span>
          <span>{postData.title.length > 50 ? postData.title.replace(/&amp;/g, '&').substring(0, 50) + '…' : postData.title.replace(/&amp;/g, '&')}</span>
        </nav>

        {/* Post Header */}
        <header className="post-header">
          <div className="post-header-badges">
            <span className="category-badge">{postData.category.replace(/&amp;/g, '&')}</span>
            {isCommercialPost && <span className="commercial-badge">Buying Guide</span>}
          </div>
          <h1 className="post-title-main">{postData.title.replace(/&amp;/g, '&')}</h1>
          <div className="post-meta-container">
            <span className="meta-author">By Chris Davies</span>
            <span className="meta-dot">•</span>
            <span>Published: {new Date(postData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="meta-dot">•</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {/* Hero Image */}
        {postData.featuredImage && (
          <div className="post-hero-image-wrapper">
            <img
              src={postData.featuredImage}
              alt={postData.title}
              className="post-hero-image"
              loading="lazy"
            />
          </div>
        )}

        {/* Grid Layout */}
        <div className="post-content-grid">
          <div className="article-body">
            <AffiliateDisclosure />

            {/* Answer Capsule */}
            {answerCapsule && (
              <div className="answer-capsule">
                <div className="answer-capsule-title">Quick Answer & Verdict</div>
                <div className="answer-capsule-text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {answerCapsule.replace(/---/g, '').trim()}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {restOfBody}
            </ReactMarkdown>

            {faqs.length > 0 && <FAQ faqs={faqs} />}
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            <TableOfContents />
            {/* Sidebar Promo */}
            {isCommercialPost && (
              <div className="sidebar-promo-box">
                <span className="sidebar-promo-tag">Editor's Choice</span>
                <h4 className="sidebar-promo-title">Top Rated Rackets</h4>
                <p className="sidebar-promo-text">See our playtested picks for every skill level.</p>
                <a href="/posts/best-tennis-rackets" className="sidebar-promo-btn">View Best Picks →</a>
              </div>
            )}
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="related-posts-section">
            <h3 className="section-heading-border">📖 Related Articles</h3>
            <div className="grid-3-col">
              {relatedPosts.map((post) => (
                <article key={post.slug} className="post-card">
                  <Link href={`/posts/${post.slug}`} className="post-card-img-wrapper">
                    <img
                      src={post.featuredImage || '/logo.png'}
                      alt={post.title}
                      className="post-card-img"
                    />
                  </Link>
                  <div className="post-card-body">
                    <span className="category-badge">{post.category}</span>
                    <h4 className="post-card-title">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="post-card-excerpt">{post.description}</p>
                    <div className="card-meta">
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Affiliate CTA for commercial posts */}
      {isCommercialPost && firstAmazonLink && (
        <MobileAffiliateCTA
          affiliateUrl={firstAmazonLink}
          productName={postData.title.split(':')[0] || postData.title}
        />
      )}
    </article>
  );
}
