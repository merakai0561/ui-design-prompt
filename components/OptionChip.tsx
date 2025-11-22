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
        relative px-4 py-3 rounded-xl text-[15px] font-medium text-center transition-all duration-200 w-full
        flex items-center justify-center border select-none
        ${isSelected 
          ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500/20' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-slate-900 hover:shadow-sm hover:bg-slate-50'
        }
      `}
    >
      <span className={`truncate leading-tight ${isSelected ? 'font-bold' : 'font-medium'}`}>
        {option.label[language]}
      </span>
    </button>
  );
};