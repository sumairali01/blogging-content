'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ArrowLeft, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon, 
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';
import { 
  getAdminCategories, 
  getAdminMerchants, 
  createAdminProduct, 
  updateAdminProduct 
} from '@/lib/adminApi';

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

export const ProductEditor: React.FC<Props> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliate_url || '');
  const [merchant, setMerchant] = useState<number | string>(initialData?.merchant || '');
  const [category, setCategory] = useState<number | string>(initialData?.category || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [rating, setRating] = useState(initialData?.rating || '4.8');
  const [reviewCount, setReviewCount] = useState(initialData?.review_count || 120);
  const [availability, setAvailability] = useState(initialData?.availability || 'In Stock');
  const [ctaText, setCtaText] = useState(initialData?.cta_text || 'Check Price');
  const [badge, setBadge] = useState(initialData?.badge || '');
  const [reviewUrl, setReviewUrl] = useState(initialData?.review_url || '');
  const [imageUrlFallback, setImageUrlFallback] = useState(initialData?.image_url_fallback || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);

  // Pros & Cons lists
  const [pros, setPros] = useState<string[]>(initialData?.pros || ['']);
  const [cons, setCons] = useState<string[]>(initialData?.cons || ['']);

  useEffect(() => {
    Promise.all([
      getAdminCategories(),
      getAdminMerchants(),
    ]).then(([cats, merchs]) => {
      setCategories(cats.results || cats || []);
      setMerchants(merchs.results || merchs || []);
    }).catch(console.error);
  }, []);

  const handleAddPro = () => setPros([...pros, '']);
  const handleRemovePro = (idx: number) => setPros(pros.filter((_, i) => i !== idx));
  const handleProChange = (idx: number, val: string) => {
    const updated = [...pros];
    updated[idx] = val;
    setPros(updated);
  };

  const handleAddCon = () => setCons([...cons, '']);
  const handleRemoveCon = (idx: number) => setCons(cons.filter((_, i) => i !== idx));
  const handleConChange = (idx: number, val: string) => {
    const updated = [...cons];
    updated[idx] = val;
    setCons(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name,
      slug: slug.trim() || undefined,
      brand,
      short_description: shortDescription,
      description,
      affiliate_url: affiliateUrl.trim(),
      merchant: merchant ? Number(merchant) : null,
      category: category ? Number(category) : null,
      price: price ? Number(price) : null,
      currency: 'USD',
      rating: Number(rating),
      review_count: Number(reviewCount),
      availability,
      cta_text: ctaText,
      badge: badge.trim(),
      review_url: reviewUrl.trim(),
      image_url_fallback: imageUrlFallback,
      is_featured: isFeatured,
      pros: pros.filter((p) => p.trim()),
      cons: cons.filter((c) => c.trim()),
    };

    try {
      if (isEdit) {
        await updateAdminProduct(initialData.id, payload);
      } else {
        await createAdminProduct(payload);
      }
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save affiliate product.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto px-6 py-6 pb-20">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEdit ? 'Update Product' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Main Product Specs & Pros/Cons */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Name & Slug */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nespresso Vertuo Pop+ Deluxe Coffee & Espresso Maker"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Nespresso"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Primary Affiliate Tracking URL (Core Feature) */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 block flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Primary Affiliate Link (Amazon, CJ, Impact, etc.) *</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Stored in DB
              </span>
            </div>
            <input
              type="url"
              required
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/B0BSM1N6GZ?tag=your-affiliate-tag-20"
              className="w-full bg-white border border-emerald-300 rounded-xl py-2.5 px-3.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
            />
            <p className="text-[11px] text-slate-500">
              When updated here, every blog post and comparison table linking to this product will instantly update automatically.
            </p>
          </div>

          {/* Custom Review Article URL */}
          {/* Custom Review Article URL & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block flex items-center space-x-1.5">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>&quot;Read Full Review&quot; Link (Optional)</span>
              </label>
              <input
                type="text"
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                placeholder="e.g. /blog/best-laptops-for-students"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400">
                Defaults to /products/{slug || 'slug'}.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Product Badge Label (Optional)</span>
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Top Pick, Best Value, Editor's Choice"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400">
                Leave blank if no badge is needed (no emojis added).
              </p>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Short Description (Cards &amp; Tables)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Compact 8.6-inch width with 5 cup size options..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Full Review Details
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed testing notes on performance, durability, and footprint..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Pros & Cons Visual List Builders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Pros */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Pros (Why It Wins)</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddPro}
                  className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  + Add Pro
                </button>
              </div>

              <div className="space-y-2">
                {pros.map((pro, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Only 8.6 inches wide"
                      value={pro}
                      onChange={(e) => handleProChange(idx, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePro(idx)}
                      className="text-slate-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Cons (Drawbacks)</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddCon}
                  className="text-xs font-bold text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  + Add Con
                </button>
              </div>

              <div className="space-y-2">
                {cons.map((con, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Smaller water tank capacity"
                      value={con}
                      onChange={(e) => handleConChange(idx, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCon(idx)}
                      className="text-slate-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Cols: Commercial & Media Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Price, Rating & Merchant */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Commercial Info
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 block">Retail Merchant</label>
              <select
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800"
              >
                <option value="">Direct / Other Merchant</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="129.99"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Rating (0 - 5)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  min="0"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="4.8"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Review Count</label>
                <input
                  type="number"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  placeholder="1250"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Button CTA</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Check Price"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured_product"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="is_featured_product" className="text-xs font-bold text-slate-800 cursor-pointer">
                Top Pick / Editor Choice
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Category
            </h3>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800"
            >
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Product Image URL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Product Image URL</span>
            </h3>

            <input
              type="url"
              value={imageUrlFallback}
              onChange={(e) => setImageUrlFallback(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700"
            />
            {imageUrlFallback && (
              <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
                <img src={imageUrlFallback} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
};
