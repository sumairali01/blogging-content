import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSiteSettings, getCategories } from '@/lib/api';
import { getBaseUrl } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getBaseUrl();

  const defaultTitle = settings?.default_meta_title || 'TechGear Guide | Tech Buying Guides for Students, Developers & Home Office';
  const defaultDesc = settings?.default_meta_description || 'Independent tech buying guides, side-by-side product comparisons, and curated gear recommendations for developers, students, and home office setups.';
  const siteName = settings?.site_name || 'TechGear Guide';

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description: defaultDesc,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: siteName,
      images: [
        {
          url: `${siteUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: settings?.social_links?.twitter || '@techgearguide',
    },
    other: {
      'p:domain_verify': settings?.analytics_ids?.pinterest_verify || '',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const categoriesRes = await getCategories();
  const categories = categoriesRes?.results || [];

  // Extract GA4 ID from site settings
  const gaId = settings?.analytics_ids?.ga_id || '';

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="application-name" content={settings?.site_name || 'TechGear Guide'} />
        {/* Anti-flash theme init script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
        <ThemeProvider>
          {/* Google Analytics */}
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `}
              </Script>
            </>
          )}

          <Header initialCategories={categories} initialSettings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} categories={categories} />
        </ThemeProvider>
      </body>
    </html>
  );
}
