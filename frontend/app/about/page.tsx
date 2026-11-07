import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/api';
import { Users, Search, FlaskConical, CheckSquare, Upload, ShieldCheck, BarChart2, RefreshCw } from 'lucide-react';

const researchSteps = [
  {
    number: '1.',
    label: 'Selection',
    icon: <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
    description:
      'We identify the most relevant products based on market trends and reader requests.',
  },
  {
    number: '2.',
    label: 'Lab Testing',
    icon: <FlaskConical className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
    description:
      'Products undergo rigorous benchmark testing in our controlled lab environments.',
  },
  {
    number: '3.',
    label: 'Field Testing',
    icon: <CheckSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
    description:
      'Reviewers use the products in real-world scenarios for weeks or months.',
  },
  {
    number: '4.',
    label: 'Publication',
    icon: <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
    description:
      'Data is analyzed, synthesized, and published with clear, actionable advice.',
  },
];

const editorialPrinciples = [
  {
    icon: <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
    title: 'Independence',
    description: 'Our reviews are never influenced by manufacturers or advertisers.',
  },
  {
    icon: <BarChart2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
    title: 'Objectivity',
    description: 'We rely on empirical data and standardized testing methodologies.',
  },
  {
    icon: <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
    title: 'Currency',
    description: 'Guides are regularly updated to reflect new products and firmware changes.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name || 'TechExpert';
  return {
    title: `About ${siteName}`,
    description: `We are a team of passionate engineers, analysts, and tech enthusiasts dedicated to bringing you rigorous, unbiased reviews and buying guides.`,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name || 'TechExpert';
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">

      {/* ─── Page Header ─── */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          Helping you make smarter technology buying decisions
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          We are a team of passionate engineers, analysts, and tech enthusiasts dedicated to bringing you rigorous, unbiased reviews and guides.
        </p>
      </div>

      {/* ─── Who We Are ─── */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Who We Are</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

          {/* Text card */}
          <div className="sm:col-span-3 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 bg-white dark:bg-slate-900">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {siteName} was founded on a simple principle: technical clarity should be
              accessible to everyone. We bridge the gap between deep technical specifications
              and practical everyday usability.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Our editorial team operates independently, free from external influence, to ensure
              our recommendations are entirely focused on what&apos;s best for the consumer.
            </p>
          </div>

          {/* Stat card */}
          <div className="sm:col-span-2 bg-indigo-600 dark:bg-indigo-700 rounded-xl p-6 flex flex-col items-center justify-center text-white text-center space-y-2">
            <Users className="w-8 h-8 opacity-90" />
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm opacity-80 font-medium">Expert Reviewers</p>
            </div>
          </div>

        </div>
      </div>

      {/* ─── How We Research Products ─── */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">How We Research Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {researchSteps.map((step) => (
            <div
              key={step.label}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {step.number} {step.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Editorial Principles ─── */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 bg-white dark:bg-slate-900 space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Editorial Principles</h2>
        <div className="space-y-4">
          {editorialPrinciples.map((principle) => (
            <div key={principle.title} className="flex gap-3">
              <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {principle.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{principle.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
