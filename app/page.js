import React from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function Home() {
  const allPosts = getSortedPostsData();

  // 1. Hero Section Articles
  const heroFeatured = allPosts[0] || null;
  const heroSidebar = allPosts.slice(1, 5);

  // 2. Trending Section
  const trendingArticles = allPosts.slice(5, 9);

  // 3. Badminton Section
  let badmintonArticles = allPosts.filter(p => 
    p.category?.toLowerCase().includes('badminton') || 
    p.title?.toLowerCase().includes('badminton')
  );
  if (badmintonArticles.length === 0) badmintonArticles = allPosts.slice(9, 12);

  // 4. Tennis Gears Section
  let tennisGearArticles = allPosts.filter(p => 
    p.category?.toLowerCase().includes('gear') || 
    p.title?.toLowerCase().includes('bag') || 
    p.title?.toLowerCase().includes('shoe') || 
    p.title?.toLowerCase().includes('string') || 
    p.title?.toLowerCase().includes('machine')
  );
  if (tennisGearArticles.length === 0) tennisGearArticles = allPosts.slice(12, 16);

  return (
    <div className="container">
      {/* 1. HERO MAGAZINE SECTION */}
      <section className="hero-magazine-section">
        <div className="hero-magazine-grid">
          {/* Main Hero Card (Left) */}
          {heroFeatured && (
            <article className="hero-main-card">
              <Link href={`/posts/${heroFeatured.slug}`} className="hero-main-img-link">
                <div className="hero-main-img-wrapper">
                  <img 
                    src={heroFeatured.featuredImage || '/logo.png'} 
                    alt={heroFeatured.title} 
                    className="hero-main-img"
                  />
                </div>
              </Link>
              <div className="hero-main-content">
                <span className="category-badge">{heroFeatured.category}</span>
                <h2 className="hero-main-title">
                  <Link href={`/posts/${heroFeatured.slug}`}>{heroFeatured.title}</Link>
                </h2>
                <div className="card-meta">
                  <span>By Chris Davies</span>
                  <span>•</span>
                  <span>{new Date(heroFeatured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </article>
          )}

          {/* Hero Sidebar List (Right) */}
          <aside className="hero-sidebar-list">
            {heroSidebar.map((post) => (
              <div key={post.slug} className="hero-sidebar-item">
                <Link href={`/posts/${post.slug}`} className="sidebar-item-thumb-link">
                  <img 
                    src={post.featuredImage || '/logo.png'} 
                    alt={post.title} 
                    className="sidebar-item-thumb"
                  />
                </Link>
                <div className="sidebar-item-info">
                  <h4 className="sidebar-item-title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <span className="sidebar-item-date">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* 2. QUICK SUBSCRIPTION / TARGET BAR */}
      <section className="quick-action-bar">
        <div className="action-bar-container">
          <div className="action-bar-badge">Newsletter</div>
          <p className="action-bar-text">Subscribe for exclusive gear playtests, discounts &amp; court tips!</p>
          <form className="action-bar-form">
            <input type="text" placeholder="Your Name" required className="action-input" />
            <input type="email" placeholder="Your Email" required className="action-input" />
            <button type="submit" className="action-submit-btn">Subscribe</button>
          </form>
        </div>
      </section>

      {/* 3. TRENDING SECTION */}
      <section className="homepage-section">
        <h3 className="section-heading-border">Trending Now</h3>
        <div className="trending-grid">
          {trendingArticles.map((post) => (
            <article key={post.slug} className="trending-card">
              <Link href={`/posts/${post.slug}`} className="trending-img-link">
                <img 
                  src={post.featuredImage || '/logo.png'} 
                  alt={post.title} 
                  className="trending-img"
                />
              </Link>
              <div className="trending-info">
                <span className="category-badge-small">{post.category}</span>
                <h4 className="trending-title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h4>
                <p className="trending-excerpt">{post.description}</p>
                <span className="trending-date">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. BADMINTON SECTION */}
      <section className="homepage-section">
        <h3 className="section-heading-border">Badminton</h3>
        <div className="badminton-grid">
          <div className="badminton-posts-col">
            {badmintonArticles.slice(0, 2).map((post) => (
              <article key={post.slug} className="badminton-main-card">
                <Link href={`/posts/${post.slug}`}>
                  <div className="badminton-img-wrapper">
                    <img src={post.featuredImage || '/logo.png'} alt={post.title} className="badminton-img" />
                  </div>
                </Link>
                <div className="badminton-content">
                  <h4 className="badminton-title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <p className="badminton-excerpt">{post.description}</p>
                  <span className="badminton-date">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="badminton-subposts-col">
            {badmintonArticles.slice(2, 4).map((post) => (
              <div key={post.slug} className="badminton-list-item">
                <Link href={`/posts/${post.slug}`} className="badminton-list-thumb">
                  <img src={post.featuredImage || '/logo.png'} alt={post.title} />
                </Link>
                <div className="badminton-list-info">
                  <h5><Link href={`/posts/${post.slug}`}>{post.title}</Link></h5>
                  <span className="badminton-date">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Banner Box */}
          <div className="homepage-promo-box">
            <div className="promo-inner">
              <span className="promo-tag">Recommended Sponsor</span>
              <h4>Get 30 Days Free Trial on Audible</h4>
              <p>Listen to hundreds of sports memoirs and coaching audiobooks on the court.</p>
              <a 
                href="https://amzn.to/3O86Xkw" 
                target="_blank" 
                rel="nofollow sponsored" 
                className="promo-cta-btn"
              >
                Claim Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TENNIS GEARS SECTION */}
      <section className="homepage-section">
        <h3 className="section-heading-border">Tennis Gears &amp; Equipment</h3>
        <div className="tennis-gears-grid">
          {tennisGearArticles.slice(0, 3).map((post) => (
            <article key={post.slug} className="gear-card">
              <Link href={`/posts/${post.slug}`} className="gear-img-link">
                <div className="gear-img-wrapper">
                  <img 
                    src={post.featuredImage || '/logo.png'} 
                    alt={post.title} 
                    className="gear-img"
                  />
                </div>
              </Link>
              <div className="gear-content">
                <span className="category-badge-small">{post.category}</span>
                <h4 className="gear-title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h4>
                <p className="gear-excerpt">{post.description}</p>
                <span className="gear-date">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. MISSION STATEMENT */}
      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-text-box">
            <h3 className="mission-title">Our Testing Mission</h3>
            <p className="mission-p">
              At RacketEdge, we believe that finding the right racket, string setup, or accessory is essential for injury prevention and maximizing your performance on the court. 
            </p>
            <p className="mission-p">
              Chris Davies tests every frame for stiffness, weight distribution, and real-world playability, ensuring that you receive unbiased reviews that you can trust. We never accept sponsor payouts for rating reviews.
            </p>
            <Link href="/about" className="mission-link-btn">About Our Testing Standards</Link>
          </div>
          <div className="mission-img-box">
            <img 
              src="/wp-content/uploads/2025/085dcd3cdb/RacketEdge-Hero-Section.webp" 
              alt="Tennis Court" 
              className="mission-image"
            />
          </div>
        </div>
      </section>

      {/* 7. STICKY BOTTOM BAR */}
      <div className="sticky-amazon-bottom-bar">
        <div className="sticky-bar-content">
          <span className="sticky-badge">Amazon Deals</span>
          <p className="sticky-text">Amazon Prime Membership includes exclusive discounts on tennis rackets and gear.</p>
          <a 
            href="https://amzn.to/3O86Xkw" 
            target="_blank" 
            rel="nofollow sponsored" 
            className="sticky-cta-btn"
          >
            Check Gear Deals
          </a>
        </div>
      </div>
    </div>
  );
}
