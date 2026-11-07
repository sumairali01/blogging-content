'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, ExternalLink } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  breadcrumbs?: { label: string; href?: string }[];
}

export const AdminHeader: React.FC<Props> = ({
  title,
  subtitle,
  actionButton,
  breadcrumbs = [{ label: 'Admin', href: '/admin' }],
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        {/* Breadcrumb path */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-emerald-700 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold">{title}</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-xs sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {actionButton && (
        <div className="flex items-center space-x-3">
          <Link
            href={actionButton.href}
            className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-950/10 cursor-pointer"
          >
            {actionButton.icon || <Plus className="w-4 h-4" />}
            <span>{actionButton.label}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
