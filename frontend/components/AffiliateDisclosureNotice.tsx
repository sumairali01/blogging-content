import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  text?: string;
}

export const AffiliateDisclosureNotice: React.FC<Props> = ({ text }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm my-6 flex items-start space-x-3.5 shadow-2xs">
      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/50 dark:border-blue-800/60">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>Editorial Independence &amp; Reader Support</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
          {text || "TechGear Guide is an independent tech research publication. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you. We only recommend hardware and tools we thoroughly evaluate and trust."}
        </p>
      </div>
    </div>
  );
};
