/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Crucial for static export / basic Vercel hosting of local/external images
  },
};

export default nextConfig;
