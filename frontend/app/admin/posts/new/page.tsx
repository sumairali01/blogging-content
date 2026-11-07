'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PostEditor } from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Create New Article"
        subtitle="Write a new buying guide, product comparison, or tech review."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Posts', href: '/admin/posts' },
        ]}
      />
      <PostEditor isEdit={false} />
    </div>
  );
}
