import React, { useState, useEffect } from 'react';
import { FileText, Play, Pause, CheckCheck, Download, ExternalLink, Sparkles } from 'lucide-react';
import { BotMessagePart, ThemeMode } from '../../types/chat';

interface WhatsAppBubbleProps {
  sender: 'bot' | 'user' | 'system';
  parts: BotMessagePart[];
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  theme: ThemeMode;
  nodeTitle?: string;
  showDesignerDebug?: boolean;
}

// Simple markdown formatter for WhatsApp syntax: *bold*, _italic_, ~strike~, `mono`
function formatWhatsAppText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.flatMap((line, lineIdx) => {
    // Process formatting within the line
    const elements: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Pattern matching **bold**, *bold*, _italic_, ~strikethrough~, `code`
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|~([^~]+)~|`([^`]+)`)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        elements.push(remaining.substring(lastIndex, match.index));
      }

      if (match[2] || match[3]) {
        elements.push(<strong key={`b-${lineIdx}-${keyIdx++}`} className="font-bold">{match[2] || match[3]}</strong>);
      } else if (match[4]) {
        elements.push(<em key={`i-${lineIdx}-${keyIdx++}`} className="italic">{match[4]}</em>);
      } else if (match[5]) {
        elements.push(<del key={`s-${lineIdx}-${keyIdx++}`} className="line-through">{match[5]}</del>);
      } else if (match[6]) {
        elements.push(<code key={`c-${lineIdx}-${keyIdx++}`} className="px-1 py-0.5 rounded font-mono text-xs bg-black/10 dark:bg-white/10">{match[6]}</code>);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      elements.push(remaining.substring(lastIndex));
    }

    return (
      <span key={`line-${lineIdx}`}>
        {elements.length > 0 ? elements : line}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({
  sender,
  parts,
  timestamp,
  status = 'read',
  theme,
  nodeTitle,
  showDesignerDebug = false,
}) => {
  const isBot = sender === 'bot';
  const isSystem = sender === 'system';

  // Audio simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState<1 | 1.5 | 2>(1);

  // PDF Preview modal state
  const [showPdfModal, setShowPdfModal] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 4 * audioSpeed;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, audioSpeed]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 px-4">
        <div className="bg-[#FFEECD] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[11.5px] px-3 py-1.5 rounded-lg shadow-sm text-center max-w-sm border border-amber-200/50 dark:border-amber-900/20">
          {parts[0]?.text}
        </div>
      </div>
    );
  }

  // Generate simulated waveform heights
  const waveformHeights = [18, 28, 12, 34, 42, 26, 16, 38, 48, 30, 22, 40, 32, 14, 28, 36, 20, 10];

  return (
    <div className={`flex flex-col my-1.5 px-3 ${isBot ? 'items-start' : 'items-end'}`}>
      {/* Optional Designer Node Step Badge */}
      {showDesignerDebug && nodeTitle && (
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mb-0.5 px-1.5 tracking-tight flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          {nodeTitle}
        </span>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-lg px-2.5 py-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-[14.2px] leading-[19px] transition-colors ${
          isBot
            ? theme === 'dark'
              ? 'bg-[#202C33] text-[#E9EDEF] rounded-tl-none'
              : 'bg-white text-[#111B21] rounded-tl-none'
            : theme === 'dark'
              ? 'bg-[#005C4B] text-[#E9EDEF] rounded-tr-none'
              : 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none'
        }`}
      >
        {/* Authentic speech bubble tail */}
        <div
          className={`absolute top-0 w-3 h-3 overflow-hidden pointer-events-none ${
            isBot ? '-left-2' : '-right-2'
          }`}
        >
          {isBot ? (
            <svg
              className={`w-3 h-3 ${theme === 'dark' ? 'text-[#202C33]' : 'text-white'}`}
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M12 0 C6 0 0 4 0 12 C4 8 8 2 12 0 Z" />
            </svg>
          ) : (
            <svg
              className={`w-3 h-3 ${theme === 'dark' ? 'text-[#005C4B]' : 'text-[#D9FDD3]'}`}
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M0 0 C6 0 12 4 12 12 C8 8 4 2 0 0 Z" />
            </svg>
          )}
        </div>

        {/* Message Content Parts */}
        <div className="space-y-2">
          {parts.map((part, idx) => {
            if (part.type === 'image' && part.mediaUrl) {
              return (
                <div key={`img-${idx}`} className="-mx-1 -mt-1 mb-1 overflow-hidden rounded-md">
                  <img
                    src={part.mediaUrl}
                    alt={part.caption || 'Imagem'}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => window.open(part.mediaUrl, '_blank')}
                  />
                  {part.caption && (
                    <div className="p-1.5 text-xs text-[#54656F] dark:text-[#8696A0] bg-black/5 dark:bg-white/5">
                      {formatWhatsAppText(part.caption)}
                    </div>
                  )}
                </div>
              );
            }

            if (part.type === 'document') {
              return (
                <div
                  key={`doc-${idx}`}
                  onClick={() => setShowPdfModal(part.mediaTitle || 'Documento')}
                  className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors border ${
                    theme === 'dark'
                      ? 'bg-[#182229] hover:bg-[#1c2830] border-[#2a3942]'
                      : 'bg-[#F0F2F5] hover:bg-[#e4e7ea] border-[#e2e5e8]'
                  }`}
                >
                  <div className="w-10 h-10 rounded bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{part.mediaTitle || 'Documento.pdf'}</p>
                    <p className="text-[11px] text-[#667781] dark:text-[#8696A0]">
                      {part.mediaSubtitle || `${part.fileSize || '380 KB'} · PDF`}
                    </p>
                  </div>
                  <button
                    type="button"
                    title="Baixar ou visualizar"
                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-400"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            if (part.type === 'audio') {
              return (
                <div key={`audio-${idx}`} className="flex items-center gap-3 py-1 min-w-[210px] sm:min-w-[240px]">
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-full bg-[#00A884] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
                    aria-label={isPlayingAudio ? 'Pausar áudio' : 'Reproduzir áudio'}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  {/* Waveform Scrubber */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="h-5 flex items-center gap-[2.5px] cursor-pointer" onClick={() => setAudioProgress((prev) => (prev + 25) % 100)}>
                      {waveformHeights.map((h, barIdx) => {
                        const isBarActive = (barIdx / waveformHeights.length) * 100 <= audioProgress;
                        return (
                          <div
                            key={barIdx}
                            style={{ height: `${h}px` }}
                            className={`w-[3px] rounded-full transition-colors ${
                              isBarActive
                                ? 'bg-[#00A884]'
                                : theme === 'dark'
                                  ? 'bg-[#3b4a54]'
                                  : 'bg-[#B4BCC2]'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#667781] dark:text-[#8696A0]">
                      <span>{isPlayingAudio ? `0:${Math.floor((audioProgress / 100) * 24).toString().padStart(2, '0')}` : (part.audioDuration || '0:24')}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const speeds: (1 | 1.5 | 2)[] = [1, 1.5, 2];
                          const nextIdx = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
                          setAudioSpeed(speeds[nextIdx]);
                        }}
                        className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[9px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-black/10"
                      >
                        {audioSpeed}x
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={`txt-${idx}`} className="break-words">
                {part.text && formatWhatsAppText(part.text)}
              </div>
            );
          })}
        </div>

        {/* Timestamp & Read Receipts */}
        <div className="flex items-center justify-end gap-1 -mb-0.5 mt-0.5 ml-3 float-right select-none">
          <span className="text-[11px] text-[#667781] dark:text-[#8696A0] tracking-tight">
            {timestamp}
          </span>
          {!isBot && (
            <span title="Lida" className="text-[#53BDEB]">
              <CheckCheck className="w-3.5 h-3.5 stroke-[2.2]" />
            </span>
          )}
        </div>
      </div>

      {/* PDF Document Preview Modal */}
      {showPdfModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowPdfModal(null)}
        >
          <div
            className="bg-white dark:bg-[#182229] rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{showPdfModal}</h4>
                <p className="text-xs text-slate-500">Documento Oficial Verificado</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Document Mock View */}
            <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B141A] border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                <span>VIAJEMAIS BRASIL TURISMO</span>
                <span>AUTENTICADO</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                PROPOSTA & VOUCHER ELETRÔNICO: #VJ-2026-98421
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                DESTINO: Porto de Galinhas / Ipojuca - PE
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                HOSPEDAGEM: Vivá Resort Premium (5 Diárias)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                EMISSÃO: Via WhatsApp API Oficial Business
              </p>
              <div className="pt-2 text-center text-[10px] text-slate-400">
                [ QR Code de Entrada Validado pelo Sistema ]
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPdfModal(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Download simulado com sucesso no protótipo!');
                  setShowPdfModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
