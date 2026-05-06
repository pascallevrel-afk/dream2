import React from 'react';
import { BEDROOM_STYLES } from '../constants';
import { DesignStyle } from '../types';
import { Sparkles, Dice5 } from 'lucide-react';

interface StyleSelectorProps {
  onSelectStyle: (style: DesignStyle) => void;
  onSurprise: () => void;
  selectedStyleId: string | null;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  onSelectStyle, 
  onSurprise,
  selectedStyleId, 
  disabled 
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">Select a Style</h3>
        <button
            onClick={onSurprise}
            disabled={disabled}
            className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Dice5 size={16} />
            Surprise Me
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {BEDROOM_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style)}
            disabled={disabled}
            className={`
              relative flex-shrink-0 w-32 h-20 rounded-lg p-3 flex flex-col justify-end items-start
              transition-all duration-300 snap-start
              ${selectedStyleId === style.id 
                ? 'ring-2 ring-purple-500 scale-105 shadow-lg shadow-purple-500/20' 
                : 'hover:scale-105 opacity-80 hover:opacity-100'}
              ${style.color}
              disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
            `}
          >
            <div className="absolute top-2 right-2 opacity-50">
                {selectedStyleId === style.id && <Sparkles size={14} />}
            </div>
            <span className="font-bold text-sm leading-tight">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
