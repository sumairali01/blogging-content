import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, ShieldCheck } from 'lucide-react';
import { getPosts } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Author {
  id: number;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string;
  website: string;
  social_links: Record<string, string>;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAuthor(slug: string): Promise<Author | null> {
  try {
    const res = await fetch(`${API_BASE}/authors/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: 'Author Not Found' };
  return {
    title: `${author.name} — Tech Reviewer & Buying Guide Author`,
    description: author.bio || `Read all hardware reviews and buying guides by ${author.name} at TechGear Guide.`,
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const [author, postsRes] = await Promise.all([
    getAuthor(slug),
    getPosts({ author: slug }),
  ]);

  if (!author) notFound();

  const posts = postsRes?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Author Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xs flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        {/* Avatar */}
        <div className="shrink-0">
          {author.profile_image ? (
            <img
              src={author.profile_image}
              alt={author.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900/60 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-slate-900 dark:bg-blue-600 text-white text-4xl font-black flex items-center justify-center shadow-md">
              {author.name[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <span className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">Staff Tech Reviewer</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {author.name}
            </h1>
          </div>

          {author.bio && (
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl">{author.bio}</p>
          )}

          {/* Social & Website Links */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:border-blue-300 dark:hover:border-blue-800 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-full transition-colors font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
            {author.social_links?.twitter && (
              <a
                href={author.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white px-4 py-2 rounded-full transition-colors font-medium"
              >
                <span>𝕏 Twitter</span>
              </a>
            )}
            {author.social_links?.github && (
              <a
                href={author.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white px-4 py-2 rounded-full transition-colors font-medium"
              >
                <span>GitHub</span>
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
            {posts.length} {posts.length === 1 ? 'guide' : 'guides'} published
          </p>
        </div>
      </div>

      {/* Articles by Author */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          Hardware Reviews &amp; Guides by {author.name}
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400">
            No published articles yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
