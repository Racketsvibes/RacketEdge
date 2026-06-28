import { getSortedPostsData } from '../../lib/posts';

export async function GET() {
  const posts = getSortedPostsData();
  const siteUrl = 'https://racketedge.com';

  const rssItems = posts
    .slice(0, 20) // Include the 20 most recent posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`;
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description><![CDATA[${post.description}]]></description>
          <category><![CDATA[${post.category}]]></category>
          ${post.featuredImage ? `<enclosure url="${siteUrl}${post.featuredImage}" length="0" type="image/webp" />` : ''}
        </item>
      `;
    })
    .join('');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>RacketEdge | Expert Racket Sports Reviews &amp; Guides</title>
        <link>${siteUrl}</link>
        <description>In-depth, experience-based reviews of tennis rackets, strings, shoes, and gear by Chris Davies. Learn to play tennis with expert guides.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>
  `;

  return new Response(rssFeedXml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
