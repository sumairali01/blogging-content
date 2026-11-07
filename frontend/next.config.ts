import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Automatically serve images as WebP/AVIF for faster loading and better Core Web Vitals
    formats: ['image/avif', 'image/webp'],

    // Define all remote domains that serve product/article images
    // Add more patterns here if you add new image sources
    remotePatterns: [
      // Unsplash — used for seed/demo article images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Amazon product images (multiple subdomains)
      {
        protocol: 'https',
        hostname: '*.amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      // Walmart
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      },
      // Target
      {
        protocol: 'https',
        hostname: 'target.scene7.com',
      },
      // Cloudinary (if you later move media to Cloudinary)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // AWS S3 (if you later move media to S3)
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.us-east-1.amazonaws.com',
      },
      // Django media server — local dev
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      // Django media server — production (replace with your actual API domain)
      {
        protocol: 'https',
        hostname: 'api.yourdomain.com',
      },
    ],

    // Cache optimized images for 60 days (improves repeat visit performance)
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },

  // Enable React strict mode for better development warnings
  reactStrictMode: true,
};

export default nextConfig;
