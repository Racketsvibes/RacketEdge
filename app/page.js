import React from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function Home() {
  const allPosts = getSortedPostsData();
  
  // Choose the first post as the featured hero article
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 10); // Display the next 9 posts

  return (
    <div className="container">
      {/* Hero Featured Section */}
      {featuredPost && (
        <section className="hero-featured-section">
          <div className="featured-grid">
            <article className="featured-main-card">
              <Link href={`/posts/${featuredPost.slug}`}>
                <div className="featured-img-wrapper">
                  <img 
                    src={featuredPost.featuredImage || '/logo.png'} 
                    alt={featuredPost.title} 
                    className="featured-img"
                  />
                </div>
              </Link>
              <div className="featured-card-content">
                <span className="category-badge">{featuredPost.category}</span>
                <h2 className="featured-card-title">
                  <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p className="featured-card-excerpt">{featuredPost.description}</p>
                <div className="card-meta">
                  <span>By Chris Davies</span>
                  <span>•</span>
                  <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </article>

            {/* Sidebar Intro Card */}
            <aside className="author-intro-card">
              <div className="author-photo-wrapper">
                <img 
                  src="/logo.png" 
                  alt="Chris Davies" 
                  className="author-photo" 
                />
              </div>
              <h3 className="author-card-title">Chris Davies</h3>
              <p className="author-card-subtitle">Editor & Gear Tester</p>
              <p className="author-card-bio">
                "I have tested, playtested, and broken hundreds of tennis rackets over the last 15 years. Here at RacketEdge, my goal is to give you honest, first-person reviews and clear advice to help you find the perfect gear for your game."
              </p>
              <Link href="/about" className="read-more-btn">
                Read Chris's Bio
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* Latest Posts Grid */}
      <section className="latest-posts-section">
        <h3 className="section-title">Latest Reviews &amp; Guides</h3>
        <div className="grid-3-col">
          {recentPosts.map((post) => (
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
