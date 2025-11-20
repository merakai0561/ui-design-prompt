import React, { useState, useCallback, useEffect } from 'react';
import { Smartphone, Layout, Palette, Type, Droplet, Zap, PenTool, Plus } from 'lucide-react'; // Import icons
import { Header } from './components/Header';
import { PromptHero } from './components/PromptHero';
import { OptionChip } from './components/OptionChip';
import { SettingsModal } from './components/SettingsModal';
import { PROMPT_CATEGORIES, UI_TEXT } from './constants';
import { Language, AIModel } from './types';
import { refinePromptWithGemini } from './services/geminiService';

// Map category keys to icons
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  platform: Smartphone,
  subject: Layout,
  style: Palette,
  typography: Type,
  color: Droplet,
  quality: Zap,
};

// Helper to check if a value is one of the predefined options
const isValuePredefined = (categoryKey: string, value: string): boolean => {
  const category = PROMPT_CATEGORIES[categoryKey];
  if (!value) return false;
  
  if (category.options) {
    return category.options.some(opt => opt.value === value);
  }
  if (category.groups) {
    return category.groups.some(group => group.items.some(opt => opt.value === value));
  }
  return false;
};

const App: React.FC = () => {
  // --- State ---
  const [language, setLanguage] = useState<Language>('en');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState<string>('');
  const [isRefining, setIsRefining] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-2.5-flash');
  const [customModeKeys, setCustomModeKeys] = useState<Set<string>>(new Set());
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [customBaseUrl, setCustomBaseUrl] = useState<string>('');
  
  // --- Effects ---
  // Load Settings from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('custom_gemini_api_key');
    if (storedKey) {
      setCustomApiKey(storedKey.trim());
    }
    const storedUrl = localStorage.getItem('custom_gemini_base_url');
    if (storedUrl) {
      setCustomBaseUrl(storedUrl.trim());
    }
  }, []);

  // Save API Key to local storage when changed
  const handleApiKeyChange = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('custom_gemini_api_key', key);
  };

  // Save Base URL to local storage
  const handleBaseUrlChange = (url: string) => {
    setCustomBaseUrl(url);
    localStorage.setItem('custom_gemini_base_url', url);
  };

  // --- Logic ---
  const rebuildPrompt = useCallback((options: Record<string, string>) => {
    const parts = Object.keys(PROMPT_CATEGORIES)
      .map(key => options[key])
      .filter(Boolean);
    setPrompt(parts.join(', '));
  }, []);

  const handleOptionToggle = (categoryKey: string, value: string) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      if (newOptions[categoryKey] === value) {
        delete newOptions[categoryKey];
      } else {
        newOptions[categoryKey] = value;
      }
      rebuildPrompt(newOptions);
      return newOptions;
    });

    // If selecting a regular option, hide the custom input
    setCustomModeKeys(prev => {
      const next = new Set(prev);
      next.delete(categoryKey);
      return next;
    });
  };

  const toggleCustomMode = (categoryKey: string) => {
    setCustomModeKeys(prev => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
        // Clear existing option if we are opening custom mode
        // UX decision: Let's clear selection so it's clear we are going custom.
        setSelectedOptions(prevOpts => {
          const newOpts = { ...prevOpts };
          delete newOpts[categoryKey];
          rebuildPrompt(newOpts);
          return newOpts;
        });
      }
      return next;
    });
  };

  const handleCustomInput = (categoryKey: string, value: string) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      if (!value.trim()) {
        delete newOptions[categoryKey];
      } else {
        newOptions[categoryKey] = value;
      }
      rebuildPrompt(newOptions);
      return newOptions;
    });
  };

  const handleClear = () => {
    setSelectedOptions({});
    setPrompt('');
    setCustomModeKeys(new Set());
  };

  const handleRefine = async () => {
    if (!prompt) return;

    // Check if we have a valid key (either env or custom)
    const hasKey = process.env.API_KEY || customApiKey;
    if (!hasKey) {
      setIsSettingsOpen(true);
      alert(language === 'en' ? "Please configure your API Key first." : "请先配置您的 API Key。");
      return;
    }

    setIsRefining(true);
    try {
      const refined = await refinePromptWithGemini(prompt, selectedModel, customApiKey, customBaseUrl);
      if (refined) {
        setPrompt(refined);
      }
    } catch (error: any) {
      console.error("Refine failed", error);
      
      const errorMsg = error.message || "Unknown error";
      const errorStr = JSON.stringify(error);

      // Specific handling for Location/Region errors
      if (errorStr.includes("User location is not supported") || errorMsg.includes("User location is not supported")) {
         const tip = language === 'en' 
          ? "Tip: This error usually means your network region is blocked. Please try using a VPN or configure a Custom Base URL (Proxy) in Settings." 
          : "提示：此错误通常表示您所在的网络区域不支持访问 Gemini。请尝试使用 VPN，或在设置中配置自定义 Base URL (代理地址)。";
         alert(`Refine failed: ${errorMsg}\n\n${tip}`);
      } else {
         alert(`Refine failed: ${errorMsg}\n\nPlease check your API Key, Base URL, and network.`);
      }
    } finally {
      setIsRefining(false);
    }
  };

  // --- Render Helpers ---
  const renderCategoryContent = (key: string) => {
    const category = PROMPT_CATEGORIES[key];
    const currentSelection = selectedOptions[key];
    const isPredefined = isValuePredefined(key, currentSelection || '');
    const customInputValue = isPredefined ? '' : (currentSelection || '');
    const isCustomMode = customModeKeys.has(key);

    // Reusable Custom Button Component
    const CustomButton = () => (
      <button
        onClick={() => toggleCustomMode(key)}
        className={`
          relative px-3 py-2 rounded-lg text-[15px] font-medium text-left transition-all duration-200 w-full
          flex items-center justify-center gap-2 select-none border border-dashed
          ${isCustomMode 
            ? 'bg-violet-50 border-violet-500 text-violet-700' 
            : 'bg-white text-slate-500 border-slate-300 hover:border-violet-400 hover:text-violet-600'
          }
        `}
      >
        <Plus size={16} />
        <span className={isCustomMode ? 'font-bold' : 'font-medium'}>
          {UI_TEXT.customButton[language]}
        </span>
      </button>
    );

    return (
      <div className="space-y-3">
        {/* Options Grid or Groups */}
        {category.options && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {category.options.map((opt) => (
              <OptionChip
                key={opt.value}
                option={opt}
                isSelected={currentSelection === opt.value}
                onToggle={() => handleOptionToggle(key, opt.value)}
                language={language}
              />
            ))}
            <CustomButton />
          </div>
        )}

        {category.groups && (
          <div className="space-y-3">
            {category.groups.map((group, idx) => (
              <div key={idx} className="rounded-2xl p-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1 flex items-center gap-2 font-sans">
                  <span className="w-1 h-1 rounded-full bg-violet-300"></span>
                  {group.name[language]}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {group.items.map((opt) => (
                    <OptionChip
                      key={opt.value}
                      option={opt}
                      isSelected={currentSelection === opt.value}
                      onToggle={() => handleOptionToggle(key, opt.value)}
                      language={language}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-start">
               <div className="w-full sm:w-auto sm:min-w-[120px]">
                  <CustomButton />
               </div>
            </div>
          </div>
        )}

        {/* Custom Input Field - Conditionally Rendered */}
        {isCustomMode && (
          <div className="pt-1 animate-fade-in-up">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PenTool className="h-4 w-4 text-violet-500" />
              </div>
              <input
                type="text"
                autoFocus
                value={customInputValue}
                onChange={(e) => handleCustomInput(key, e.target.value)}
                placeholder={UI_TEXT.customPlaceholder[language]}
                className={`
                  block w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-200 outline-none
                  bg-white border border-violet-200 text-slate-900 placeholder-slate-400 
                  focus:border-violet-500 focus:ring-2 focus:ring-violet-100 shadow-sm
                `}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT COLUMN: Options */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-80 lg:pb-20 order-1 lg:order-1 bg-white">
          <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
            {Object.keys(PROMPT_CATEGORIES).map((key, index) => {
              const Icon = CATEGORY_ICONS[key] || Layout;
              const isSelected = !!selectedOptions[key];
              
              return (
                <section 
                  key={key} 
                  className="animate-fade-in-up" 
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2 group">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
                      ${isSelected ? 'bg-violet-600 text-white' : 'bg-slate-50 text-violet-600 border border-slate-100'}
                    `}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className={`text-base font-bold transition-colors ${isSelected ? 'text-violet-900' : 'text-slate-900'}`}>
                        {PROMPT_CATEGORIES[key].title[language].split(' ').slice(1).join(' ')}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="pl-1 lg:pl-0">
                    {renderCategoryContent(key)}
                  </div>
                </section>
              );
            })}
            
            <div className="pt-8 text-center text-slate-300 text-xs font-medium">
               Crafted for UI/UX Perfection
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="
          fixed bottom-0 left-0 right-0 h-auto z-40 
          lg:static lg:w-[420px] lg:h-full lg:order-2
          bg-white border-t lg:border-t-0 lg:border-l border-slate-200
        ">
          <PromptHero 
            language={language}
            prompt={prompt}
            setPrompt={setPrompt}
            onClear={handleClear}
            onRefine={handleRefine}
            isRefining={isRefining}
            hasSelectedOptions={Object.keys(selectedOptions).length > 0}
          />
        </div>

      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        currentModel={selectedModel}
        onModelChange={setSelectedModel}
        customApiKey={customApiKey}
        onApiKeyChange={handleApiKeyChange}
        customBaseUrl={customBaseUrl}
        onBaseUrlChange={handleBaseUrlChange}
      />
    </div>
  );
};

export default App;