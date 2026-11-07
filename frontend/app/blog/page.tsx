import Link from 'next/link';
import type { Metadata } from 'next';
import { Layers, BookOpen, ArrowRight } from 'lucide-react';
import { getPosts, getCategories } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { Pagination } from '@/components/Pagination';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tech Buying Guides, Comparisons & Hardware Reviews',
  description: 'Explore independent tech buying guides, product comparisons, and hardware recommendations for software developers, students, and home office setups.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 12;

  const [postsRes, categoriesRes] = await Promise.all([
    getPosts({ page: currentPage }),
    getCategories(),
  ]);

  const posts = postsRes?.results || [];
  const totalCount = postsRes?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const categories = categoriesRes?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xs space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
          <span>Editorial Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Tech Buying Guides &amp; Product Comparisons
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Comprehensive hardware benchmarks, side-by-side spec comparisons, and buying recommendations designed specifically for developers, students, and home office users.
        </p>

        {/* Category Filters */}
        <div className="pt-4 flex flex-wrap gap-2 items-center">
          <Link
            href="/blog"
            className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs"
          >
            All Guides
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tech guides published yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Check back soon for new hardware evaluations and reviews.</p>
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
            basePath="/blog"
          />
        </div>
      )}
    </div>
  );
}
