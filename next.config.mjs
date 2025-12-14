/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'www.furandfame.com',
      },
      {
        protocol: 'https',
        hostname: 'furandfame.com',
      },
    ],
  },
  // Note: SWC minification is enabled by default in Next.js 16+
  // No need to configure it manually
};

export default nextConfig;

