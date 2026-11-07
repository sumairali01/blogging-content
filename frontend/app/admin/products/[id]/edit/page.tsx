'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductEditor } from '@/components/admin/ProductEditor';
import { getAdminProductById } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getAdminProductById(id)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center space-x-2 text-slate-400 text-xs font-semibold">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-slate-500 font-semibold">
        Product not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit Product: ${product.name}`}
        subtitle="Update affiliate URL, price, rating, or pros & cons."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
        ]}
      />
      <ProductEditor initialData={product} isEdit={true} />
    </div>
  );
}
