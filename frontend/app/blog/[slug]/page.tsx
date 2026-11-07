import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Calendar, ChevronRight, HelpCircle, Layers, Tag as TagIcon, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { getPostBySlug, getPosts, getSitemapData, getSiteSettings } from '@/lib/api';
import { getBaseUrl } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';
import { SocialShareBar } from '@/components/SocialShareBar';
import { NewsletterForm } from '@/components/NewsletterForm';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const data = await getSitemapData();
  return (data.posts || []).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Guide Not Found' };

  const baseUrl = getBaseUrl();
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: post.canonical_url || `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author.name] : [],
      images: post.display_image
        ? [{ url: post.display_image, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.display_image ? [post.display_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch settings for dynamic site name
  const settings = await getSiteSettings();
  const siteName = settings?.site_name || 'TechGear Guide';

  // Fetch auto related posts by same category
  const relatedPostsRes = post.category
    ? await getPosts({ category: post.category.slug })
    : null;

  const autoRelatedPosts = (relatedPostsRes?.results || [])
    .filter((p) => p.slug !== post.slug)
    .slice(0, 4);

  // Combine manual + auto related posts (manual takes priority)
  const manualRelated = post.manual_related_posts || [];
  const relatedPosts = manualRelated.length > 0 ? manualRelated : autoRelatedPosts;

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '';

  const updatedDate = post.updated_at
    ? new Date(post.updated_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '';

  // JSON-LD Structured Data
  const siteUrl = getBaseUrl();
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': post.post_type === 'review' ? 'Review' : 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.display_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Tech Editorial Staff',
      url: post.author ? `${siteUrl}/author/${post.author.slug}` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Tech Guides', item: `${siteUrl}/blog` },
      ...(post.category
        ? [{ '@type': 'ListItem', position: 3, name: post.category.name, item: `${siteUrl}/blog/category/${post.category.slug}` }]
        : []),
      { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title },
    ],
  };

  const hasFaqs = post.faqs && post.faqs.length > 0;
  const jsonLdFaq = hasFaqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs?.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  const hasProducts = post.affiliate_products && post.affiliate_products.length > 0;
  const topProduct = hasProducts ? post.affiliate_products![0] : null;

  // Dynamic Table of Contents items
  const tocItems = [
    { id: 'guide-content', label: 'Buying Guide & Analysis' },
    ...(hasProducts ? [{ id: 'product-breakdown', label: 'In-Depth Product Breakdown' }] : []),
    ...(hasFaqs ? [{ id: 'faq-section', label: 'Frequently Asked Questions' }] : []),
    ...(relatedPosts.length > 0 ? [{ id: 'related-guides', label: 'Related Buying Guides' }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {jsonLdFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-1" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold whitespace-nowrap">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold whitespace-nowrap">Tech Guides</Link>
        {post.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <Link href={`/blog/category/${post.category.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold whitespace-nowrap">
              {post.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[180px] sm:max-w-xs">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors border border-blue-200/60 dark:border-blue-800/60"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{post.category.name}</span>
            </Link>
          )}
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-md capitalize">
            {post.post_type?.replace('-', ' ')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed border-l-4 border-blue-600 pl-4 italic">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta Bar */}
        <div className="border-y border-slate-200 dark:border-slate-800 py-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                {post.author?.name ? post.author.name[0] : 'T'}
              </div>
              <div>
                {post.author ? (
                  <Link
                    href={`/author/${post.author.slug}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors block text-xs sm:text-sm leading-tight"
                  >
                    {post.author.name}
                  </Link>
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm leading-tight">Tech Editorial Staff</span>
                )}
                <span className="text-slate-400 dark:text-slate-500 text-[10px]">Hardware &amp; Setup Specialist</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-light text-slate-400 dark:text-slate-500">
              {publishedDate && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400/80 dark:text-slate-500" />
                  <span className="font-light text-[11px] sm:text-xs">{publishedDate}</span>
                </span>
              )}
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400/80 dark:text-slate-500" />
                <span className="font-light text-[11px] sm:text-xs">{post.reading_time || 5} min read</span>
              </span>
              {updatedDate && publishedDate !== updatedDate && (
                <span className="text-slate-400/80 dark:text-slate-500 text-[10px] font-light">Updated {updatedDate}</span>
              )}
            </div>
          </div>

          {/* Reader-Supported Notice */}
          {hasProducts && (
            <div className="pt-1.5 border-t border-slate-100/80 dark:border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-light text-slate-400 dark:text-slate-500 gap-1 leading-normal">
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
          )}
        </div>

        {/* Social Share Bar */}
        <SocialShareBar
          url={`${siteUrl}/blog/${post.slug}`}
          title={post.title}
          mediaUrl={post.display_image}
          description={post.excerpt}
        />
      </header>

      {/* ────────────────────────────────────────────────────────────────
          2-COLUMN MAGAZINE LAYOUT:
          Left (Col 8): Compact Image + Immediate Reading Content
          Right (Col 4): Sticky Sidebar (Top Pick Card + Table of Contents)
      ──────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* ── LEFT COLUMN: Main Reading Content ── */}
        <main className="lg:col-span-8 space-y-8 min-w-0">
          
          {/* Featured Image */}
          {post.display_image && (
            <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800 max-h-[380px] bg-slate-950">
              <img
                src={post.display_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Article Content (Starts Right Here Immediately!) */}
          <div
            id="guide-content"
            className="scroll-mt-24 prose prose-slate lg:prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold hover:prose-a:underline leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Individual Product Detailed Cards */}
          {hasProducts && (
            <section id="product-breakdown" className="scroll-mt-24 pt-6 space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {post.affiliate_products!.length === 1 ? 'Detailed Product Evaluation' : 'In-Depth Hardware Breakdown'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Evaluated for performance, ergonomics, connectivity, and value. Prices verified at time of publication.
                </p>
              </div>
              <div className="space-y-6">
                {post.affiliate_products!.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    articleSlug={post.slug} 
                    variant="detailed"
                  />
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {hasFaqs && (
            <section id="faq-section" className="scroll-mt-24 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-4">
                {post.faqs?.map((faq, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{faq.question}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* In-Article Newsletter Signup */}
          <section className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 my-8 shadow-lg border border-slate-800">
            <div className="space-y-1.5">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Free Tech Buyer Digest</span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">Enjoyed this guide? Get tested gear alerts</h3>
              <p className="text-slate-300 text-xs sm:text-sm">We benchmark hardware, uncover price drops, and send curated recommendations weekly.</p>
            </div>
            <div className="max-w-md pt-2">
              <NewsletterForm source={`article_${post.slug}`} />
            </div>
          </section>
        </main>

        {/* ── RIGHT COLUMN: Sticky Sidebar ── */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* 1. Sticky Top Pick Card */}
          {topProduct && (
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-600/30 dark:border-blue-500/40 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                {topProduct.badge ? (
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {topProduct.badge}
                  </span>
                ) : <span />}
                {topProduct.rating && (
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {Number(topProduct.rating).toFixed(1)} / 5.0 Score
                  </span>
                )}
              </div>

              {/* Compact Thumbnail */}
              <div className="relative w-full h-36 bg-slate-50 dark:bg-slate-800/60 rounded-xl overflow-hidden p-2 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <img
                  src={topProduct.display_image || topProduct.image_url_fallback || '/placeholder-product.jpg'}
                  alt={topProduct.name}
                  className="max-h-full max-w-full object-contain p-2 hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
                  <Link href={topProduct.review_url || `/products/${topProduct.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {topProduct.name}
                  </Link>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {topProduct.short_description || "Top rated hardware pick evaluated for performance, durability, and daily workflow."}
                </p>
              </div>

              {/* Key Highlight Dot Bullets */}
              {topProduct.pros && topProduct.pros.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Key Highlights
                  </span>
                  <ul className="space-y-1.5">
                    {topProduct.pros.slice(0, 3).map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-1.5" />
                        <span className="leading-tight text-[11px] sm:text-xs">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`/api/go/${topProduct.slug}/?article=${post.slug}`}
                  target="_blank"
                  rel="nofollow sponsored"
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors shadow-xs"
                >
                  {topProduct.cta_text || 'Check On Amazon'} &rarr;
                </a>
                <Link
                  href={topProduct.review_url || `/products/${topProduct.slug}`}
                  className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors"
                >
                  Read Full Review
                </Link>
              </div>
            </div>
          )}

          {/* 2. Sticky Table of Contents */}
          {tocItems.length > 1 && (
            <TableOfContents items={tocItems} />
          )}

          {/* 3. Trust & Editorial Verification Badge */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-[12px]">100% Lab Tested</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">All recommendations verified on real developer workflows.</span>
            </div>
          </div>

        </aside>
      </div>

      {/* ── BOTTOM FULL WIDTH: Related Buying Guides ── */}
      {relatedPosts.length > 0 && (
        <div id="related-guides" className="scroll-mt-24 pt-8 border-t border-slate-200 dark:border-slate-800">
          <RelatedPosts posts={relatedPosts} title="Related Buying Guides &amp; Comparisons" />
        </div>
      )}
    </div>
  );
}
