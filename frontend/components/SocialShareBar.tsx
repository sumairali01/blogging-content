'use client';

import React, { useState } from 'react';
import { Share2, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface Props {
  url: string;
  title: string;
  mediaUrl?: string | null;
  description?: string;
}

export const SocialShareBar: React.FC<Props> = ({
  url,
  title,
  mediaUrl,
  description = '',
}) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedMedia = mediaUrl ? encodeURIComponent(mediaUrl) : '';
  const encodedDesc = encodeURIComponent(description || title);

  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedMedia}&description=${encodedDesc}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 my-6 border-y border-slate-200">
      <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5 text-blue-600" />
        <span>Share Guide:</span>
      </span>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors shadow-2xs"
        title="Share on X"
      >
        <span>𝕏 Post</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 bg-[#0077B5] hover:bg-[#005582] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors shadow-2xs"
        title="Share on LinkedIn"
      >
        <span>LinkedIn</span>
      </a>

      {/* Pinterest Save Button */}
      <a
        href={pinterestUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 bg-[#E60023] hover:bg-[#ad081b] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors shadow-2xs"
        title="Save to Pinterest"
      >
        <span>📌 Pin</span>
      </a>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-600 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};
