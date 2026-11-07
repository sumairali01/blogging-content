import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryBySlug, getPosts, getSitemapData } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { Pagination } from '@/components/Pagination';

export const revalidate = 60; // ISR

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const data = await getSitemapData();
  return (data.categories || []).map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: category.meta_title || `${category.name} Tech Buying Guides & Reviews`,
    description: category.meta_description || category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 12;

  const [category, postsRes] = await Promise.all([
    getCategoryBySlug(slug),
    getPosts({ category: slug, page: currentPage }),
  ]);

  if (!category) {
    notFound();
  }

  const posts = postsRes?.results || [];
  const totalCount = postsRes?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xs space-y-4">
        <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-wider block">
          Category Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-3xl leading-relaxed">
            {category.description}
          </p>
        )}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Showing {posts.length} of {totalCount} {totalCount === 1 ? 'guide' : 'guides'}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
          No articles found in this category yet.
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
            basePath={`/blog/category/${slug}`}
          />
        </div>
      )}
    </div>
  );
}
