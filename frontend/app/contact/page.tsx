'use client';

import React, { useState, useEffect } from 'react';
import { Mail, User, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendContactMessage, getSiteSettings } from '@/lib/api';

export default function ContactPage() {
  const [siteName, setSiteName] = useState('TechGear Guide');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s?.site_name) setSiteName(s.site_name);
    });
  }, []);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setFeedback('');

    try {
      const res = await sendContactMessage(formData);
      if (res && res.success) {
        setStatus('success');
        setFeedback(res.message || "Thank you for reaching out! Our editorial team will review your message.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        if (res && typeof res === 'object') {
          const firstKey = Object.keys(res)[0];
          const errorMsg = Array.isArray(res[firstKey]) ? res[firstKey][0] : res[firstKey];
          setFeedback(typeof errorMsg === 'string' ? errorMsg : 'Failed to send message. Please check all fields.');
        } else {
          setFeedback('Failed to send message. Please try again.');
        }
      }
    } catch {
      setStatus('error');
      setFeedback('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
            <span>Editorial Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Contact {siteName}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Have a hardware product you&apos;d like us to evaluate? Suggest a comparison guide for students or programmers? Drop our editorial team a message below.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xs relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    required
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    required
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Product review suggestion, gear question, correction, partnership..."
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all disabled:opacity-60"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Message <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details regarding your tech inquiry..."
                  required
                  disabled={loading}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all disabled:opacity-60 resize-y"
                />
              </div>
            </div>

            {/* Alerts */}
            {status === 'success' && (
              <div className="flex items-center space-x-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center space-x-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 p-4 rounded-xl text-sm font-semibold">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-xs disabled:opacity-60 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Support note */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Response Time</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">We typically respond to tech inquiries within 24 to 48 business hours.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Hardware Benchmarks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">We independently evaluate and verify all recommended developer &amp; student gear.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Merchant Inquiries</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Brands seeking hardware evaluation can provide product test units for independent review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
