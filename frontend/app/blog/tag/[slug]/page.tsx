import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Tag as TagIcon } from 'lucide-react';
import { getPosts } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { Pagination } from '@/components/Pagination';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface TagType {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTag(slug: string): Promise<TagType | null> {
  try {
    const res = await fetch(`${API_BASE}/tags/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) return { title: 'Tag Not Found' };
  return {
    title: `#${tag.name} Tech Articles & Buying Guides`,
    description: `Browse all articles tagged with "${tag.name}" — independent hardware comparisons, tech reviews, and buying guides.`,
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 12;

  const [tag, postsRes] = await Promise.all([
    getTag(slug),
    getPosts({ tag: slug, page: currentPage }),
  ]);

  if (!tag) notFound();

  const posts = postsRes?.results || [];
  const totalCount = postsRes?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Tag Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xs flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center shrink-0">
          <TagIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <span className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider block">Tag Archive</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            #{tag.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
            Showing {posts.length} of {totalCount} {totalCount === 1 ? 'guide' : 'guides'} found
          </p>
        </div>
      </div>

      {/* Articles */}
      {posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
          No articles found with this tag yet.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/blog/tag/${slug}`}
          />
        </div>
      )}
    </div>
  );
}
