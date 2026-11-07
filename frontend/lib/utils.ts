/**
 * Returns the public base URL of this website.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL environment variable  (set in .env.local or hosting panel)
 *  2. Fallback to localhost for local development
 *
 * Rule: NO trailing slash.
 *
 * Usage:
 *   import { getBaseUrl } from '@/lib/utils';
 *   const url = `${getBaseUrl()}/blog/${slug}`;
 */
export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Strip trailing slash so callers can safely append /path
  return raw.replace(/\/$/, '');
}
