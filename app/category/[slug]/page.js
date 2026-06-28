import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSortedPostsData } from '../../../lib/posts';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function generateStaticParams() {
  const allPosts = getSortedPostsData();
  const categories = new Set(allPosts.map(p => slugify(p.category || 'General')));
  return Array.from(categories).map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const allPosts = getSortedPostsData();
  const categoryName = allPosts.find(p => slugify(p.category || '') === params.slug)?.category || 'Category';
  
  return {
    title: `${categoryName} Reviews & Guides`,
    description: `Browse all articles, guides, and reviews under the ${categoryName} category.`,
    alternates: {
      canonical: `https://racketedge.com/category/${params.slug}`,
    }
  };
}

export default function Category({ params }) {
  const allPosts = getSortedPostsData();
  
  // Find posts belonging to the target slugified category
  const filteredPosts = allPosts.filter(
    (post) => slugify(post.category || 'General') === params.slug
  );

  if (filteredPosts.length === 0) {
    notFound();
  }

  const categoryName = filteredPosts[0].category || 'Category';

  return (
    <div className="container">
      <section className="latest-posts-section">
        <header className="page-header">
          <span className="category-badge">Category</span>
          <h1 className="page-title">{categoryName}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Found {filteredPosts.length} articles in this category.
          </p>
        </header>

        <div className="grid-3-col">
          {filteredPosts.map((post) => (
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
    </div>
  );
}
