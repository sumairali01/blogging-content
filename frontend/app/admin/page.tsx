'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShoppingBag, 
  MousePointerClick, 
  Layers, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Eye,
  Loader2
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { getAdminStats } from '@/lib/adminApi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load stats');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-slate-500 text-sm font-semibold">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
          <span>Loading Dashboard Metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Real-time performance, affiliate click monitoring, and content operations."
        actionButton={{
          label: 'Create Article',
          href: '/admin/posts/new',
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="px-6 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            label="Total Blog Posts"
            value={stats?.total_posts || 0}
            subValue={`${stats?.published_posts || 0} published · ${stats?.draft_posts || 0} drafts`}
            icon={FileText}
            color="emerald"
          />
          <StatsCard
            label="Affiliate Products"
            value={stats?.total_products || 0}
            subValue={`${stats?.featured_products || 0} top tested picks`}
            icon={ShoppingBag}
            color="blue"
          />
          <StatsCard
            label="Total Outbound Clicks"
            value={stats?.total_clicks || 0}
            subValue="Tracked via redirect engine"
            icon={MousePointerClick}
            color="purple"
          />
          <StatsCard
            label="Active Categories"
            value={stats?.total_categories || 0}
            subValue={`${stats?.total_tags || 0} topic tags`}
            icon={Layers}
            color="amber"
          />
        </div>

        {/* Two-Column Analytics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Click Stream (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <MousePointerClick className="w-5 h-5 text-emerald-700" />
                <h2 className="font-extrabold text-slate-900 text-base">
                  Live Affiliate Click Stream
                </h2>
              </div>
              <Link
                href="/admin/analytics"
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center space-x-1"
              >
                <span>View Full Log</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {(!stats?.recent_clicks || stats.recent_clicks.length === 0) ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No outbound affiliate clicks recorded yet.
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-slate-100">
                {stats.recent_clicks.map((click: any) => (
                  <div key={click.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-xs leading-snug">
                        {click.product_name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                        <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                          From: {click.article_title}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md block">
                        {new Date(click.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(click.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Top Products & Most Viewed Posts (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Products */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Most Clicked Products
                  </h3>
                </div>
                <Link href="/admin/products" className="text-[11px] font-bold text-emerald-700 hover:underline">
                  All Products
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.top_clicked_products?.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                        <img src={p.display_image} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="font-semibold text-slate-800 truncate">{p.name}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {p.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Viewed Posts */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-700" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Top Articles by Views
                  </h3>
                </div>
                <Link href="/admin/posts" className="text-[11px] font-bold text-emerald-700 hover:underline">
                  All Posts
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.top_viewed_posts?.map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-800 truncate">{post.title}</span>
                    <span className="text-slate-500 font-medium text-[11px] shrink-0">
                      {post.views} views
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
