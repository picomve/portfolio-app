import type { NextConfig } from 'next';

const normalizeOrigin = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '');

const serverActionAllowedOrigins = [
  process.env.CMS_ALLOWED_ORIGIN,
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.RAILWAY_STATIC_URL,
  'picomve.com.tr',
  'www.picomve.com.tr',
]
  .filter((value): value is string => Boolean(value))
  .map(normalizeOrigin);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production', // Disable optimization in production (Railway)
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
