/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@keeper/ui', '@keeper/types', '@keeper/utils', '@keeper/config'],
  images: {
    domains: ['localhost', 'keeper-uploads.s3.amazonaws.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
