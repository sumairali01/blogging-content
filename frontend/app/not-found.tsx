import Link from 'next/link';
import { Home, BookOpen, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-lg">
        {/* Big 404 */}
        <div className="text-[120px] sm:text-[150px] font-black text-slate-200 leading-none select-none tracking-tight">
          404
        </div>

        <div className="space-y-3 -mt-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Guide Not Found
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            The tech buying guide, comparison, or category you&apos;re looking for doesn&apos;t exist or may have been updated.
          </p>
        </div>

        {/* Helpful actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore All Guides</span>
          </Link>
        </div>

        {/* Tech suggestion tags */}
        <div className="pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-3">Popular Tech Topics</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Programming Monitors', 'Mechanical Keyboards', 'Student Laptops', 'USB-C Docks', 'Desk Accessories'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
