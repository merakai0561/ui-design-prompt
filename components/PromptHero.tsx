import React, { useState } from 'react';
import { Copy, Trash2, Sparkles, Check } from 'lucide-react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface PromptHeroProps {
  language: Language;
  prompt: string;
  setPrompt: (val: string) => void;
  onClear: () => void;
  onRefine: () => void;
  isRefining: boolean;
  hasSelectedOptions: boolean;
}

export const PromptHero: React.FC<PromptHeroProps> = ({
  language,
  prompt,
  setPrompt,
  onClear,
  onRefine,
  isRefining,
  hasSelectedOptions
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] lg:shadow-none">
      {/* Title Section (Desktop Only) */}
      <div className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-lg font-sans tracking-tight">Prompt Output</h3>
          <p className="text-xs text-slate-400 font-medium mt-1 font-sans">AI-ready • English Only</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></div>
      </div>

      {/* Textarea Section */}
      <div className="flex-grow relative p-0 lg:p-0 group bg-slate-50/30">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={UI_TEXT.placeholder[language]}
          className="w-full h-full min-h-[140px] lg:min-h-0 p-8 text-slate-800 placeholder-slate-300 bg-transparent border-none resize-none font-mono text-[14px] leading-relaxed transition-all outline-none focus:ring-0"
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-6 text-[10px] font-mono font-medium text-slate-300 pointer-events-none bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm">
          {prompt.length} chars
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-5 lg:p-8 border-t border-slate-100 bg-white z-10">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
             <button
              onClick={handleCopy}
              disabled={!prompt || isRefining}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 font-sans ${
                copied 
                  ? 'bg-emerald-500 text-white border border-emerald-600' 
                  : 'bg-slate-900 text-white border border-slate-900 hover:bg-slate-800'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 disabled:hover:translate-y-0`}
            >
              {copied ? <Check className="w-5 h-5" strokeWidth={3} /> : <Copy className="w-5 h-5" strokeWidth={2.5} />}
              {copied ? UI_TEXT.copied[language] : UI_TEXT.copyButton[language]}
            </button>
            
            <button
              onClick={onClear}
              disabled={(!prompt && !hasSelectedOptions) || isRefining}
              className="w-16 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:hover:border-slate-200"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={onRefine}
            disabled={!prompt || isRefining}
            className="group w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-100 rounded-2xl font-bold text-base hover:from-violet-100 hover:to-indigo-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden font-sans hover:shadow-md hover:shadow-violet-100/50"
          >
            <span className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isRefining ? 'animate-spin' : 'text-violet-500'}`} />
              {isRefining ? UI_TEXT.refining[language] : UI_TEXT.refineButton[language]}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};