import React, { useState } from 'react';
import {
  ArrowLeft,
  Video,
  Phone,
  MoreVertical,
  BadgeCheck,
  RotateCcw,
  Trash2,
  GitBranch,
  Edit3,
} from 'lucide-react';
import { FlowDefinition, ThemeMode } from '../../types/chat';

interface WhatsAppHeaderProps {
  botProfile: FlowDefinition['botProfile'];
  isTyping: boolean;
  onResetChat: () => void;
  onOpenFlowViewer: () => void;
  onOpenFlowEditor: () => void;
  theme: ThemeMode;
}

export const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({
  botProfile,
  isTyping,
  onResetChat,
  onOpenFlowViewer,
  onOpenFlowEditor,
  theme,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCallNotice, setShowCallNotice] = useState(false);

  const handleCallClick = () => {
    setShowCallNotice(true);
    setTimeout(() => setShowCallNotice(false), 2200);
  };

  return (
    <div
      className={`relative z-20 flex items-center justify-between px-3 py-2.5 shadow-sm select-none transition-colors border-b ${
        theme === 'dark'
          ? 'bg-[#202C33] text-[#E9EDEF] border-[#222E35]'
          : 'bg-[#F0F2F5] text-[#111B21] border-[#E9EDEF]'
      }`}
    >
      {/* Left: Back Arrow + Contact Avatar & Info */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onResetChat}
          className="p-1 -ml-1 text-[#54656F] dark:text-[#8696A0] hover:text-inherit rounded-full"
          title="Voltar / Reiniciar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Profile Avatar */}
        <div className="relative shrink-0">
          {botProfile.avatarUrl ? (
            <img
              src={botProfile.avatarUrl}
              alt={botProfile.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
            />
          ) : (
            <div
              style={{ backgroundColor: botProfile.avatarColor }}
              className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-inner"
            >
              {botProfile.avatarText}
            </div>
          )}
        </div>

        {/* Name and Status */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold truncate leading-tight tracking-tight">
              {botProfile.name}
            </h2>
            {botProfile.verified && (
              <BadgeCheck
                className="w-4 h-4 text-[#00A884] shrink-0 fill-[#00A884] text-white"
                aria-label="Conta comercial verificada"
              />
            )}
          </div>
          <div className="h-4 flex items-center">
            {isTyping ? (
              <span className="text-xs text-[#00A884] font-medium flex items-center gap-1 animate-pulse">
                digitando...
              </span>
            ) : (
              <span className="text-[11px] text-[#54656F] dark:text-[#8696A0] truncate">
                {botProfile.subtitle || 'Conta comercial oficial'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 text-[#54656F] dark:text-[#8696A0]">
        <button
          type="button"
          onClick={handleCallClick}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          title="Chamada de Vídeo"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCallClick}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          title="Chamada de Voz"
        >
          <Phone className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            title="Mais Opções"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* WhatsApp 3-dots Dropdown */}
          {showDropdown && (
            <div
              className={`absolute right-0 top-full mt-1 w-52 rounded-xl shadow-xl py-1.5 z-40 border transition-all text-xs font-medium ${
                theme === 'dark'
                  ? 'bg-[#233138] text-[#E9EDEF] border-[#222E35]'
                  : 'bg-white text-[#111B21] border-[#E9EDEF]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  onResetChat();
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2.5"
              >
                <RotateCcw className="w-4 h-4 text-emerald-500" />
                <span>Reiniciar Fluxo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  onOpenFlowViewer();
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2.5"
              >
                <GitBranch className="w-4 h-4 text-blue-500" />
                <span>Ver Mapa do Microfluxo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  onOpenFlowEditor();
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2.5"
              >
                <Edit3 className="w-4 h-4 text-purple-500" />
                <span>Editar Mensagens (Figma)</span>
              </button>
              <hr className="my-1 border-slate-200 dark:border-slate-700/50" />
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  onResetChat();
                }}
                className="w-full px-3.5 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Conversa</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Simulated Call Toast Notice */}
      {showCallNotice && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-black/85 text-white text-[11px] shadow-lg animate-in fade-in duration-200 z-50">
          Chamada não disponível no protótipo conversacional.
        </div>
      )}
    </div>
  );
};
