'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  HelpCircle, 
  ShoppingBag, 
  Image as ImageIcon, 
  Layers, 
  Tag as TagIcon, 
  Plus, 
  Trash2, 
  Loader2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { 
  getAdminCategories, 
  getAdminTags, 
  getAdminProducts, 
  createAdminPost, 
  updateAdminPost 
} from '@/lib/adminApi';
import { RichTextEditor } from './RichTextEditor';

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

export const PostEditor: React.FC<Props> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [postType, setPostType] = useState(initialData?.post_type || 'buying-guide');
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [category, setCategory] = useState<number | string>(initialData?.category || '');
  const [selectedTags, setSelectedTags] = useState<number[]>(
    initialData?.tags ? (Array.isArray(initialData.tags) && typeof initialData.tags[0] === 'object' ? initialData.tags.map((t: any) => t.id) : initialData.tags) : []
  );
  const [selectedProducts, setSelectedProducts] = useState<number[]>(
    initialData?.affiliate_products ? (Array.isArray(initialData.affiliate_products) && typeof initialData.affiliate_products[0] === 'object' ? initialData.affiliate_products.map((p: any) => p.id) : initialData.affiliate_products) : []
  );
  const [imageUrlFallback, setImageUrlFallback] = useState(initialData?.image_url_fallback || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '');

  // FAQs State: [{ question: '...', answer: '...' }]
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    initialData?.faqs || []
  );

  useEffect(() => {
    Promise.all([
      getAdminCategories(),
      getAdminTags(),
      getAdminProducts({ page: 1 }),
    ]).then(([cats, tagList, prods]) => {
      setCategories(cats.results || cats || []);
      setTags(tagList.results || tagList || []);
      setAvailableProducts(prods.results || prods || []);
    }).catch(console.error);
  }, []);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleFaqChange = (idx: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[idx][field] = value;
    setFaqs(updated);
  };

  const handleProductToggle = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title,
      slug: slug.trim() || undefined,
      excerpt,
      content,
      post_type: postType,
      status,
      category: category ? Number(category) : null,
      tags: selectedTags,
      affiliate_products: selectedProducts,
      image_url_fallback: imageUrlFallback,
      is_featured: isFeatured,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt,
      faqs,
    };

    try {
      if (isEdit) {
        await updateAdminPost(initialData.id, payload);
      } else {
        await createAdminPost(payload);
      }
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to save post.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto px-6 py-6 pb-20">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/admin/posts"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEdit ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Columns: Main Article Fields */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Title */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 7 Best Mechanical Keyboards for Coding & Developers (2026)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">
                URL Slug (leave blank to auto-generate from title)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. best-mechanical-keyboards-for-coding"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Excerpt / Hook Summary
            </label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short introduction displayed in cards and top of article..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Main Content */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Article Body Content *
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Visual WYSIWYG Editor with Live Preview</span>
            </div>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your article content here... Use toolbar above for Headings, Bold, Lists, Links."
            />
          </div>

          {/* Interactive FAQs Builder */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Frequently Asked Questions (FAQ Schema)</h3>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No FAQs added yet. Click &quot;Add FAQ&quot; to include rich FAQ structured data.</p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Question: e.g. How much counter space do I need?"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer: e.g. Most mini coffee makers require only 5 inches of width..."
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 4 Columns: Side Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Type */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Publishing Options
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 block">Post Type</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800"
              >
                <option value="buying-guide">Buying Guide</option>
                <option value="review">Product Review</option>
                <option value="comparison">Product Comparison</option>
                <option value="best-list">Best Products List</option>
                <option value="informational">Informational Article</option>
              </select>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="is_featured" className="text-xs font-bold text-slate-800 cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Category</span>
            </h3>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800"
            >
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Featured Image URL</span>
            </h3>

            <input
              type="url"
              value={imageUrlFallback}
              onChange={(e) => setImageUrlFallback(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700"
            />
            {imageUrlFallback && (
              <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={imageUrlFallback} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* In-Post Affiliate Products Multi-picker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Featured Affiliate Products</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Select products to automatically render comparison tables and review cards in this post.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {availableProducts.map((prod) => {
                const isChecked = selectedProducts.includes(prod.id);
                return (
                  <label
                    key={prod.id}
                    className={`flex items-center space-x-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleProductToggle(prod.id)}
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="truncate">{prod.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <TagIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Topic Tags</span>
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              SEO Metadata
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Google search title..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Meta Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Google search snippet..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
};
