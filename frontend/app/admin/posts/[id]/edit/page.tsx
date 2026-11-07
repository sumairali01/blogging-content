'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PostEditor } from '@/components/admin/PostEditor';
import { getAdminPostById } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getAdminPostById(id)
        .then((data) => {
          setPost(data);
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
        <span>Loading article details...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center text-slate-500 font-semibold">
        Article not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit Article: ${post.title}`}
        subtitle="Update content, change affiliate product links, or revise SEO metadata."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Posts', href: '/admin/posts' },
        ]}
      />
      <PostEditor initialData={post} isEdit={true} />
    </div>
  );
}
