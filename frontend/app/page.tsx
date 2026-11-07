import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedPosts, getPosts, getProducts, getCategories, getSiteSettings } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { ProductCard } from '@/components/ProductCard';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ArrowRight, Laptop, Monitor, Keyboard, Headphones, Cpu, Layers, Smartphone } from 'lucide-react';

export const revalidate = 60; // ISR

// Helper to get icon for category
function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('laptop')) return <Laptop className="w-5 h-5" />;
  if (lower.includes('monitor') || lower.includes('display')) return <Monitor className="w-5 h-5" />;
  if (lower.includes('keyboard')) return <Keyboard className="w-5 h-5" />;
  if (lower.includes('audio') || lower.includes('headphone')) return <Headphones className="w-5 h-5" />;
  if (lower.includes('dock') || lower.includes('hub')) return <Cpu className="w-5 h-5" />;
  if (lower.includes('phone') || lower.includes('mobile')) return <Smartphone className="w-5 h-5" />;
  return <Layers className="w-5 h-5" />;
}

export default async function HomePage() {
  const [featuredPosts, postsRes, productsRes, categoriesRes, settings] = await Promise.all([
    getFeaturedPosts(),
    getPosts({ page: 1 }),
    getProducts({ featured: true }),
    getCategories(),
    getSiteSettings(),
  ]);

  const latestPosts = postsRes?.results || [];
  const topProducts = productsRes?.results || [];
  const categories = categoriesRes?.results || [];

  const heroImageUrl =
    settings?.display_hero_image ||
    '/hero-desk.jpg';

  return (
    <div>

      {/* ─────────────────────────────────────────────────
          HERO — Modern Centered Clean Typography
      ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          
          {settings?.hero_badge && (
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60 shadow-2xs">
              <span>{settings.hero_badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none">
            {settings?.hero_title || 'Smarter Tech Buying Decisions'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {settings?.hero_subtitle || 'Independent, rigorous reviews and buying guides crafted for students, developers, and tech professionals who demand clarity over hype.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/blog"
              id="hero-cta-guides"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Explore Buying Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              id="hero-cta-reviews"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors"
            >
              <span>Browse Hardware Reviews</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          EXPLORE BY CATEGORY
      ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-100 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Explore by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-blue-500 hover:text-slate-900 dark:hover:text-white hover:shadow-xs transition-all w-full min-h-[52px]"
              >
                <span className="text-slate-500 dark:text-slate-400 shrink-0">{getCategoryIcon(cat.name)}</span>
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          LATEST BUYING GUIDES
      ───────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Latest Buying Guides</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.slice(0, 3).map((post, idx) => (
              <ArticleCard
                key={post.id}
                post={post}
                score={idx === 0 ? 9.2 : idx === 1 ? 8.8 : 9.5}
              />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-md hover:border-slate-900 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              View All Reviews
            </Link>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          TOP REVIEWED PRODUCTS
      ───────────────────────────────────────────────── */}
      {topProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Reviewed Products</h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
            >
              Browse all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          FEATURED POST (if exists)
      ───────────────────────────────────────────────── */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Editor&apos;s Pick</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-900/70 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              {featuredPosts[0].category?.name && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {featuredPosts[0].category.name}
                </span>
              )}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {featuredPosts[0].title}
              </h3>
              {featuredPosts[0].excerpt && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {featuredPosts[0].excerpt}
                </p>
              )}
              <Link
                href={`/blog/${featuredPosts[0].slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-blue-400 hover:underline"
              >
                Read the full guide
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {(featuredPosts[0].display_image || featuredPosts[0].image_url_fallback) && (
              <div className="rounded-lg overflow-hidden aspect-video bg-slate-950">
                <img
                  src={featuredPosts[0].display_image || featuredPosts[0].image_url_fallback!}
                  alt={featuredPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          NEWSLETTER
      ───────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 dark:border-slate-800/80 py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Stay in the loop
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Get our latest buying guides and reviews delivered to your inbox. No spam, unsubscribe anytime.
          </p>
          <div className="pt-2">
            <NewsletterForm source="homepage_newsletter" />
          </div>
        </div>
      </section>

    </div>
  );
}
