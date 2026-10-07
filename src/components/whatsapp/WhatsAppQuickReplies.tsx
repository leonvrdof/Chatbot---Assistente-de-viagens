import React from 'react';
import { FlowOption, ThemeMode } from '../../types/chat';
import { playClickSound } from '../../utils/audio';

interface WhatsAppQuickRepliesProps {
  options: FlowOption[];
  onSelect: (option: FlowOption) => void;
  disabled?: boolean;
  theme: ThemeMode;
}

export const WhatsAppQuickReplies: React.FC<WhatsAppQuickRepliesProps> = ({
  options,
  onSelect,
  disabled = false,
  theme,
}) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 px-3 py-1 my-1 max-w-[85%] sm:max-w-[75%]">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={disabled}
          onClick={() => {
            playClickSound();
            onSelect(option);
          }}
          className={`w-full py-2.5 px-4 text-[13.5px] font-semibold text-center rounded-lg shadow-[0_1px_1px_rgba(11,20,26,0.12)] border transition-all active:scale-[0.98] ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md cursor-pointer'
          } ${
            theme === 'dark'
              ? 'bg-[#202C33] text-[#00A884] border-[#222E35] hover:bg-[#233138]'
              : 'bg-white text-[#008069] border-[#E9EDEF] hover:bg-slate-50'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5 truncate">
            {option.title}
          </span>
        </button>
      ))}
    </div>
  );
};
