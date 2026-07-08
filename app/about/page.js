import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Chris Davies & RacketEdge',
  description: 'Learn more about Chris Davies, editor of RacketEdge, his playing history, gear testing methodology, and mission.',
  alternates: {
    canonical: 'https://racketedge.com/about',
  }
};

export default function AboutPage() {
  return (
    <div className="container">
      <article className="about-page">
        {/* Header */}
        <header className="page-header">
          <span className="category-badge">Meet The Founder</span>
          <h1 className="page-title">Chris Davies</h1>
          <p className="page-subtitle">
            I am a competitive player, a student of the game, and a total gear nerd dedicated to bringing transparency to racket sports.
          </p>
        </header>

        {/* Stats Section */}
        <div className="about-stats-grid">
          <div className="about-stat-card">
            <span className="stat-icon">🎾</span>
            <span className="stat-number">100+</span>
            <span className="stat-label">Rackets Tested</span>
          </div>
          <div className="about-stat-card">
            <span className="stat-icon">📅</span>
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="about-stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-number">37</span>
            <span className="stat-label">In-Depth Reviews</span>
          </div>
          <div className="about-stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-number">0</span>
            <span className="stat-label">Paid Reviews</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="about-grid">
          {/* Left: Image & Quick Facts */}
          <div className="about-sidebar">
            <div className="about-img-wrapper">
              <img
                src="/wp-content/uploads/2026/01/cropped-Author-1.webp"
                alt="Chris Davies on the Tennis Court"
                className="about-author-img"
              />
            </div>

            <div className="about-quick-facts">
              <h3 className="quick-facts-title">My Play Style</h3>
              <ul className="quick-facts-list">
                <li><strong>Current Racket:</strong> Babolat Pure Strike</li>
                <li><strong>Strings:</strong> RPM Blast at 52lbs</li>
                <li><strong>Grip:</strong> Semi-Western Forehand</li>
                <li><strong>Favorite Surface:</strong> Hard Court</li>
              </ul>
            </div>
          </div>

          {/* Right: Bio */}
          <div className="about-main-content">
            <h2>The "Prove It" Philosophy</h2>
            <p>
              For years, I was frustrated by the lack of transparency in the racket sports industry. Reviews were either too technical to understand or too vague to be useful. I wanted to build a resource that bridged that gap combining data with real-world "feel."
            </p>
            <p>
              I specialize in putting rackets through "stress tests" to answer the questions that actually matter to you:
            </p>
            <ul>
              <li><strong>Stability:</strong> Does the handle twist when I block a 100mph serve?</li>
              <li><strong>Comfort:</strong> Will this frame hurt my arm after 2 hours of play?</li>
              <li><strong>Power:</strong> Is the sweet spot actually forgiving, or is it just marketing fluff?</li>
            </ul>
            <blockquote className="about-quote">
              "If I haven't played a competitive set with a racket, you won't see it recommended on this site."
            </blockquote>

            <h2>How We Test Gear</h2>
            <p>We don't accept paid placements to "guarantee" a positive review. My testing process is simple and brutal:</p>
            <ul>
              <li><strong>The Weigh-In:</strong> I measure the actual weight and balance (which often differs from what is printed on the frame).</li>
              <li><strong>The Drill Session:</strong> We hit hundreds of forehands, backhands, and serves to find the racket's "personality."</li>
              <li><strong>The Match Play:</strong> I use the gear in live games to see how it holds up under pressure.</li>
            </ul>

            <div className="about-cta-section">
              <Link href="/posts/best-tennis-rackets" className="action-submit-btn">
                Read My Latest Racket Reviews →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
