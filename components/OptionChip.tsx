import React from 'react';
import { Option, Language } from '../types';

interface OptionChipProps {
  option: Option;
  isSelected: boolean;
  onToggle: () => void;
  language: Language;
}

export const OptionChip: React.FC<OptionChipProps> = ({ option, isSelected, onToggle, language }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative px-3 py-2 rounded-lg text-[15px] font-medium text-left transition-colors duration-200 w-full
        flex items-center justify-center group border select-none
        ${isSelected 
          ? 'bg-violet-50 border-violet-500 text-violet-700' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-slate-900'
        }
      `}
    >
      <span className={`truncate leading-tight ${isSelected ? 'font-bold' : 'font-medium'}`}>
        {option.label[language]}
      </span>
    </button>
  );
};