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

// Helper to extract FAQs dynamically from Markdown text
function extractFaqs(markdown) {
  const faqStartIndex = markdown.search(/##\s+(?:FAQ|Frequently Asked Questions)/i);
  if (faqStartIndex === -1) return [];
  const faqText = markdown.substring(faqStartIndex);
  
  const faqs = [];
  // Matches ### Question followed by content up to next heading or end
  const matches = faqText.matchAll(/###\s+([^\n]+)\n+([\s\S]*?)(?=\n+###|\n+##|\n*---|$)/g);
  for (const match of matches) {
    const question = match[1].trim().replace(/\*\*/g, '');
    const answer = match[2]
      .trim()
      .replace(/[\*\-]/g, '') // remove bullet markers
      .replace(/\n+/g, ' ');
    faqs.push({ question, answer });
  }
  return faqs;
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

  const paragraphs = postData.contentHtml.split('\n\n');
  const answerCapsule = paragraphs[0]; // First paragraph as highlighted Answer Capsule
  let restOfBody = paragraphs.slice(1).join('\n\n');

  // Extract FAQs for the Accordion rendering & JSON-LD schema
  const faqs = extractFaqs(postData.contentHtml);

  // Remove the raw FAQ section from restOfBody so it doesn't render twice
  const faqStartIndex = restOfBody.search(/##\s+(?:FAQ|Frequently Asked Questions)/i);
  if (faqStartIndex !== -1) {
    restOfBody = restOfBody.substring(0, faqStartIndex);
  }

  // Group contiguous rating cards into a professional CSS Grid
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

  // Dynamic Rich Schemas (Article + Product)
  const isReview = postData.slug.includes('review') || postData.slug.includes('vs-') || postData.slug.includes('best-');
  const schemaGraph = [
    {
      '@type': 'BreadcrumbList',
      '@id': `https://racketedge.com/posts/${postData.slug}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://racketedge.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: postData.category,
          item: `https://racketedge.com/category/${postData.slug}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: postData.title,
          item: `https://racketedge.com/posts/${postData.slug}`
        }
      ]
    },
    {
      '@type': 'BlogPosting',
      '@id': `https://racketedge.com/posts/${postData.slug}/#article`,
      isPartOf: {
        '@id': 'https://racketedge.com/#website'
      },
      headline: postData.title,
      datePublished: postData.date,
      dateModified: postData.dateModified,
      author: {
        '@id': 'https://racketedge.com/#author'
      },
      publisher: {
        '@id': 'https://racketedge.com/#organization'
      },
      description: postData.description,
      image: postData.featuredImage || 'https://racketedge.com/logo.png',
      mainEntityOfPage: `https://racketedge.com/posts/${postData.slug}`
    }
  ];

  if (isReview) {
    // Attempt to parse brand/product name
    const titleParts = postData.title.split('Review');
    const productName = titleParts[0].trim();
    const brandName = productName.split(' ')[0] || 'Tennis Brand';

    schemaGraph.push({
      '@type': 'Product',
      '@id': `https://racketedge.com/posts/${postData.slug}/#product`,
      name: productName,
      brand: {
        '@type': 'Brand',
        name: brandName
      },
      image: postData.featuredImage || 'https://racketedge.com/logo.png',
      description: postData.description,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '1',
        bestRating: '5',
        worstRating: '1'
      },
      review: {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Chris Davies'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '4.8',
          bestRating: '5'
        },
        reviewBody: postData.description
      }
    });
  }

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': schemaGraph
  };

  return (
    <article className="post-page-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="post-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-separator">›</span>
          <a href={`/category/${postData.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}>{postData.category.replace(/&amp;/g, '&')}</a>
          <span className="breadcrumb-separator">›</span>
          <span>{postData.title.length > 50 ? postData.title.replace(/&amp;/g, '&').substring(0, 50) + '…' : postData.title.replace(/&amp;/g, '&')}</span>
        </nav>

        {/* Post Header */}
        <header className="post-header">
          <span className="category-badge">{postData.category.replace(/&amp;/g, '&')}</span>
          <h1 className="post-title-main">{postData.title.replace(/&amp;/g, '&')}</h1>
          <div className="post-meta-container">
            <span>By Chris Davies</span>
            <span>•</span>
            <span>Published: {new Date(postData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>Updated: {new Date(postData.dateModified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
          {/* Main Article Body */}
          <div className="article-body">
            {/* FTC Disclosure */}
            <AffiliateDisclosure />

            {/* Answer Capsule (Quick Summary Box) */}
            {answerCapsule && (
              <div className="answer-capsule">
                <div className="answer-capsule-title">Quick Answer &amp; Verdict</div>
                <div className="answer-capsule-text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {answerCapsule.replace(/---/g, '').trim()}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Rest of Body Content */}
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {restOfBody}
            </ReactMarkdown>

            {/* Interactive FAQs Accordion */}
            {faqs.length > 0 && <FAQ faqs={faqs} />}
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            <TableOfContents />
          </aside>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="related-posts-section" style={{ marginTop: '64px', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '24px', color: 'var(--text-primary)' }}>Related Articles</h3>
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
    </article>
  );
}
