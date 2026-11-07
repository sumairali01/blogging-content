'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Star, 
  ShoppingBag, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Tag
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAdminProducts, deleteAdminProduct } from '@/lib/adminApi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    getAdminProducts({ search, page })
      .then((data) => {
        setProducts(data.results || []);
        setTotalCount(data.count || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminProduct(id);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Affiliate Products"
        subtitle={`Manage all ${totalCount} database-stored affiliate products, merchants, and affiliate tracking links.`}
        actionButton={{
          label: 'Add New Product',
          href: '/admin/products/new',
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="px-6 space-y-4">
        {/* Search Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by product name, brand..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center flex items-center justify-center space-x-2 text-slate-400 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
              <span>Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No products found matching criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Brand / Merchant</th>
                    <th className="py-3.5 px-4">Price (USD)</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Affiliate Destination</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3 max-w-xs sm:max-w-sm">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 shrink-0 border border-slate-200 flex items-center justify-center">
                            <img src={product.display_image} alt="" className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="truncate">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors block truncate"
                            >
                              {product.name}
                            </Link>
                            {product.is_featured && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-extrabold uppercase mt-0.5 inline-block">
                                Top Pick
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{product.brand || '—'}</span>
                          <span className="text-[11px] text-slate-400 block">{product.merchant_detail?.name || 'Direct'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-slate-900 text-sm">
                        {product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'Check Price'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 font-bold text-slate-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({product.review_count})</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate">
                        <a
                          href={product.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline text-[11px] font-mono truncate block"
                        >
                          {product.affiliate_url}
                        </a>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                        <a
                          href={`/api/go/${product.slug}/`}
                          target="_blank"
                          title="Test affiliate redirect tracking"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg inline-block transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          title="Edit product"
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg inline-block transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          title="Delete product"
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
              <h3 className="font-extrabold text-slate-900 text-base">Delete Product?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this affiliate product from the database?
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
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
