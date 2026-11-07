import React from 'react';
import { ExternalLink, Star, Sparkles, Check, ArrowRight } from 'lucide-react';
import { AffiliateProduct } from '@/types';

interface Props {
  products: AffiliateProduct[];
  articleSlug?: string;
  title?: string;
}

export const ComparisonTable: React.FC<Props> = ({
  products,
  articleSlug,
  title = 'Tech Product Comparison Matrix',
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="my-10 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block">
            Side-By-Side Evaluation
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {title}
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {products.length} {products.length === 1 ? 'Product' : 'Products'} Compared
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
        <table className="w-full text-sm bg-white">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="px-5 py-4 min-w-[220px]">Product / Model</th>
              <th className="text-center px-4 py-4 min-w-[100px]">Tech Rating</th>
              <th className="px-5 py-4 min-w-[220px]">Best For</th>
              <th className="text-center px-4 py-4 min-w-[120px]">Stock Status</th>
              <th className="text-center px-4 py-4 min-w-[140px]">Direct Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product, idx) => {
              const redirectUrl = `/api/go/${product.slug}/${articleSlug ? `?article=${articleSlug}` : ''}`;
              const price = product.price ? parseFloat(String(product.price)) : null;
              const displayImg = product.display_image || product.image_url_fallback;
              const isTopPick = idx === 0 || product.is_featured;

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-blue-50/30 transition-colors ${isTopPick ? 'bg-blue-50/15' : ''}`}
                >
                  {/* Product Details */}
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-3.5">
                      {displayImg && (
                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={displayImg}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 leading-snug line-clamp-2">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {product.brand && (
                            <span className="text-xs text-slate-400 font-semibold">{product.brand}</span>
                          )}
                          {isTopPick && (
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider inline-flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> Top Pick
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-200/70 px-2 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900 text-xs">{product.rating}</span>
                    </div>
                    {product.review_count > 0 && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        {product.review_count.toLocaleString()} reviews
                      </div>
                    )}
                  </td>



                  {/* Best For */}
                  <td className="px-5 py-4">
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {product.short_description || 'Ideal for programmers and productive home office setups.'}
                    </p>
                  </td>

                  {/* Availability */}
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      product.availability === 'In Stock'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}>
                      {product.availability || 'In Stock'}
                    </span>
                  </td>

                  {/* CTA */}
                  <td className="px-4 py-4 text-center">
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="inline-flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer hover:shadow-xs"
                    >
                      <span>{product.cta_text || 'Check Price'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className="lg:hidden space-y-4">
        {products.map((product, idx) => {
          const redirectUrl = `/api/go/${product.slug}/${articleSlug ? `?article=${articleSlug}` : ''}`;
          const price = product.price ? parseFloat(String(product.price)) : null;
          const displayImg = product.display_image || product.image_url_fallback;
          const isTopPick = idx === 0 || product.is_featured;

          return (
            <div
              key={product.id}
              className={`bg-white border rounded-2xl p-5 space-y-4 shadow-2xs transition-all ${
                isTopPick ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {displayImg && (
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center">
                    <img
                      src={displayImg}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {product.brand && (
                      <span className="text-[11px] text-slate-400 font-semibold">{product.brand}</span>
                    )}
                    {isTopPick && (
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                        Top Pick
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5">
                    {product.name}
                  </h4>
                </div>
              </div>

              {product.short_description && (
                <p className="text-slate-600 text-xs leading-relaxed">
                  <strong className="text-slate-800">Best for: </strong>
                  {product.short_description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{product.rating}</span>
                  </div>

                </div>

                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="nofollow sponsored"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1"
                >
                  <span>{product.cta_text || 'Check Price'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
