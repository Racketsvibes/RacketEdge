import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { getPostData, getAllPostSlugs } from '../../../lib/posts';
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
  const faqStartIndex = markdown.search(/##\s+FAQ/i);
  if (faqStartIndex === -1) return [];
  const faqText = markdown.substring(faqStartIndex);
  
  const faqs = [];
  // Matches ### Question followed by content up to next heading or end
  const matches = faqText.matchAll(/###\s+([^\n]+)\n+([\s\S]*?)(?=\n+###|\n+##|\n*---|$)/g);
  for (const match of matches) {
    const question = match[1].trim();
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

  const paragraphs = postData.contentHtml.split('\n\n');
  const answerCapsule = paragraphs[0]; // First paragraph as highlighted Answer Capsule
  const restOfBody = paragraphs.slice(1).join('\n\n');

  // Extract FAQs for the Accordion rendering & JSON-LD schema
  const faqs = extractFaqs(postData.contentHtml);

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
        {/* Post Header */}
        <header className="post-header">
          <span className="category-badge">{postData.category}</span>
          <h1 className="post-title-main">{postData.title}</h1>
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
                <p className="answer-capsule-text">{answerCapsule.replace(/---/g, '').trim()}</p>
              </div>
            )}

            {/* Rest of Body Content */}
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
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
      </div>
    </article>
  );
}
