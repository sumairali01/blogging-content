'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Layers, 
  BarChart3, 
  Settings, 
  LogOut, 
  Globe, 
  PlusCircle,
  Tag
} from 'lucide-react';
import { clearAdminSession, getAdminUser } from '@/lib/adminAuth';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = getAdminUser();

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Blog Posts', href: '/admin/posts', icon: FileText },
    { label: 'Affiliate Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Categories & Tags', href: '/admin/categories', icon: Layers },
    { label: 'Click Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
            SK
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight block">
              Admin<span className="text-emerald-400">Hub</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Affiliate Engine
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 border-b border-slate-800/80">
        <Link
          href="/admin/posts/new"
          className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm shadow-emerald-950"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Public Live Site */}
      <div className="px-4 py-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs text-slate-400 hover:text-emerald-400 transition-colors border border-slate-800"
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5" />
            <span className="font-medium">Live Website</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase">View ↗</span>
        </a>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center space-x-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 font-bold text-xs flex items-center justify-center shrink-0">
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-slate-200 block truncate">
              {user?.username || 'Admin'}
            </span>
            <span className="text-[10px] text-emerald-400 block font-medium">
              Administrator
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
