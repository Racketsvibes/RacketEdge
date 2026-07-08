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
      <article className="contact-page">
        {/* Header */}
        <header className="page-header">
          <span className="category-badge">Get in Touch</span>
          <h1 className="page-title">Contact Me</h1>
          <p className="page-subtitle">
            The only thing I love more than testing gear is talking about it.
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="contact-grid">
          {/* Left: Contact Info */}
          <div className="contact-main-content">
            <h2>How Can I Help?</h2>
            <p>
              Hi, I'm Chris. Whether you are stuck choosing between two rackets, have a question about string tension, or just want to correct me on a foot-fault in one of my reviews, I want to hear from you.
            </p>
            <p>
              At RacketEdge, we are building a real community. That means when you send an email, it doesn't go to a robot. It goes directly to me.
            </p>

            <ul className="contact-help-list">
              <li><strong>Gear Questions:</strong> Stuck on which frame to buy? Tell me your skill level and what you are currently playing with. I'll do my best to point you in the right direction.</li>
              <li><strong>Feedback:</strong> Did I miss a detail? Is a link broken? Let me know so I can fix it.</li>
              <li><strong>Partnerships:</strong> I am open to testing new gear, but please note: <em>I do not accept payment for positive reviews.</em></li>
            </ul>

            <div className="contact-direct-box">
              <h3 className="contact-direct-title">📧 Direct Contact</h3>
              <p className="contact-email-line">
                <strong>Email:</strong> <a href="mailto:chris@racketedge.com" className="contact-email-link">chris@racketedge.com</a>
              </p>
              <p className="contact-response-note">
                I try to respond to all reader emails within 24–48 hours. If I am out on the court testing new frames, it might take a little longer!
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-wrapper">
            <h3 className="contact-form-title">Send a Message</h3>
            <form className="contact-form">
              <div className="contact-form-group">
                <label htmlFor="name" className="contact-label">Full Name *</label>
                <input type="text" id="name" required className="contact-input" />
              </div>
              <div className="contact-form-group">
                <label htmlFor="email" className="contact-label">Email Address *</label>
                <input type="email" id="email" required className="contact-input" />
              </div>
              <div className="contact-form-group">
                <label htmlFor="message" className="contact-label">Your Message *</label>
                <textarea id="message" rows="5" required className="contact-textarea"></textarea>
              </div>
              <button type="button" className="action-submit-btn contact-submit-btn">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </article>
    </div>
  );
}
