import React from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://racketedge.com'),
  title: {
    default: 'RacketEdge | Expert Racket Sports Gear Reviews & Playing Guides',
    template: '%s | RacketEdge'
  },
  description: 'In-depth, experience-based reviews of tennis rackets, strings, shoes, and gear by Chris Davies. Learn to play tennis with expert guides.',
  alternates: {
    canonical: './'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://racketedge.com',
    siteName: 'RacketEdge',
    title: 'RacketEdge | Expert Racket Sports Gear Reviews & Playing Guides',
    description: 'In-depth, experience-based reviews of tennis rackets, strings, shoes, and gear by Chris Davies. Learn to play tennis with expert guides.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'RacketEdge Logo',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RacketEdge | Expert Racket Sports Gear Reviews & Playing Guides',
    description: 'In-depth, experience-based reviews of tennis rackets, strings, shoes, and gear by Chris Davies. Learn to play tennis with expert guides.',
    images: ['/logo.png'],
  }
};

export default function RootLayout({ children }) {
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://racketedge.com/#organization',
        name: 'RacketEdge',
        url: 'https://racketedge.com',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://racketedge.com/#logo',
          url: 'https://racketedge.com/logo.png',
          caption: 'RacketEdge'
        },
        image: {
          '@id': 'https://racketedge.com/#logo'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://racketedge.com/#website',
        url: 'https://racketedge.com',
        name: 'RacketEdge',
        publisher: {
          '@id': 'https://racketedge.com/#organization'
        }
      },
      {
        '@type': 'Person',
        '@id': 'https://racketedge.com/#author',
        name: 'Chris Davies',
        url: 'https://racketedge.com/about',
        image: {
          '@type': 'ImageObject',
          url: 'https://racketedge.com/logo.png',
          caption: 'Chris Davies'
        },
        description: 'Chris Davies is a club tennis player, coach, and racket sports enthusiast with over 15 years of gear playtesting experience.'
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="max-image-preview:large" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W3J1SK5X47"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W3J1SK5X47');
          `}
        </Script>
      </head>
      <body>
        <div className="site-wrapper">
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
