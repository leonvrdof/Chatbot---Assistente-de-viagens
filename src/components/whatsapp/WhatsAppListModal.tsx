import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { FlowOption, ThemeMode } from '../../types/chat';
import { playClickSound } from '../../utils/audio';

interface WhatsAppListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sections?: {
    title: string;
    options: FlowOption[];
  }[];
  options?: FlowOption[];
  onSelectOption: (option: FlowOption) => void;
  theme: ThemeMode;
}

export const WhatsAppListModal: React.FC<WhatsAppListModalProps> = ({
  isOpen,
  onClose,
  title,
  sections,
  options,
  onSelectOption,
  theme,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Flattened options lookup
  const allOptions: FlowOption[] = sections
    ? sections.flatMap((s) => s.options)
    : options || [];

  const handleConfirm = () => {
    if (!selectedOptionId) return;
    const option = allOptions.find((o) => o.id === selectedOptionId);
    if (option) {
      playClickSound();
      onSelectOption(option);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end sm:justify-center sm:items-center backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl transition-all border ${
          theme === 'dark'
            ? 'bg-[#111B21] text-[#E9EDEF] border-[#222E35]'
            : 'bg-white text-[#111B21] border-[#E9EDEF]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3.5 border-b ${
            theme === 'dark' ? 'border-[#222E35] bg-[#202C33]' : 'border-[#E9EDEF] bg-[#F0F2F5]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight truncate">{title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#54656F] dark:text-[#8696A0] hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with list sections */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-[#222E35]">
          {sections && sections.length > 0 ? (
            sections.map((section, sIdx) => (
              <div key={`sec-${sIdx}`} className="py-2">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#008069] dark:text-[#00A884]">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          playClickSound();
                          setSelectedOptionId(opt.id);
                        }}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? theme === 'dark'
                              ? 'bg-[#202C33]'
                              : 'bg-emerald-50'
                            : theme === 'dark'
                              ? 'hover:bg-[#182229]'
                              : 'hover:bg-[#F0F2F5]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-[#00A884] bg-[#00A884] text-white'
                              : 'border-slate-400 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-medium leading-tight">{opt.title}</p>
                          {opt.description && (
                            <p className="text-[11.5px] text-[#54656F] dark:text-[#8696A0] mt-0.5 leading-snug">
                              {opt.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="py-1">
              {allOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedOptionId(opt.id);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-[#202C33]'
                          : 'bg-emerald-50'
                        : theme === 'dark'
                          ? 'hover:bg-[#182229]'
                          : 'hover:bg-[#F0F2F5]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-[#00A884] bg-[#00A884] text-white'
                          : 'border-slate-400 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium">{opt.title}</p>
                      {opt.description && (
                        <p className="text-[11.5px] text-[#54656F] dark:text-[#8696A0] mt-0.5">
                          {opt.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Send Button */}
        <div
          className={`p-3 border-t flex justify-end ${
            theme === 'dark' ? 'border-[#222E35] bg-[#202C33]' : 'border-[#E9EDEF] bg-[#F0F2F5]'
          }`}
        >
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleConfirm}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              selectedOptionId
                ? 'bg-[#00A884] text-white hover:bg-[#008f70] active:scale-[0.99] cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Confirmar Opção</span>
          </button>
        </div>
      </div>
    </div>
  );
};
