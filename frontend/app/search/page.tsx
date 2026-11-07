import Link from 'next/link';
import { Search as SearchIcon, Cpu, BookOpen, Layers } from 'lucide-react';
import { getPosts, getProducts, getCategories } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { ProductCard } from '@/components/ProductCard';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || '';

  const [postsRes, productsRes, categoriesRes] = query
    ? await Promise.all([
        getPosts({ search: query }),
        getProducts({ search: query }),
        getCategories(),
      ])
    : [null, null, null];

  const posts = postsRes?.results || [];
  const products = productsRes?.results || [];
  const allCategories = categoriesRes?.results || [];
  const matchedCategories = allCategories.filter(cat => 
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xs space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          <SearchIcon className="w-3.5 h-3.5" />
          <span>Tech Search</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Search Results {query && <span className="text-blue-600 dark:text-blue-400">for &ldquo;{query}&rdquo;</span>}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Found {posts.length} buying guides and {products.length} tested hardware recommendations.
        </p>
      </div>

      {!query ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
          <SearchIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-bold text-slate-800 dark:text-slate-200">Please enter a keyword to search hardware, comparisons, and buying guides.</p>
          <p className="text-xs">Examples: <span className="font-bold text-blue-600 dark:text-blue-400">Mechanical Keyboards</span>, <span className="font-bold text-blue-600 dark:text-blue-400">4K Monitors</span>, <span className="font-bold text-blue-600 dark:text-blue-400">Coding Laptops</span></p>
        </div>
      ) : posts.length === 0 && products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
          <p className="text-lg font-black text-slate-900 dark:text-white">No matching tech guides found for &ldquo;{query}&rdquo;.</p>
          <p className="text-sm">Try searching for broader keywords like <span className="font-bold text-blue-600 dark:text-blue-400">monitors</span>, <span className="font-bold text-blue-600 dark:text-blue-400">keyboards</span>, <span className="font-bold text-blue-600 dark:text-blue-400">laptops</span>, or <span className="font-bold text-blue-600 dark:text-blue-400">docks</span>.</p>
        </div>
      ) : (
        <>
          {/* Matched Categories */}
          {matchedCategories.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Matching Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs px-4 py-2 rounded-xl transition-colors border border-blue-200 dark:border-blue-800/60"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Article Results */}
          {posts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <span>Matching Tech Buying Guides</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{posts.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          {products.length > 0 && (
            <div className="space-y-6 pt-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <span>Matching Tested Hardware</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{products.length}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} variant="grid" />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
