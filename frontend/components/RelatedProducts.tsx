import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { AffiliateProduct } from '@/types';

interface Props {
  products: AffiliateProduct[];
  articleSlug?: string;
  title?: string;
}

export const RelatedProducts: React.FC<Props> = ({
  products,
  articleSlug,
  title = 'Hardware Featured in This Guide',
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-10 space-y-5">
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const redirectUrl = `/api/go/${product.slug}/${articleSlug ? `?article=${articleSlug}` : ''}`;
          const price = product.price ? parseFloat(String(product.price)) : null;
          const displayImg = product.display_image || product.image_url_fallback;

          return (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col space-y-3 group"
            >
              {/* Image */}
              {displayImg && (
                <div className="h-40 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                  <img
                    src={displayImg}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Name & Brand */}
              <div>
                {product.brand && (
                  <span className="text-xs text-slate-400 font-semibold">{product.brand}</span>
                )}
                <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{product.rating}</span>
                {product.review_count > 0 && (
                  <span className="text-slate-400">({product.review_count.toLocaleString()})</span>
                )}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                {price && (
                  <span className="font-black text-slate-900 text-base">
                    ${price.toFixed(2)}
                  </span>
                )}

                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="nofollow sponsored"
                  className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{product.cta_text || 'View Price'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
