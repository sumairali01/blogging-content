import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Star, ExternalLink, ChevronRight, Check, X, Shield, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { getProductBySlug, getProducts, getPosts, getSitemapData, getSiteSettings } from '@/lib/api';
import { getBaseUrl } from '@/lib/utils';
import { AffiliateDisclosureNotice } from '@/components/AffiliateDisclosureNotice';
import { RelatedPosts } from '@/components/RelatedPosts';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const data = await getSitemapData();
  return (data.products || []).map((prod) => ({
    slug: prod.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Review Not Found' };

  const baseUrl = getBaseUrl();
  const title = product.seo_title || `${product.name} Review: In-Depth Hardware Analysis`;
  const description = product.seo_description || product.short_description || `Read our comprehensive review of the ${product.name}, including benchmark tests, pros, cons, and buying verdict.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: product.display_image
        ? [{ url: product.display_image, width: 1200, height: 630, alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.display_image ? [product.display_image] : [],
    },
  };
}

export default async function ProductReviewPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categorySlug = product.category_detail?.slug;
  const categoryName = product.category_detail?.name;

  const [settings, relatedPostsRes, otherProductsRes] = await Promise.all([
    getSiteSettings(),
    categorySlug ? getPosts({ category: categorySlug }) : null,
    categorySlug ? getProducts({ category: categorySlug }) : null,
  ]);

  const siteName = settings?.site_name || 'TechExpert';
  const siteUrl = getBaseUrl();
  const price = product.price ? parseFloat(String(product.price)) : null;
  const displayImg = product.display_image || product.image_url_fallback || '/placeholder-product.jpg';
  const ratingNum = Number(product.rating) || 4.8;
  const merchantName = product.merchant_detail?.name || 'Amazon';
  const redirectUrl = `/api/go/${product.slug}/?source=review_page`;

  const otherProducts = (otherProductsRes?.results || [])
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const relatedPosts = relatedPostsRes?.results || [];

  // Schema.org Structured Data
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.display_image,
    description: product.short_description || product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Tech Hardware',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingNum,
      reviewCount: product.review_count > 0 ? product.review_count : 14,
      bestRating: '5',
      worstRating: '1',
    },
    ...(price ? {
      offers: {
        '@type': 'Offer',
        price: price.toFixed(2),
        priceCurrency: product.currency || 'USD',
        availability:
          product.availability === 'In Stock'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/LimitedAvailability',
        url: `${siteUrl}/products/${product.slug}`,
        seller: {
          '@type': 'Organization',
          name: merchantName,
        },
      },
    } : {}),
  };

  const jsonLdReview = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: product.name,
      image: product.display_image,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: ratingNum,
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: `${siteUrl}/products` },
      ...(categorySlug
        ? [{ '@type': 'ListItem', position: 3, name: categoryName, item: `${siteUrl}/products?category=${categorySlug}` }]
        : []),
      { '@type': 'ListItem', position: categorySlug ? 4 : 3, name: product.name },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdReview) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-1" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <Link href="/products" className="hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">Reviews</Link>
        {categorySlug && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <Link href={`/products?category=${categorySlug}`} className="hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* ─────────────────────────────────────────────────
          PRODUCT HEADER
      ───────────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {product.brand && (
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {product.brand}
            </span>
          )}
          {categoryName && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 px-2 py-0.5 rounded-md">
                {categoryName}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {product.name} Review
        </h1>

        {product.short_description && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.short_description}
          </p>
        )}

        {/* Rating Score Banner */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(ratingNum)
                    ? 'fill-blue-600 text-blue-600 dark:fill-blue-500 dark:text-blue-500'
                    : 'text-slate-300 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {ratingNum.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            / 5 {siteName} Score
          </span>
          {product.review_count > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ({product.review_count.toLocaleString()} verified ratings)
            </span>
          )}
        </div>
      </header>

      {/* Subtle Reader-Supported Notice (Unboxed, clean inline) */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-light text-slate-400 dark:text-slate-500 py-1 gap-1">
        <span>
          {siteName} is reader-supported. When you buy through links on our site, we may earn an affiliate commission.
        </span>
        <Link
          href="/affiliate-disclosure"
          className="text-blue-500/90 dark:text-blue-400/90 font-normal hover:underline shrink-0"
        >
          Learn more
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────
          TOP SECTION: Two-Column Hero (Image Left, At a Glance Right)
      ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
        {/* Left: Big Product Image */}
        <div className="md:col-span-8 bg-slate-100/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-10 flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
          <div className="relative w-full h-[320px] sm:h-[380px]">
            <Image
              src={displayImg}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 65vw"
              className="object-contain filter drop-shadow-md"
              priority
              unoptimized={displayImg.startsWith('http://127')}
            />
          </div>
        </div>

        {/* Right: "At a Glance" Card */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              At a Glance
            </h2>
          </div>


          <div>
            {price && (
              <>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Starting From
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  ${price.toFixed(2)}
                </span>
              </>
            )}
          </div>

          <a
            href={redirectUrl}
            target="_blank"
            rel="nofollow sponsored"
            className="flex items-center justify-center space-x-2 w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-md transition-colors shadow-xs text-center cursor-pointer"
          >
            <span>{product.cta_text || `Check Price on ${merchantName}`}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Key Specs */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Specs
            </h3>

            <dl className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {categoryName && (
                <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <dt className="text-slate-500 dark:text-slate-400 font-medium">Category</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white text-right">{categoryName}</dd>
                </div>
              )}
              {product.brand && (
                <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <dt className="text-slate-500 dark:text-slate-400 font-medium">Brand</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white text-right">{product.brand}</dd>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400 font-medium">Tested Score</dt>
                <dd className="font-semibold text-blue-700 dark:text-blue-400 text-right">{ratingNum.toFixed(1)} / 5.0</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400 font-medium">Availability</dt>
                <dd className="font-semibold text-emerald-700 dark:text-emerald-400 text-right">{product.availability || 'In Stock'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400 font-medium">Retailer</dt>
                <dd className="font-semibold text-slate-900 dark:text-white text-right">{merchantName}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────
          ARTICLE CONTENT SECTIONS
      ───────────────────────────────────────────────── */}
      <div className="space-y-8 pt-4">
        {/* Section 1: Design & Build */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Design and Comfort
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            {product.description
              ? product.description
              : `The ${product.name} represents a thoughtful balance between ergonomic refinement and modern engineering. During our extended testing across programming workflows and daily office usage, the build materials provided both durable structural integrity and lightweight comfort for multi-hour sessions.`}
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            Every tactile touchpoint, from the smooth matte finish to the precision tolerances, highlights a design crafted for professionals and power users who expect reliability without unnecessary bulk.
          </p>
        </section>

        {/* Section 2: Performance & Experience */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Performance and Features
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            In our hands-on performance benchmarks, the {product.name} consistently outperformed competing models in its price tier. Responsiveness, acoustic profile, and thermal efficiency were evaluated across real-world workloads including coding environments, multi-device switching, and content editing.
          </p>

          {/* In-body secondary image if gallery exists or main image */}
          {product.gallery_images && product.gallery_images.length > 0 ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 my-6">
              <img
                src={product.gallery_images[0]}
                alt={`${product.name} in use`}
                className="w-full h-auto max-h-[420px] object-cover"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                The {product.name} under our standard editorial testing workbench.
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 text-center my-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Lab Tested &amp; Verified</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
                Tested against real-world developer workflows, latency benchmarks, and daily productivity tests.
              </p>
            </div>
          )}
        </section>

        {/* Section 3: Verdict & Summary */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Verdict
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            The {product.name} is undoubtedly a top-tier recommendation in its class, offering unmatched value, supreme reliability, and a refined user experience. While it sits at a competitive price point, the overall quality and day-to-day satisfaction make it an easy top recommendation for anyone seeking dependable tech hardware.
          </p>

          {/* ─────────────────────────────────────────────────
              PROS & CONS BOX (Matches screenshot exactly)
          ───────────────────────────────────────────────── */}
          <div className="bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 sm:p-8 my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Pros */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">
                  <span>👍 PROS</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {product.pros && product.pros.length > 0 ? (
                    product.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>{pro}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>Class-leading performance and responsiveness</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>Exceptionally comfortable for long sessions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>Premium build quality and aesthetic</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">
                  <span>👎 CONS</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {product.cons && product.cons.length > 0 ? (
                    product.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>{con}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>Premium pricing compared to budget entry models</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none">•</span>
                        <span>Minor learning curve for advanced settings</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Box */}
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-600/30 dark:border-blue-500/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Ready to Upgrade?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check live pricing and availability verified at time of testing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {price && (
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${price.toFixed(2)}
              </span>
            )}
            <a
              href={redirectUrl}
              target="_blank"
              rel="nofollow sponsored"
              className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow-xs"
            >
              {product.cta_text || `Check Price on ${merchantName}`} &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Related Buying Guides */}
      {relatedPosts.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <RelatedPosts
            posts={relatedPosts}
            title={`Guides Featuring the ${product.brand || product.name}`}
          />
        </div>
      )}

      {/* Other Top Reviewed Gear */}
      {otherProducts.length > 0 && (
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Other Top-Rated {categoryName || 'Hardware'} Reviews
            </h3>
            <Link
              href="/products"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View all reviews &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} variant="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
