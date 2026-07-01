import { getSortedPostsData } from '../lib/posts';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function sitemap() {
  const baseUrl = 'https://racketedge.com';
  
  // 1. Static Pages
  const staticRoutes = ['', '/about', '/contact', '/privacy-policy', '/affiliate-disclosure'].map((route) => {
    let priority = 0.8;
    if (route === '') priority = 1.0;
    else if (route === '/about' || route === '/contact') priority = 0.7;
    
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority,
    };
  });

  // 2. Blog Posts
  const allPosts = getSortedPostsData();
  const postRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.dateModified || post.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // 3. Category Archives
  const categories = Array.from(new Set(allPosts.map(p => p.category || 'General')));
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
