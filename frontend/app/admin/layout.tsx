'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { isAuthenticatedAdmin, getAdminToken, clearAdminSession } from '@/lib/adminAuth';
import { adminVerifyMe } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    if (!isAuthenticatedAdmin()) {
      router.push('/admin/login');
      return;
    }

    // Verify token with backend
    adminVerifyMe()
      .then(() => {
        setIsAuthorized(true);
        setLoading(false);
      })
      .catch(() => {
        clearAdminSession();
        router.push('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  // Login page layout without sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 flex flex-col justify-center">{children}</div>;
  }

  // Loading spinner during auth check
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-3 text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-wider">Verifying Admin Access...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
