import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact RacketEdge & Chris Davies',
  description: 'Get in touch with Chris Davies at RacketEdge. Share your racket playtesting questions, feedback, or business inquiries.',
  alternates: {
    canonical: 'https://racketedge.com/contact',
  }
};

export default function ContactPage() {
  return (
    <div className="container">
      <article className="contact-page" style={{ padding: '64px 0', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Area */}
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="category-badge" style={{ marginBottom: '16px' }}>Get in Touch</span>
          <h1 className="page-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>Contact Me</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            The only thing I love more than testing gear is talking about it.
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="mission-grid" style={{ alignItems: 'flex-start' }}>
          
          {/* Left Column: Contact Text */}
          <div className="contact-main-content page-content-wrapper">
            <h2 style={{ marginTop: '0' }}>How Can I Help?</h2>
            <p>
              Hi, I'm Chris. Whether you are stuck choosing between two rackets, have a question about string tension, or just want to correct me on a foot-fault in one of my reviews, I want to hear from you.
            </p>
            <p>
              At RacketEdge, we are building a real community. That means when you send an email, it doesn't go to a robot. It goes directly to me.
            </p>
            
            <ul style={{ marginTop: '32px' }}>
              <li><strong>Gear Questions:</strong> Stuck on which frame to buy? Tell me your skill level and what you are currently playing with. I’ll do my best to point you in the right direction.</li>
              <li><strong>Feedback:</strong> Did I miss a detail? Is a link broken? Let me know so I can fix it.</li>
              <li><strong>Partnerships:</strong> I am open to testing new gear, but please note: <em>I do not accept payment for positive reviews.</em></li>
            </ul>

            <div style={{ 
              marginTop: '48px', 
              padding: '24px', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--primary)' }}>Direct Contact</h3>
              <p style={{ margin: '0', fontSize: '16px' }}>
                <strong>Email:</strong> <a href="mailto:chris@racketedge.com" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>chris@racketedge.com</a>
              </p>
              <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                I try to respond to all reader emails within 24–48 hours. If I am out on the court testing new frames, it might take a little longer!
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-sidebar">
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '32px', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-headings)' }}>Send a Message</h3>
              <form className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    style={{ 
                      width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '15px'
                    }} 
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    style={{ 
                      width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '15px'
                    }} 
                  />
                </div>
                <div>
                  <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Your Message *</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    required 
                    style={{ 
                      width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '15px', resize: 'vertical'
                    }} 
                  ></textarea>
                </div>
                <button type="button" className="action-submit-btn" style={{ marginTop: '8px', width: '100%', padding: '14px', fontSize: '16px' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </article>
    </div>
  );
}
