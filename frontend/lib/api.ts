import { BlogPost, Category, Tag, AffiliateProduct, CMSPage, SiteSetting, SitemapData, PaginatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds (ISR)
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`API Error [${res.status}]: ${res.statusText} at ${endpoint}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch failure at ${endpoint}:`, error);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSetting | null> {
  return fetchAPI<SiteSetting>('/settings/');
}

export async function getCategories(): Promise<PaginatedResponse<Category> | null> {
  return fetchAPI<PaginatedResponse<Category>>('/categories/');
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return fetchAPI<Category>(`/categories/${slug}/`);
}

export async function getTags(): Promise<PaginatedResponse<Tag> | null> {
  return fetchAPI<PaginatedResponse<Tag>>('/tags/');
}

export async function getPosts(params: {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  featured?: boolean;
  page?: number;
} = {}): Promise<PaginatedResponse<BlogPost> | null> {
  const query = new URLSearchParams();
  if (params.category) query.append('category__slug', params.category);
  if (params.tag) query.append('tags__slug', params.tag);
  if (params.author) query.append('author__slug', params.author);
  if (params.search) query.append('search', params.search);
  if (params.featured) query.append('is_featured', 'true');
  if (params.page) query.append('page', params.page.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchAPI<PaginatedResponse<BlogPost>>(`/posts/${queryString}`);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return fetchAPI<BlogPost>(`/posts/${slug}/`);
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const data = await fetchAPI<BlogPost[]>('/posts/featured/');
  return data || [];
}

export async function getProducts(params: {
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
} = {}): Promise<PaginatedResponse<AffiliateProduct> | null> {
  const query = new URLSearchParams();
  if (params.category) query.append('category__slug', params.category);
  if (params.search) query.append('search', params.search);
  if (params.featured) query.append('is_featured', 'true');
  if (params.page) query.append('page', params.page.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchAPI<PaginatedResponse<AffiliateProduct>>(`/products/${queryString}`);
}

export async function getProductBySlug(slug: string): Promise<AffiliateProduct | null> {
  return fetchAPI<AffiliateProduct>(`/products/${slug}/`);
}

export async function getCMSPage(slug: string): Promise<CMSPage | null> {
  return fetchAPI<CMSPage>(`/pages/${slug}/`);
}

export async function subscribeNewsletter(email: string, source: string = ''): Promise<{ message: string } | null> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_BASE}/subscribe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success?: boolean; message?: string; [key: string]: any } | null> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_BASE}/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches all published slugs for posts, categories, products, and CMS pages
 * from the lightweight /api/sitemap-data/ endpoint (unpaginated, minimal fields).
 *
 * Used exclusively by app/sitemap.ts to build a complete sitemap regardless
 * of how many posts exist.
 *
 * cache: 'no-store' ensures Next.js always gets fresh data when it revalidates
 * the sitemap route (every 24h by default in production).
 */
export async function getSitemapData(): Promise<SitemapData> {
  const empty: SitemapData = { posts: [], categories: [], products: [], pages: [] };
  try {
    const res = await fetch(`${API_BASE_URL}/sitemap-data/`, {
      cache: 'no-store',
    });
    if (!res.ok) return empty;
    return await res.json();
  } catch {
    return empty;
  }
}
