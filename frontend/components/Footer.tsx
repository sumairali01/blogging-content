import React from 'react';
import Link from 'next/link';
import { SiteSetting, Category } from '@/types';

interface Props {
  settings?: SiteSetting | null;
  categories?: Category[];
}

export const Footer: React.FC<Props> = ({ settings }) => {
  const siteName = settings?.site_name || 'TechExpert';
  const footerYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* Left: Brand + Copyright */}
          <div className="space-y-2 max-w-xs">
            <Link href="/" className="inline-block">
              <span className="font-black text-xl text-slate-950 dark:text-white tracking-tight">
                {siteName}
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {settings?.footer_text || `© ${footerYear} ${siteName}. All rights reserved.`}
            </p>
            {settings?.affiliate_disclosure_default && (
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                {settings.affiliate_disclosure_default}
              </p>
            )}
            {!settings?.affiliate_disclosure_default && (
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Affiliate Disclosure: We may earn a commission when you buy through links on our site.
              </p>
            )}
          </div>

          {/* Right: Links Grid */}
          <div className="flex gap-16 sm:gap-20">
            {/* Col 1 */}
            <div className="space-y-3">
              <Link
                href="/blog"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                Guides
              </Link>
              <Link
                href="/products"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                Reviews
              </Link>
              <Link
                href="/about"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                About
              </Link>
            </div>
            {/* Col 2 */}
            <div className="space-y-3">
              <Link
                href="/contact"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                Contact
              </Link>
              <Link
                href="/newsletter"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                Newsletter
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
