import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Check, X, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { AffiliateProduct } from '@/types';

interface Props {
  product: AffiliateProduct;
  articleSlug?: string;
  variant?: 'grid' | 'detailed';
}

export const ProductCard: React.FC<Props> = ({ 
  product, 
  articleSlug, 
  variant = 'grid' 
}) => {
  const redirectUrl = `/api/go/${product.slug}/${articleSlug ? `?article=${articleSlug}` : ''}`;
  const reviewUrl = product.review_url || `/products/${product.slug}`;
  const displayImg = product.display_image || product.image_url_fallback || '/placeholder-product.jpg';
  const price = product.price ? parseFloat(String(product.price)) : null;

  // Detailed variant (used inside long-form reviews and buying guides)
  if (variant === 'detailed') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 my-8 relative overflow-hidden group">
        {product.badge && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-xs">
            <span>{product.badge}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Image */}
          <div className="md:col-span-5 flex justify-center">
            <Link href={reviewUrl} className="relative w-full h-60 sm:h-68 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:bg-blue-50/20 dark:group-hover:bg-blue-950/20 transition-colors block">
              <Image
                src={displayImg}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                unoptimized={displayImg.startsWith('http://127')}
              />
            </Link>
          </div>

          {/* Details */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {product.brand && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700">
                  {product.brand}
                </span>
              )}
              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                {product.availability || 'In Stock'}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-medium ml-auto">
                {product.merchant_detail?.name || 'Verified Retailer'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              <Link href={reviewUrl} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {product.name}
              </Link>
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1.5" />
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">{product.rating}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">/ 5.0</span>
              </div>
              {product.review_count > 0 && (
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                  ({product.review_count.toLocaleString()} user reviews)
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Pros & Cons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Pros */}
              {product.pros && product.pros.length > 0 && (
                <div className="space-y-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    Key Strengths
                  </span>
                  <ul className="space-y-1">
                    {product.pros.slice(0, 3).map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 mt-1.5" />
                        <span className="leading-tight">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {product.cons && product.cons.length > 0 ? (
                <div className="space-y-1.5 bg-rose-50/40 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 block">
                    Considerations
                  </span>
                  <ul className="space-y-1">
                    {product.cons.slice(0, 3).map((con, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 dark:bg-rose-400 shrink-0 mt-1.5" />
                        <span className="leading-tight">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-xl flex items-center justify-center text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tested for developers &amp; power users</span>
                </div>
              )}
            </div>

            {/* Pricing & Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                {price && (
                  <>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Starting From</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ${price.toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={reviewUrl}
                  className="inline-flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-3 rounded-xl transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Full Review</span>
                </Link>

                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="nofollow sponsored"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <span>{product.cta_text || 'Check Price'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern Technical Grid Card
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col group relative">
      
      {/* Top Banner Tag */}
      {product.is_featured && (
        <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Top Pick</span>
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-2xs">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        <span>{product.rating}</span>
      </div>

      {/* Product Image Area */}
      <Link href={reviewUrl} className="h-52 sm:h-56 bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/60 dark:to-slate-900/80 p-6 flex items-center justify-center relative overflow-hidden border-b border-slate-100 dark:border-slate-800 block">
        <Image
          src={displayImg}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-108 transition-transform duration-300 filter drop-shadow-xs"
          unoptimized={displayImg.startsWith('http://127')}
        />
      </Link>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>{product.brand || 'Hardware'}</span>
            <span className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 px-2 py-0.5 rounded-md font-bold text-[10px]">
              {product.merchant_detail?.name || 'In Stock'}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={reviewUrl}>
              {product.name}
            </Link>
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
            {product.short_description || "High-performance tech hardware recommended for developers, students, and home office productivity."}
          </p>

          {/* Key Highlight Bullet */}
          {product.pros && product.pros.length > 0 && (
            <div className="pt-1 flex items-center space-x-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{product.pros[0]}</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
          <div>
            {price && (
              <>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">From</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">${price.toFixed(2)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={reviewUrl}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold px-2.5 py-2 rounded-lg transition-colors"
            >
              Review
            </Link>
            <a
              href={redirectUrl}
              target="_blank"
              rel="nofollow sponsored"
              className="inline-flex items-center space-x-1 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs"
            >
              <span>{product.cta_text || 'Buy'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
