import { MetadataRoute } from 'next';
import { getSitemapData } from '@/lib/api';
import { getBaseUrl } from '@/lib/utils';

/**
 * Dynamic XML Sitemap
 * ───────────────────
 * Fetches ALL published slugs from the backend /api/sitemap-data/ endpoint
 * (unpaginated) so every article, category, product and legal page is
 * indexed by Google — regardless of how many records exist.
 *
 * Priorities:
 *   1.0 → Homepage
 *   0.9 → Blog index
 *   0.8 → Individual blog posts
 *   0.7 → Categories
 *   0.6 → Products
 *   0.5 → CMS / legal pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const data = await getSitemapData();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // ── Blog posts ─────────────────────────────────────────────────────────────
  const postUrls: MetadataRoute.Sitemap = data.posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ── Categories ─────────────────────────────────────────────────────────────
  const categoryUrls: MetadataRoute.Sitemap = data.categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // ── Affiliate products ─────────────────────────────────────────────────────
  const productUrls: MetadataRoute.Sitemap = data.products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // ── CMS / legal pages ─────────────────────────────────────────────────────
  const pageUrls: MetadataRoute.Sitemap = data.pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticUrls, ...postUrls, ...categoryUrls, ...productUrls, ...pageUrls];
}
