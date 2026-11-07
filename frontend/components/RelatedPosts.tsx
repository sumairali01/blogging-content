import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';

interface Props {
  posts: BlogPost[];
  title?: string;
}

export const RelatedPosts: React.FC<Props> = ({ posts, title = 'Related Tech Guides & Comparisons' }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="my-10 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <Link href="/blog" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
          <span>All Guides</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.slice(0, 4).map((post) => {
          const displayImg = post.display_image || post.image_url_fallback;
          const publishedDate = post.published_at
            ? new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })
            : '';

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex items-start space-x-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail */}
              {displayImg && (
                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <img
                    src={displayImg}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1">
                {post.category && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {post.category.name}
                  </span>
                )}
                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
                  {publishedDate && <span>{publishedDate}</span>}
                  <span>·</span>
                  <span>{post.reading_time || 5} min read</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
