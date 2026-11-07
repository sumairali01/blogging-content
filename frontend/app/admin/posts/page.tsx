'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Layers, 
  Clock, 
  Filter, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAdminPosts, deleteAdminPost } from '@/lib/adminApi';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchPosts = () => {
    setLoading(true);
    getAdminPosts({ search, status: statusFilter, page })
      .then((data) => {
        setPosts(data.results || []);
        setTotalCount(data.count || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [search, statusFilter, page]);

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminPost(id);
      setDeleteConfirm(null);
      fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Blog Articles"
        subtitle={`Manage all ${totalCount} articles, draft buying guides, and reviews.`}
        actionButton={{
          label: 'Create New Article',
          href: '/admin/posts/new',
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="px-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title, excerpt..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center flex items-center justify-center space-x-2 text-slate-400 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
              <span>Loading articles...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No articles found matching criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4">Published</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3 max-w-sm sm:max-w-md">
                          {post.display_image && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img src={post.display_image} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="truncate">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors block truncate"
                            >
                              {post.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 font-normal truncate block">
                              /blog/{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {post.category_detail?.name ? (
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-[11px] font-semibold">
                            {post.category_detail.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Uncategorized</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="capitalize text-slate-600 font-semibold">
                          {post.post_type?.replace('-', ' ') || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : post.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                        {post.views}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Draft'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          title="View on live site"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg inline-block transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          title="Edit article"
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg inline-block transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          title="Delete article"
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg inline-block transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <h3 className="font-extrabold text-slate-900 text-base">Delete Article?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
