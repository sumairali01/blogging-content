'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductEditor } from '@/components/admin/ProductEditor';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Add Affiliate Product"
        subtitle="Add a new product with affiliate link, pros/cons, rating, and merchant."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
        ]}
      />
      <ProductEditor isEdit={false} />
    </div>
  );
}
