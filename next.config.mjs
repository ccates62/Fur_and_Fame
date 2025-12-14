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
            {
              protocol: 'https',
              hostname: 'files.printful.com',
            },
          ],
        },
  // Note: SWC minification is always enabled in Next.js 16
};

export default nextConfig;

