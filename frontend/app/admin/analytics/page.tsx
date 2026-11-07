'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  MousePointerClick, 
  Search, 
  Calendar, 
  Smartphone, 
  Globe, 
  Loader2, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAdminAnalytics } from '@/lib/adminApi';

export default function AdminAnalyticsPage() {
  const [clicks, setClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchClicks = (pageNum = 1) => {
    setLoading(true);
    getAdminAnalytics(pageNum)
      .then((data) => {
        setClicks(data.results || data || []);
        setTotalCount(data.count || (data.results ? data.results.length : data.length) || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClicks(page);
  }, [page]);

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Affiliate Click Tracker"
        subtitle={`Live audit log of all ${totalCount} outbound clicks to merchant stores.`}
      />

      <div className="px-6 space-y-4">
        
        {/* Analytics Summary Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest block">
              Conversion &amp; Attribution Engine
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">
              Tracking Outbound Monetization Clicks
            </h2>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              Every click through <code>/api/go/&lt;slug&gt;/</code> is logged securely with the originating article and timestamp before redirecting the customer to Amazon, Target, or Walmart.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 text-center shrink-0">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Recorded Clicks</span>
            <span className="text-3xl font-black text-emerald-400">{totalCount}</span>
          </div>
        </div>

        {/* Click Log Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Recent Click Events
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center flex items-center justify-center space-x-2 text-slate-400 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
              <span>Loading click history...</span>
            </div>
          ) : clicks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <MousePointerClick className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No click events recorded yet.</p>
              <p className="text-xs text-slate-400">Click &quot;Check Price&quot; on any blog post to test the tracking redirect.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Product Clicked</th>
                    <th className="py-3.5 px-4">Originating Article</th>
                    <th className="py-3.5 px-4">User Agent / Device</th>
                    <th className="py-3.5 px-4">Client IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {clicks.map((click) => (
                    <tr key={click.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">
                            {new Date(click.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {new Date(click.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {click.product_name}
                        </div>
                        {click.product_slug && (
                          <span className="text-[10px] text-emerald-700 font-mono">
                            /products/{click.product_slug}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {click.article_slug ? (
                          <Link
                            href={`/blog/${click.article_slug}`}
                            target="_blank"
                            className="text-slate-800 hover:text-emerald-700 hover:underline font-semibold block truncate"
                          >
                            {click.article_title}
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">{click.article_title || 'Direct / Storefront'}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-500 font-mono">
                        {click.user_agent || 'Standard Web Browser'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] font-mono text-slate-500">
                        {click.ip_address || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
