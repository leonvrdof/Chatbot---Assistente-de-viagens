import React from 'react';
import {
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Edit3,
  GitBranch,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ViewportMode, ThemeMode, FlowDefinition } from '../../types/chat';

interface TopNavigationProps {
  viewportMode: ViewportMode;
  onSetViewportMode: (mode: ViewportMode) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeFlow: FlowDefinition;
  availableFlows: FlowDefinition[];
  onSelectFlow: (flowId: string) => void;
  onOpenFlowViewer: () => void;
  onOpenFlowEditor: () => void;
  onResetChat: () => void;
  cleanPresentationMode: boolean;
  onToggleCleanMode: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  viewportMode,
  onSetViewportMode,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  activeFlow,
  availableFlows,
  onSelectFlow,
  onOpenFlowViewer,
  onOpenFlowEditor,
  onResetChat,
  cleanPresentationMode,
  onToggleCleanMode,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 lg:px-6 py-2.5 flex items-center justify-between text-slate-100 z-30 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A884] animate-pulse" />
          <span>WhatsApp Chatbot Studio</span>
        </a>

        {/* Current Flow Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
          <span>Fluxo:</span>
          <select
            value={activeFlow.id}
            onChange={(e) => onSelectFlow(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            {availableFlows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone 2: Navigation & Viewport Segmented Controls */}
      <nav className="flex items-center gap-2 text-xs">
        {/* Device Switcher (Mobile / Web) */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => onSetViewportMode('mobile')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-colors ${
              viewportMode === 'mobile'
                ? 'bg-slate-700 text-emerald-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Visualização Mobile (Smartphone)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Smartphone</span>
          </button>
          <button
            type="button"
            onClick={() => onSetViewportMode('web')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-colors ${
              viewportMode === 'web'
                ? 'bg-slate-700 text-emerald-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Visualização WhatsApp Web (Desktop)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">WhatsApp Web</span>
          </button>
        </div>

        {/* Quick Tools */}
        <button
          type="button"
          onClick={onOpenFlowViewer}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
          title="Ver Mapa do Microfluxo"
        >
          <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
          <span>Microfluxo</span>
        </button>

        <button
          type="button"
          onClick={onOpenFlowEditor}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
          title="Editar Mensagens do Figma"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Editar Fluxo (Figma)</span>
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-800 border-slate-700 text-emerald-400'
              : 'bg-slate-800/40 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Sons do WhatsApp ativos' : 'Sons desativados'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme mode toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title={theme === 'dark' ? 'Mudar para WhatsApp Claro' : 'Mudar para WhatsApp Escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onResetChat}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          title="Reiniciar conversa do início"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>

        <button
          type="button"
          onClick={onToggleCleanMode}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
            cleanPresentationMode
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 ring-2 ring-emerald-400/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
          title="Alternar Modo Apresentação / Teste sem distrações"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{cleanPresentationMode ? 'Sair do Modo Teste' : 'Modo Teste'}</span>
        </button>
      </div>
    </header>
  );
};
