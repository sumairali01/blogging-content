'use client';

import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  Tag as TagIcon, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { 
  getAdminCategories, 
  createAdminCategory, 
  deleteAdminCategory,
  getAdminTags,
  createAdminTag,
  deleteAdminTag
} from '@/lib/adminApi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catLoading, setCatLoading] = useState(false);

  // New Tag State
  const [tagName, setTagName] = useState('');
  const [tagSlug, setTagSlug] = useState('');
  const [tagLoading, setTagLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getAdminCategories(),
      getAdminTags(),
    ]).then(([cats, tagList]) => {
      setCategories(cats.results || cats || []);
      setTags(tagList.results || tagList || []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setCatLoading(true);
    try {
      await createAdminCategory({
        name: catName.trim(),
        slug: catSlug.trim() || undefined,
        description: catDesc.trim(),
      });
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteAdminCategory(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    setTagLoading(true);
    try {
      await createAdminTag({
        name: tagName.trim(),
        slug: tagSlug.trim() || undefined,
      });
      setTagName('');
      setTagSlug('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create tag');
    } finally {
      setTagLoading(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    try {
      await deleteAdminTag(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete tag');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Categories &amp; Tags"
        subtitle="Organize tech topics, hardware categories, and editorial taxonomy."
      />

      <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Categories (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add Category Form */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">Add New Category</h2>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mechanical Keyboards"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. mechanical-keyboards"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <input
                  type="text"
                  placeholder="Short description for archive SEO..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={catLoading}
                className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {catLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Category</span>
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Existing Categories ({categories.length})
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span>Loading categories...</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{cat.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
                          {cat.post_count || 0} articles
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">/blog/category/{cat.slug}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Link
                        href={`/blog/category/${cat.slug}`}
                        target="_blank"
                        className="p-1 text-slate-400 hover:text-emerald-700"
                        title="View live archive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Tags (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add Tag Form */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <TagIcon className="w-4 h-4 text-emerald-700" />
              <h2 className="font-extrabold text-slate-900 text-sm">Add New Topic Tag</h2>
            </div>

            <form onSubmit={handleCreateTag} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Tag Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. air-fryers"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. air-fryers"
                  value={tagSlug}
                  onChange={(e) => setTagSlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={tagLoading}
                className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {tagLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Tag</span>
              </button>
            </form>
          </div>

          {/* Tags Cloud / List */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block border-b border-slate-100 pb-2">
              Existing Tags ({tags.length})
            </span>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold group hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
                >
                  <span>#{tag.name}</span>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                    title="Delete tag"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
