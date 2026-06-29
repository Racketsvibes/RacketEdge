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
      <article className="about-page" style={{ padding: '64px 0', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Area */}
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="category-badge" style={{ marginBottom: '16px' }}>Meet The Founder</span>
          <h1 className="page-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>Chris Davies</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            I am a competitive player, a student of the game, and a total gear nerd dedicated to bringing transparency to racket sports.
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="mission-grid" style={{ alignItems: 'flex-start' }}>
          {/* Left Column: Image & Quick Facts */}
          <div className="about-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="about-img-wrapper" style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--border-color)'
            }}>
              <img 
                src="/wp-content/uploads/2026/01/cropped-Author-1.webp" 
                alt="Chris Davies on the Tennis Court" 
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              />
            </div>
            
            <div className="quick-facts" style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '24px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '16px' }}>My Play Style</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong>Current Racket:</strong> Babolat Pure Strike</li>
                <li><strong>Strings:</strong> RPM Blast at 52lbs</li>
                <li><strong>Grip:</strong> Semi-Western Forehand</li>
                <li><strong>Favorite Surface:</strong> Hard Court</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Bio & Methodology */}
          <div className="about-main-content page-content-wrapper">
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
            <p style={{ fontStyle: 'italic', color: 'var(--primary)', borderLeft: '3px solid var(--primary)', paddingLeft: '16px', margin: '32px 0' }}>
              "If I haven't played a competitive set with a racket, you won't see it recommended on this site."
            </p>

            <h2>How We Test Gear</h2>
            <p>We don't accept paid placements to "guarantee" a positive review. My testing process is simple and brutal:</p>
            <ul>
              <li><strong>The Weigh-In:</strong> I measure the actual weight and balance (which often differs from what is printed on the frame).</li>
              <li><strong>The Drill Session:</strong> We hit hundreds of forehands, backhands, and serves to find the racket's "personality."</li>
              <li><strong>The Match Play:</strong> I use the gear in live games to see how it holds up under pressure.</li>
            </ul>

            <div style={{ marginTop: '48px' }}>
              <Link href="/posts/best-tennis-rackets" className="action-submit-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Read My Latest Racket Reviews
              </Link>
            </div>
          </div>
        </div>

      </article>
    </div>
  );
}
