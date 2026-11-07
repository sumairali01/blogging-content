'use client';

import React, { useState } from 'react';
import { ListOrdered, ChevronDown, ChevronUp } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
  badge?: string;
}

interface Props {
  items: TocItem[];
}

export const TableOfContents: React.FC<Props> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Table of contents"
      className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ListOrdered className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            In This Guide
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          <span>{isOpen ? 'Hide' : 'Show'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-1 text-xs sm:text-sm">
          {items.map((item, idx) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800/80 transition-all font-medium group"
              >
                <span className="w-5 h-5 rounded-full bg-slate-200/80 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-slate-600 dark:text-slate-400 font-bold text-[11px] flex items-center justify-center shrink-0 transition-colors">
                  {idx + 1}
                </span>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] uppercase font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded ml-auto shrink-0">
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};
