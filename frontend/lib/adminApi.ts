import { getAdminToken, clearAdminSession } from './adminAuth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (res.status === 401 || res.status === 403) {
    clearAdminSession();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error('Authentication expired. Please log in again.');
  }

  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const errJson = await res.json();
      errMsg = errJson.detail || errJson.error || JSON.stringify(errJson);
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  // Check if response has content (e.g. 204 No Content for DELETE)
  if (res.status === 204) {
    return {} as T;
  }

  return await res.json();
}

// ── Auth APIs ──
export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed. Please check credentials.');
  }
  return data;
}

export async function adminVerifyMe() {
  return adminFetch<{ user: any }>('/auth/me/');
}

// ── Stats API ──
export async function getAdminStats() {
  return adminFetch<any>('/admin/stats/');
}

// ── Blog Posts APIs ──
export async function getAdminPosts(params: { search?: string; status?: string; page?: number } = {}) {
  const q = new URLSearchParams();
  if (params.search) q.append('search', params.search);
  if (params.status) q.append('status', params.status);
  if (params.page) q.append('page', params.page.toString());
  const qs = q.toString() ? `?${q.toString()}` : '';
  return adminFetch<any>(`/admin/posts/${qs}`);
}

export async function getAdminPostById(id: number | string) {
  return adminFetch<any>(`/admin/posts/${id}/`);
}

export async function createAdminPost(data: any) {
  return adminFetch<any>('/admin/posts/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminPost(id: number | string, data: any) {
  return adminFetch<any>(`/admin/posts/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminPost(id: number | string) {
  return adminFetch<any>(`/admin/posts/${id}/`, {
    method: 'DELETE',
  });
}

// ── Products APIs ──
export async function getAdminProducts(params: { search?: string; category?: string; page?: number } = {}) {
  const q = new URLSearchParams();
  if (params.search) q.append('search', params.search);
  if (params.category) q.append('category__slug', params.category);
  if (params.page) q.append('page', params.page.toString());
  const qs = q.toString() ? `?${q.toString()}` : '';
  return adminFetch<any>(`/admin/products/${qs}`);
}

export async function getAdminProductById(id: number | string) {
  return adminFetch<any>(`/admin/products/${id}/`);
}

export async function createAdminProduct(data: any) {
  return adminFetch<any>('/admin/products/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminProduct(id: number | string, data: any) {
  return adminFetch<any>(`/admin/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProduct(id: number | string) {
  return adminFetch<any>(`/admin/products/${id}/`, {
    method: 'DELETE',
  });
}

// ── Categories & Tags APIs ──
export async function getAdminCategories() {
  return adminFetch<any>('/admin/categories/');
}

export async function createAdminCategory(data: any) {
  return adminFetch<any>('/admin/categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminCategory(id: number | string) {
  return adminFetch<any>(`/admin/categories/${id}/`, {
    method: 'DELETE',
  });
}

export async function getAdminTags() {
  return adminFetch<any>('/admin/tags/');
}

export async function createAdminTag(data: any) {
  return adminFetch<any>('/admin/tags/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminTag(id: number | string) {
  return adminFetch<any>(`/admin/tags/${id}/`, {
    method: 'DELETE',
  });
}

export async function getAdminMerchants() {
  return adminFetch<any>('/admin/merchants/');
}

export async function createAdminMerchant(data: any) {
  return adminFetch<any>('/admin/merchants/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Analytics / Clicks API ──
export async function getAdminAnalytics(page = 1) {
  return adminFetch<any>(`/admin/analytics/?page=${page}`);
}

// ── Site Settings API ──
export async function getAdminSettings() {
  return adminFetch<any>('/admin/settings/');
}

export async function updateAdminSettings(data: any) {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return adminFetch<any>('/admin/settings/', {
    method: 'PUT',
    body: isFormData ? data : JSON.stringify(data),
  });
}
