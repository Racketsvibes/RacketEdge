export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/wp-admin/',
          '/wp-includes/',
          '/api/',
          '/*?*', // Disallow crawling of search query parameters to preserve crawl budget
        ],
      },
      {
        userAgent: 'OAI-SearchBot', // ChatGPT Search
        allow: '/',
      },
      {
        userAgent: 'Claude-SearchBot', // Anthropic Search
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity Search
        allow: '/',
      }
    ],
    sitemap: 'https://www.racketedge.com/sitemap.xml',
  };
}
