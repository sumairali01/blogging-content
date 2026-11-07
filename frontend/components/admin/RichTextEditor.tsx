'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Code,
  Eye,
  Edit3,
  Undo,
  Redo,
  RemoveFormatting,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Write your article content here...',
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value to visual editor when activeTab is visual or value initialized
  useEffect(() => {
    if (editorRef.current) {
      if (!isInternalChange.current) {
        editorRef.current.innerHTML = value || '';
      }
      isInternalChange.current = false;
    }
  }, [value, activeTab]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  const handleCreateLink = () => {
    const selection = window.getSelection();
    const url = prompt('Enter URL (e.g. https://example.com):', 'https://');
    if (url && url !== 'https://' && url.trim()) {
      executeCommand('createLink', url.trim());
    }
  };

  const handleFormatBlock = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
      {/* Top Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border-b border-slate-200">
        {/* Formatting Actions (Active only in Visual Mode) */}
        <div className={`flex flex-wrap items-center gap-1 ${activeTab !== 'visual' ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => handleFormatBlock('<h2>')}
              title="Heading 2 (Section Title)"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors text-xs font-bold flex items-center gap-0.5 px-2"
            >
              <Heading2 className="w-3.5 h-3.5" />
              <span>H2</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock('<h3>')}
              title="Heading 3 (Sub-section)"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors text-xs font-bold flex items-center gap-0.5 px-2"
            >
              <Heading3 className="w-3.5 h-3.5" />
              <span>H3</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock('<p>')}
              title="Regular Paragraph"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors text-xs font-semibold px-2"
            >
              Paragraph
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Inline styles */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <UnderlineIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Lists & Quotes */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock('<blockquote>')}
              title="Quote Box"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Links & Clear */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleCreateLink}
              title="Insert Link"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('unlink')}
              title="Remove Link"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('removeFormat')}
              title="Clear Formatting"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              title="Undo"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              title="Redo"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher (Visual vs Code vs Live Preview) */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'visual'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="min-h-[320px] max-h-[600px] overflow-y-auto">
        {/* 1. Visual WYSIWYG Mode */}
        {activeTab === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            className="p-6 focus:outline-none min-h-[320px] prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
            style={{ minHeight: '320px' }}
          />
        )}

        {/* 2. Raw HTML Code Mode */}
        {activeTab === 'code' && (
          <textarea
            rows={14}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<h2>Enter HTML content...</h2>"
            className="w-full h-full p-4 font-mono text-xs text-slate-900 bg-slate-900 text-emerald-400 focus:outline-none leading-relaxed resize-y min-h-[320px]"
          />
        )}

        {/* 3. Live Preview Mode */}
        {activeTab === 'preview' && (
          <div className="p-6 bg-slate-50 min-h-[320px]">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="text-xs uppercase font-bold text-blue-600 mb-3 tracking-widest flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Live Reader View Preview
              </div>
              {value ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-a:text-blue-600 prose-a:font-semibold leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              ) : (
                <p className="text-slate-400 text-sm italic">No content written yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>
          Mode: <strong className="text-slate-600 capitalize">{activeTab}</strong>
        </span>
        <span>
          {activeTab === 'visual'
            ? 'Format text using toolbar or write naturally like Word/Medium.'
            : activeTab === 'code'
            ? 'Direct HTML source editing mode.'
            : 'Previewing how readers will see this content.'}
        </span>
      </div>
    </div>
  );
};
