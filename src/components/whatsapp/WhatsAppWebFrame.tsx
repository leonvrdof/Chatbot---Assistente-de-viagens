import React from 'react';
import {
  Search,
  MessageSquare,
  CircleDashed,
  Users,
  MoreVertical,
  CheckCheck,
  BadgeCheck,
} from 'lucide-react';
import { FlowDefinition, ThemeMode } from '../../types/chat';

interface WhatsAppWebFrameProps {
  children: React.ReactNode;
  activeFlow: FlowDefinition;
  theme: ThemeMode;
  onSelectChat?: () => void;
}

export const WhatsAppWebFrame: React.FC<WhatsAppWebFrameProps> = ({
  children,
  activeFlow,
  theme,
}) => {
  const isDark = theme === 'dark';

  const mockSidebarChats = [
    {
      id: 'active_bot',
      name: activeFlow.botProfile.name,
      verified: activeFlow.botProfile.verified,
      avatarUrl: activeFlow.botProfile.avatarUrl,
      avatarText: activeFlow.botProfile.avatarText,
      avatarColor: activeFlow.botProfile.avatarColor,
      lastMessage: 'Proposta de Viagem & Cotação',
      time: '18:35',
      unread: 0,
      active: true,
    },
    {
      id: 'chat_2',
      name: 'Grupo Família & Férias',
      verified: false,
      avatarText: 'GF',
      avatarColor: '#4F46E5',
      lastMessage: 'Já decidiram o destino das férias?',
      time: '16:42',
      unread: 2,
      active: false,
    },
    {
      id: 'chat_3',
      name: 'Equipe de UX Research',
      verified: false,
      avatarText: 'UX',
      avatarColor: '#059669',
      lastMessage: 'Os testes de usabilidade começam hoje',
      time: 'Ontem',
      unread: 0,
      active: false,
    },
  ];

  return (
    <div className="w-full max-w-6xl h-[820px] rounded-2xl shadow-2xl border border-slate-700/40 overflow-hidden flex flex-col my-4">
      {/* WhatsApp Web Outer Header Green Strip */}
      <div className={`h-2.5 w-full ${isDark ? 'bg-[#00A884]' : 'bg-[#00A884]'}`} />

      {/* Main Two-Column WhatsApp Web Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Chats List) */}
        <div
          className={`w-80 md:w-96 flex flex-col border-r shrink-0 transition-colors ${
            isDark ? 'bg-[#111B21] border-[#222E35] text-[#E9EDEF]' : 'bg-white border-[#E9EDEF] text-[#111B21]'
          }`}
        >
          {/* Top Bar with user avatar & icons */}
          <div
            className={`h-14 px-4 flex items-center justify-between border-b ${
              isDark ? 'bg-[#202C33] border-[#222E35]' : 'bg-[#F0F2F5] border-[#E9EDEF]'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center font-bold text-xs">
              EU
            </div>
            <div className="flex items-center gap-2 text-[#54656F] dark:text-[#8696A0]">
              <button type="button" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <Users className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <CircleDashed className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                isDark ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-[#F0F2F5] text-slate-800'
              }`}
            >
              <Search className="w-4 h-4 text-[#8696A0]" />
              <input
                type="text"
                placeholder="Pesquisar ou começar uma nova conversa"
                className="bg-transparent flex-1 focus:outline-hidden text-xs placeholder:text-[#8696A0]"
                readOnly
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-100 dark:border-[#222E35] text-xs">
            <span className="px-3 py-1 rounded-full bg-[#008069] text-white font-medium text-[11px]">
              Tudo
            </span>
            <span className="px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#54656F] dark:text-[#8696A0] text-[11px] cursor-pointer">
              Não lidas
            </span>
            <span className="px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#54656F] dark:text-[#8696A0] text-[11px] cursor-pointer">
              Grupos
            </span>
          </div>

          {/* Chat List Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#222E35]">
            {mockSidebarChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  chat.active
                    ? isDark
                      ? 'bg-[#2A3942]'
                      : 'bg-[#F0F2F5]'
                    : isDark
                      ? 'hover:bg-[#202C33]'
                      : 'hover:bg-slate-50'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {chat.avatarUrl ? (
                    <img
                      src={chat.avatarUrl}
                      alt={chat.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: chat.avatarColor }}
                      className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-xs"
                    >
                      {chat.avatarText}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-sm font-semibold truncate">{chat.name}</span>
                      {chat.verified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-[#00A884] fill-[#00A884] text-white shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#667781] dark:text-[#8696A0] shrink-0 ml-1">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#54656F] dark:text-[#8696A0] truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 ? (
                      <span className="w-4 h-4 rounded-full bg-[#00A884] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {chat.unread}
                      </span>
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB] shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
