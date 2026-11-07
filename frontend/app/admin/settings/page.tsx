'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Share2, 
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  UploadCloud,
  X,
  FileCheck,
  Info
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAdminSettings, updateAdminSettings } from '@/lib/adminApi';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // General Branding
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [footerText, setFooterText] = useState('');
  const [disclosureDefault, setDisclosureDefault] = useState('');

  // Hero Text
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  // SEO Defaults
  const [defaultMetaTitle, setDefaultMetaTitle] = useState('');
  const [defaultMetaDescription, setDefaultMetaDescription] = useState('');
  
  // Social links
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  // Analytics
  const [gaId, setGaId] = useState('');
  const [pinterestVerify, setPinterestVerify] = useState('');

  useEffect(() => {
    getAdminSettings()
      .then((data) => {
        setSiteName(data.site_name || '');
        setSiteDescription(data.site_description || '');
        setContactEmail(data.contact_email || '');
        setFooterText(data.footer_text || '');
        setDisclosureDefault(data.affiliate_disclosure_default || '');

        // Hero Text
        setHeroBadge(data.hero_badge || '');
        setHeroTitle(data.hero_title || '');
        setHeroSubtitle(data.hero_subtitle || '');

        // Hero image from backend
        if (data.display_hero_image || data.hero_image) {
          setPreviewUrl(data.display_hero_image || data.hero_image);
        }

        setDefaultMetaTitle(data.default_meta_title || '');
        setDefaultMetaDescription(data.default_meta_description || '');
        
        const social = data.social_links || {};
        setPinterestUrl(social.pinterest || '');
        setTwitterHandle(social.twitter || '');
        setInstagramUrl(social.instagram || '');

        const analytics = data.analytics_ids || {};
        setGaId(analytics.ga_id || '');
        setPinterestVerify(analytics.pinterest_verify || '');

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load site settings');
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError('');

    const formData = new FormData();
    formData.append('site_name', siteName);
    formData.append('site_description', siteDescription);
    formData.append('hero_badge', heroBadge);
    formData.append('hero_title', heroTitle);
    formData.append('hero_subtitle', heroSubtitle);
    formData.append('default_meta_title', defaultMetaTitle);
    formData.append('default_meta_description', defaultMetaDescription);
    formData.append('contact_email', contactEmail);
    formData.append('footer_text', footerText);
    formData.append('affiliate_disclosure_default', disclosureDefault);
    formData.append('social_links', JSON.stringify({
      pinterest: pinterestUrl.trim(),
      twitter: twitterHandle.trim(),
      instagram: instagramUrl.trim(),
    }));
    formData.append('analytics_ids', JSON.stringify({
      ga_id: gaId.trim(),
      pinterest_verify: pinterestVerify.trim(),
    }));

    // If a new image file was selected from user's computer
    if (selectedFile) {
      formData.append('hero_image', selectedFile);
    }

    try {
      const updated = await updateAdminSettings(formData);
      if (updated.display_hero_image) {
        setPreviewUrl(updated.display_hero_image);
      }
      setSelectedFile(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex items-center justify-center space-x-2 text-slate-400 text-xs font-semibold">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
        <span>Loading site settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Site Settings"
        subtitle="Control your site name, hero text, footer, disclosure, social links, analytics, and hero banner image — all from here."
      />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 space-y-6">
        
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold p-4 rounded-xl flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Hero banner image uploaded and settings saved successfully!</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* ── 1. Direct Hero Banner Image Upload Dropzone ── */}
        <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-slate-900 text-base">Upload Hero Banner Image</h2>
            </div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              Direct File Upload
            </span>
          </div>

          {/* Sizing & Aspect Ratio Recommendation Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Recommended Image Specifications for Your Banner:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
              <div className="bg-slate-800/80 p-2.5 rounded-lg">
                <span className="text-slate-400 block font-medium">Ideal Dimensions</span>
                <strong className="text-white text-xs">1920 × 600 px (or 1440 × 500 px)</strong>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg">
                <span className="text-slate-400 block font-medium">Aspect Ratio</span>
                <strong className="text-white text-xs">16:5 / 3:1 (Wide Panoramic)</strong>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg">
                <span className="text-slate-400 block font-medium">Formats Supported</span>
                <strong className="text-white text-xs">JPG, PNG, WebP (&lt; 5MB)</strong>
              </div>
            </div>
          </div>

          {/* File Picker & Dropzone Area */}
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/avif,image/jpg"
              onChange={handleFileChange}
              className="hidden"
              id="hero_image_file_input"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 hover:bg-emerald-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors">
                    Click to browse &amp; upload image from your computer
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    PNG, JPG, or WebP up to 5MB
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center space-x-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl shadow-2xs group-hover:border-emerald-500 group-hover:text-emerald-700 transition-all"
                >
                  <span>Select Image File</span>
                </button>
              </div>
            </div>

            {/* Selected File Notice */}
            {selectedFile && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {(selectedFile.size / 1024).toFixed(1)} KB · Ready to save
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSelectedFile}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Full-Width Live Banner Preview */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Live Banner Preview
              </span>
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 shadow-md h-48 sm:h-56 md:h-64 flex items-center justify-center group">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Hero Banner Preview"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-500 space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs">No image uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── 2. Hero Text Content ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-slate-900 text-sm">Hero Section Text</h2>
            <span className="text-[10px] text-slate-400 font-medium ml-auto">Displayed on homepage hero area</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Hero Badge / Label</label>
            <input
              type="text"
              placeholder="e.g. 100% Independent Tech & Hardware Testing"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Hero Headline / Title</label>
            <input
              type="text"
              placeholder="e.g. Smarter Tech Buying Decisions for Builders & Learners."
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Hero Subtitle / Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Independent buying guides crafted for students and developers..."
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* ── 3. General Branding ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-slate-900 text-sm">General Branding &amp; Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Site Name *</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Site Tagline / Description</label>
            <textarea
              rows={2}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Footer Copyright Text</label>
            <input
              type="text"
              placeholder="e.g. © 2026 TechGear Guide. All rights reserved."
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900"
            />
          </div>
        </div>

        {/* ── 3. FTC Affiliate Disclosure ── */}
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-emerald-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-emerald-950 text-sm">FTC Affiliate Disclaimer Copy</h2>
          </div>
          <p className="text-[11px] text-slate-600">
            This notice is rendered globally in the footer, disclosure bars, and top of affiliate review posts.
          </p>
          <textarea
            rows={3}
            value={disclosureDefault}
            onChange={(e) => setDisclosureDefault(e.target.value)}
            className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        {/* ── 4. Social Profiles & Pinterest ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Share2 className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-slate-900 text-sm">Social Profiles &amp; Pinterest</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Pinterest Page URL</label>
              <input
                type="url"
                placeholder="https://pinterest.com/..."
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Twitter / X Handle</label>
              <input
                type="text"
                placeholder="@yourhandle"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Instagram URL</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* ── 5. Analytics & Verification IDs ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
            Analytics &amp; Verification Tags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Pinterest Domain Verification Code</label>
              <input
                type="text"
                placeholder="pinterest-site-verification=..."
                value={pinterestVerify}
                onChange={(e) => setPinterestVerify(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
