export interface Author {
  id: number;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string;
  website: string;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  meta_title: string;
  meta_description: string;
  parent: number | null;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Merchant {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  website_url: string;
}

export interface AffiliateProduct {
  id: number;
  name: string;
  slug: string;
  brand: string;
  description: string;
  short_description: string;
  product_image: string | null;
  image_url_fallback: string;
  display_image: string;
  gallery_images: string[];
  affiliate_url: string;
  merchant: number | null;
  merchant_detail?: Merchant;
  price: number | string | null;
  currency: string;
  rating: number;
  review_count: number;
  pros: string[];
  cons: string[];
  category: number | null;
  category_detail?: Category;
  tags: number[];
  tags_detail?: Tag[];
  availability: string;
  cta_text: string;
  badge?: string;
  review_url?: string;
  disclosure: string;
  seo_title: string;
  seo_description: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image: string | null;
  image_url_fallback: string;
  display_image: string;
  author: Author | null;
  category: Category | null;
  tags: Tag[];
  affiliate_products?: AffiliateProduct[];
  post_type: 'review' | 'comparison' | 'best-list' | 'buying-guide' | 'informational';
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  created_at?: string;
  updated_at?: string;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  reading_time: number;
  views: number;
  faqs?: FAQItem[];
  manual_related_posts?: BlogPost[];
}

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  status: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  site_name: string;
  site_description: string;
  logo: string | null;
  favicon: string | null;
  hero_image?: string | null;
  hero_image_url?: string;
  display_hero_image?: string;
  hero_badge?: string;
  hero_title?: string;
  hero_subtitle?: string;
  default_meta_title: string;
  default_meta_description: string;
  social_links: Record<string, string>;
  contact_email: string;
  footer_text: string;
  analytics_ids: Record<string, string>;
  affiliate_disclosure_default: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Lightweight slug entry returned by the /api/sitemap-data/ endpoint */
export interface SitemapSlug {
  slug: string;
  updated_at: string;
}

/** Full response shape from /api/sitemap-data/ */
export interface SitemapData {
  posts: SitemapSlug[];
  categories: SitemapSlug[];
  products: SitemapSlug[];
  pages: SitemapSlug[];
}
