import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCMSPage, getSitemapData } from '@/lib/api';

export const revalidate = 60; // ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const data = await getSitemapData();
  return (data.pages || []).map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCMSPage(slug);
  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
  };
}

export default async function GenericCMSPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCMSPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {page.title}
        </h1>
      </div>

      <div
        className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-black prose-a:text-blue-600 dark:prose-a:text-blue-400 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </article>
  );
}
