export type Language = 'zh' | 'en';
export type AIModel = 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-3-pro-preview';

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Option {
  label: LocalizedText;
  value: string; // Always English for the prompt
}

export interface Group {
  name: LocalizedText;
  items: Option[];
}

export interface Category {
  title: LocalizedText;
  options?: Option[];
  groups?: Group[];
}

export interface PromptData {
  [key: string]: Category;
}

export interface UIConstants {
  headerTitle: LocalizedText;
  copyButton: LocalizedText;
  clearButton: LocalizedText;
  refineButton: LocalizedText;
  refining: LocalizedText;
  placeholder: LocalizedText;
  copied: LocalizedText;
  clearConfirm: LocalizedText;
  settingsTitle: LocalizedText;
  modelLabel: LocalizedText;
  modelFlash: LocalizedText;
  modelPro: LocalizedText;
  apiKeyLabel: LocalizedText;
  apiKeyConnected: LocalizedText;
  apiKeyMissing: LocalizedText;
  apiKeyInputLabel: LocalizedText;
  apiKeyInputPlaceholder: LocalizedText;
  close: LocalizedText;
  customPlaceholder: LocalizedText;
  customButton: LocalizedText;
}