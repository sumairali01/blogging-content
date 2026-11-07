import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  basePath,
  queryParams = {},
}) => {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(queryParams);
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-2 py-8" aria-label="Pagination Navigation">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors shadow-xs"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 text-sm font-semibold cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return isCurrent ? (
            <span
              key={p}
              className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs"
              aria-current="page"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p)}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm flex items-center justify-center transition-colors shadow-xs"
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors shadow-xs"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 text-sm font-semibold cursor-not-allowed">
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
};
