import React from 'react';
import { X, Zap, Star, ShieldCheck, AlertCircle, Brain, Key, Globe } from 'lucide-react';
import { Language, AIModel } from '../types';
import { UI_TEXT } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentModel: AIModel;
  onModelChange: (model: AIModel) => void;
  customApiKey: string;
  onApiKeyChange: (key: string) => void;
  customBaseUrl: string;
  onBaseUrlChange: (url: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  currentModel,
  onModelChange,
  customApiKey,
  onApiKeyChange,
  customBaseUrl,
  onBaseUrlChange
}) => {
  if (!isOpen) return null;

  const hasEnvKey = !!process.env.API_KEY;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{UI_TEXT.settingsTitle[language]}</h3>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* API Key Status */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              {UI_TEXT.apiKeyLabel[language]}
            </label>
            
            {hasEnvKey ? (
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-800">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  {UI_TEXT.apiKeyConnected[language]}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border bg-amber-50 border-amber-200 text-amber-800">
                   <AlertCircle className="w-4 h-4 shrink-0" />
                   <span className="text-xs font-medium leading-relaxed">
                     {UI_TEXT.apiKeyMissing[language]}
                   </span>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="password"
                    value={customApiKey}
                    onChange={(e) => onApiKeyChange(e.target.value.trim())}
                    placeholder={UI_TEXT.apiKeyInputPlaceholder[language]}
                    className="block w-full pl-11 pr-4 py-4 rounded-2xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all shadow-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 px-2">
                  {language === 'en' 
                    ? 'Stored locally in your browser.' 
                    : '仅存储在本地浏览器中。'}
                </p>
              </div>
            )}
          </div>

          {/* Base URL (Proxy) */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              {UI_TEXT.baseUrlLabel[language]}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text"
                value={customBaseUrl}
                onChange={(e) => onBaseUrlChange(e.target.value.trim())}
                placeholder={UI_TEXT.baseUrlPlaceholder[language]}
                className="block w-full pl-11 pr-4 py-4 rounded-2xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all shadow-sm"
              />
            </div>
            <p className="text-xs text-slate-400 px-2 leading-relaxed">
              {language === 'en' 
                ? 'Use this if you are in a restricted region (e.g., https://my-proxy.com)' 
                : '如果您在受限地区（如中国大陆），请填写代理地址 (例如 Cloudflare Worker 地址)'}
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              {UI_TEXT.modelLabel[language]}
            </label>
            
            <div className="grid gap-4">
              {/* FLASH */}
              <button
                onClick={() => onModelChange('gemini-2.5-flash')}
                className={`
                  relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all text-left group
                  ${currentModel === 'gemini-2.5-flash' 
                    ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                  ${currentModel === 'gemini-2.5-flash' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}
                `}>
                  <Zap size={20} fill={currentModel === 'gemini-2.5-flash' ? "currentColor" : "none"} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${currentModel === 'gemini-2.5-flash' ? 'text-violet-900' : 'text-slate-900'}`}>
                    {language === 'en' ? 'Gemini 2.5 Flash' : 'Gemini 2.5 Flash (标准)'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {language === 'en' ? 'Fastest response, good for most tasks' : '响应最快，适合大多数任务'}
                  </div>
                </div>
                {currentModel === 'gemini-2.5-flash' && (
                  <div className="absolute right-5 w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm"></div>
                )}
              </button>

              {/* 2.5 PRO */}
              <button
                onClick={() => onModelChange('gemini-2.5-pro')}
                className={`
                  relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all text-left group
                  ${currentModel === 'gemini-2.5-pro' 
                    ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                  ${currentModel === 'gemini-2.5-pro' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}
                `}>
                  <Brain size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${currentModel === 'gemini-2.5-pro' ? 'text-violet-900' : 'text-slate-900'}`}>
                    {language === 'en' ? 'Gemini 2.5 Pro' : 'Gemini 2.5 Pro (进阶)'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {language === 'en' ? 'Balanced performance & reasoning' : '性能均衡，适合复杂指令'}
                  </div>
                </div>
                {currentModel === 'gemini-2.5-pro' && (
                  <div className="absolute right-5 w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm"></div>
                )}
              </button>

              {/* 3 PRO */}
              <button
                onClick={() => onModelChange('gemini-3-pro-preview')}
                className={`
                  relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all text-left group
                  ${currentModel === 'gemini-3-pro-preview' 
                    ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                  ${currentModel === 'gemini-3-pro-preview' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}
                `}>
                  <Star size={20} fill={currentModel === 'gemini-3-pro-preview' ? "currentColor" : "none"} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${currentModel === 'gemini-3-pro-preview' ? 'text-violet-900' : 'text-slate-900'}`}>
                    {language === 'en' ? 'Gemini 3 Pro' : 'Gemini 3 Pro (专业)'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {language === 'en' ? 'High intelligence, complex reasoning' : '高智商模型，适合复杂推理'}
                  </div>
                </div>
                {currentModel === 'gemini-3-pro-preview' && (
                  <div className="absolute right-5 w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm"></div>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 pt-0">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            {UI_TEXT.close[language]}
          </button>
        </div>
      </div>
    </div>
  );
};