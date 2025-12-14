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
  // SWC minification disabled due to parser compatibility issues
  // Re-enable when parser issues are resolved for better production performance
  swcMinify: false,
};

export default nextConfig;

