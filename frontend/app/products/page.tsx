import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShoppingBag, Star, Filter, ExternalLink, BookOpen, Check } from 'lucide-react';
import { getProducts, getCategories, getPosts } from '@/lib/api';
import { Pagination } from '@/components/Pagination';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hardware & Tech Reviews',
  description: 'Explore independently tested tech products, laptops, monitors, mechanical keyboards, and audio hardware evaluated for students and developers.',
};

interface Props {
  searchParams: Promise<{ category?: string; page?: string; price_range?: string; type?: string }>;
}

export default async function ProductsDirectoryPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const currentCategory = resolvedSearchParams.category;
  const currentPriceRange = resolvedSearchParams.price_range;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 12;

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({
      category: currentCategory,
      page: currentPage,
    }),
    getCategories(),
    getPosts({ page: 1 }),
  ]);

  const products = productsRes?.results || [];
  const totalCount = productsRes?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const categories = categoriesRes?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tech Hardware Reviews
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Showing {products.length} tested hardware reviews and lab evaluations
        </p>
      </div>

      {/* ─────────────────────────────────────────────────
          TWO-COLUMN LAYOUT: Category Sidebar Left, Reviews List Right
      ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Category Filter Sidebar */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Filter by Category
            </h3>
            {currentCategory && (
              <Link
                href="/products"
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear
              </Link>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/products"
              className={`block py-2 px-3 rounded-xl font-semibold transition-colors ${
                !currentCategory
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>All Categories</span>
            </Link>
            {categories.map((cat) => {
              const isActive = currentCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Right: Horizontal Review Cards List (Matches Screenshot) */}
        <div className="lg:col-span-9 space-y-4">
          {products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No hardware reviews found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your filters or price range.</p>
              <Link
                href="/products"
                className="inline-block bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                View All Reviews
              </Link>
            </div>
          ) : (
            <>
              {products.map((product) => {
                const reviewUrl = product.review_url || `/products/${product.slug}`;
                const redirectUrl = `/api/go/${product.slug}/?source=reviews_list`;
                const displayImg = product.display_image || product.image_url_fallback || '/placeholder-product.jpg';
                const price = product.price ? parseFloat(String(product.price)) : null;
                const score = (Number(product.rating) * 2).toFixed(1); // Scale to 9.x rating badge like in screenshot

                return (
                  <article
                    key={product.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row group"
                  >
                    {/* Thumbnail with [Review] and [9.2 Score] Badge */}
                    <Link
                      href={reviewUrl}
                      className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 bg-slate-50 dark:bg-slate-800/80 p-4 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800"
                    >
                      <Image
                        src={displayImg}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 260px"
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        unoptimized={displayImg.startsWith('http://127')}
                      />

                      {/* Top Left: [Review] Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-slate-800/90 dark:bg-slate-950/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                        <BookOpen className="w-3 h-3" />
                        <span>Review</span>
                      </div>

                      {/* Top Right: [Score] Badge (like 9.2 in screenshot) */}
                      <div className="absolute top-2.5 right-2.5 bg-blue-700 dark:bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded shadow-2xs">
                        {score}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        {product.brand && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {product.brand} {product.category_detail?.name ? `• ${product.category_detail.name}` : ''}
                          </span>
                        )}

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          <Link href={reviewUrl}>
                            {product.name} Review
                          </Link>
                        </h2>

                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {product.short_description || "An exceptional hardware choice with premium acoustics, solid construction, and verified performance."}
                        </p>

                        {/* Pros summary inline bullets */}
                        {product.pros && product.pros.length > 0 && (
                          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-300">
                            {product.pros.slice(0, 2).map((pro, idx) => (
                              <div key={idx} className="flex items-center space-x-1.5">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                                <span className="font-medium">{pro}</span>
                              </div>
                            ))}
                            {product.cons && product.cons.length > 0 && (
                              <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                                <span className="text-slate-400 dark:text-slate-500 font-bold">•</span>
                                <span>{product.cons[0]}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer: Price + Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          {price && (
                            <span className="text-base font-black text-slate-900 dark:text-white">
                              ${price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={reviewUrl}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                          >
                            Read Review
                          </Link>
                          <a
                            href={redirectUrl}
                            target="_blank"
                            rel="nofollow sponsored"
                            className="inline-flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                          >
                            <span>{product.cta_text || 'Buy Now'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/products"
                  queryParams={currentCategory ? { category: currentCategory } : {}}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
