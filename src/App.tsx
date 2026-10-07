import React, { useState, useEffect } from 'react';
import {
  INITIAL_FLOWS,
  TRAVEL_FLOW,
} from './data/defaultFlows';
import {
  FlowDefinition,
  ViewportMode,
  ThemeMode,
  UsabilityMetricLog,
  FlowOption,
} from './types/chat';
import { WhatsAppChat } from './components/whatsapp/WhatsAppChat';
import { PhoneFrame } from './components/whatsapp/PhoneFrame';
import { WhatsAppWebFrame } from './components/whatsapp/WhatsAppWebFrame';
import { TopNavigation } from './components/designer/TopNavigation';
import { MicroflowViewer } from './components/designer/MicroflowViewer';
import { UsabilityPanel } from './components/designer/UsabilityPanel';
import { FlowEditorModal } from './components/designer/FlowEditorModal';
import { FigmaInfoModal } from './components/designer/FigmaInfoModal';
import {
  GitBranch,
  ClipboardList,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export default function App() {
  // Load saved flows or fallback to INITIAL_FLOWS
  const [flows, setFlows] = useState<FlowDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('whatsapp_prototype_flows_v14');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_FLOWS;
  });

  const [activeFlowId, setActiveFlowId] = useState<string>('assistente_viagens');
  const activeFlow = flows.find((f) => f.id === activeFlowId) || flows[0] || TRAVEL_FLOW;

  const [currentNodeId, setCurrentNodeId] = useState<string>(activeFlow.startNodeId);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([activeFlow.startNodeId]);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cleanPresentationMode, setCleanPresentationMode] = useState(false);

  // Modals & Panels
  const [isFlowEditorOpen, setIsFlowEditorOpen] = useState(false);
  const [isFigmaInfoOpen, setIsFigmaInfoOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'chat' | 'microflow' | 'usability'>('chat');

  // Usability Metrics Log
  const [metricLogs, setMetricLogs] = useState<UsabilityMetricLog[]>([
    {
      id: `log-init`,
      timestamp: Date.now(),
      type: 'node_visited',
      nodeId: activeFlow.startNodeId,
      nodeTitle: activeFlow.nodes[activeFlow.startNodeId]?.title || 'Início',
    },
  ]);

  // Persist flows
  useEffect(() => {
    try {
      localStorage.setItem('whatsapp_prototype_flows_v14', JSON.stringify(flows));
    } catch {
      // Ignore
    }
  }, [flows]);

  // Reset node when flow changes
  const handleSelectFlow = (flowId: string) => {
    const target = flows.find((f) => f.id === flowId);
    if (target) {
      setActiveFlowId(flowId);
      setCurrentNodeId(target.startNodeId);
      setVisitedNodes([target.startNodeId]);
      setMetricLogs([
        {
          id: `log-init-${Date.now()}`,
          timestamp: Date.now(),
          type: 'node_visited',
          nodeId: target.startNodeId,
          nodeTitle: target.nodes[target.startNodeId]?.title || 'Início',
        },
      ]);
    }
  };

  const handleNodeTransition = (targetNodeId: string, userText: string, option?: FlowOption) => {
    if (activeFlow.nodes[targetNodeId]) {
      setCurrentNodeId(targetNodeId);
      setVisitedNodes((prev) => (prev.includes(targetNodeId) ? prev : [...prev, targetNodeId]));

      setMetricLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          type: option ? 'option_selected' : 'free_text',
          nodeId: targetNodeId,
          nodeTitle: activeFlow.nodes[targetNodeId]?.title || targetNodeId,
          userInput: userText,
        },
      ]);
    }
  };

  const handleLogCustomMetric = (log: Omit<UsabilityMetricLog, 'id' | 'timestamp'>) => {
    setMetricLogs((prev) => [
      ...prev,
      {
        ...log,
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleResetChat = () => {
    setCurrentNodeId(activeFlow.startNodeId);
    setVisitedNodes([activeFlow.startNodeId]);
    setMetricLogs((prev) => [
      ...prev,
      {
        id: `log-reset-${Date.now()}`,
        timestamp: Date.now(),
        type: 'node_visited',
        nodeId: activeFlow.startNodeId,
        nodeTitle: 'Sessão Reiniciada',
      },
    ]);
  };

  const handleSaveFlow = (updatedFlow: FlowDefinition) => {
    setFlows((prev) => prev.map((f) => (f.id === updatedFlow.id ? updatedFlow : f)));
  };

  const handleResetToDefault = () => {
    setFlows(INITIAL_FLOWS);
    localStorage.removeItem('whatsapp_prototype_flows');
    localStorage.removeItem('whatsapp_prototype_flows_v2');
    localStorage.removeItem('whatsapp_prototype_flows_v4');
    localStorage.removeItem('whatsapp_prototype_flows_v5');
    localStorage.removeItem('whatsapp_prototype_flows_v6');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Contract Navigation */}
      {!cleanPresentationMode && (
        <TopNavigation
          viewportMode={viewportMode}
          onSetViewportMode={setViewportMode}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((s) => !s)}
          activeFlow={activeFlow}
          availableFlows={flows}
          onSelectFlow={handleSelectFlow}
          onOpenFlowViewer={() => setMobileActiveTab('microflow')}
          onOpenFlowEditor={() => setIsFlowEditorOpen(true)}
          onResetChat={handleResetChat}
          cleanPresentationMode={cleanPresentationMode}
          onToggleCleanMode={() => setCleanPresentationMode(!cleanPresentationMode)}
        />
      )}

      {/* Floating Exit Button for Clean Presentation Mode */}
      {cleanPresentationMode && (
        <div className="fixed top-3 right-3 z-50">
          <button
            type="button"
            onClick={() => setCleanPresentationMode(false)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sair do Modo Teste</span>
          </button>
        </div>
      )}

      {/* Figma Source of Truth Banner */}
      {!cleanPresentationMode && (
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="truncate">
              Protótipo Navegável baseado no Figma: <strong>Assistente de Viagens</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsFigmaInfoOpen(true)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 underline underline-offset-2 shrink-0 ml-2"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver detalhes do Figma & Microfluxo</span>
            <span className="sm:hidden">Figma</span>
          </button>
        </div>
      )}

      {/* Responsive Workspace Body */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 sm:p-4 gap-4 max-w-[1600px] w-full mx-auto">
        {/* Left Column: Interactive Microflow Diagram (Desktop) */}
        {!cleanPresentationMode && (
          <aside className="hidden xl:flex w-80 h-[820px] shrink-0 flex-col">
            <MicroflowViewer
              flow={activeFlow}
              currentNodeId={currentNodeId}
              onSelectNode={(nodeId) => {
                setCurrentNodeId(nodeId);
                setVisitedNodes((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
              }}
              visitedNodes={visitedNodes}
            />
          </aside>
        )}

        {/* Center Column: WhatsApp Simulation View */}
        <section className="flex-1 flex flex-col items-center justify-center min-h-[750px] overflow-hidden">
          {/* Mobile responsive tabs switch when screen is small */}
          {!cleanPresentationMode && (
            <div className="xl:hidden flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl mb-3 text-xs">
              <button
                type="button"
                onClick={() => setMobileActiveTab('chat')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  mobileActiveTab === 'chat'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                WhatsApp Chat
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTab('microflow')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  mobileActiveTab === 'microflow'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Microfluxo</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTab('usability')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  mobileActiveTab === 'usability'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Teste UX</span>
              </button>
            </div>
          )}

          {/* Render selected view for mobile viewports */}
          {mobileActiveTab === 'microflow' && !cleanPresentationMode ? (
            <div className="w-full max-w-md h-[780px] xl:hidden">
              <MicroflowViewer
                flow={activeFlow}
                currentNodeId={currentNodeId}
                onSelectNode={(nodeId) => {
                  setCurrentNodeId(nodeId);
                  setVisitedNodes((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
                  setMobileActiveTab('chat');
                }}
                visitedNodes={visitedNodes}
              />
            </div>
          ) : mobileActiveTab === 'usability' && !cleanPresentationMode ? (
            <div className="w-full max-w-md h-[780px] xl:hidden">
              <UsabilityPanel
                logs={metricLogs}
                currentNodeTitle={activeFlow.nodes[currentNodeId]?.title || currentNodeId}
                onResetSession={handleResetChat}
              />
            </div>
          ) : viewportMode === 'mobile' ? (
            <PhoneFrame theme={theme}>
              <WhatsAppChat
                flow={activeFlow}
                currentNodeId={currentNodeId}
                onNodeTransition={handleNodeTransition}
                onReset={handleResetChat}
                onOpenFlowViewer={() => setMobileActiveTab('microflow')}
                onOpenFlowEditor={() => setIsFlowEditorOpen(true)}
                theme={theme}
                showDesignerDebug={!cleanPresentationMode}
                onLogMetric={handleLogCustomMetric}
              />
            </PhoneFrame>
          ) : (
            <WhatsAppWebFrame activeFlow={activeFlow} theme={theme}>
              <WhatsAppChat
                flow={activeFlow}
                currentNodeId={currentNodeId}
                onNodeTransition={handleNodeTransition}
                onReset={handleResetChat}
                onOpenFlowViewer={() => setMobileActiveTab('microflow')}
                onOpenFlowEditor={() => setIsFlowEditorOpen(true)}
                theme={theme}
                showDesignerDebug={!cleanPresentationMode}
                onLogMetric={handleLogCustomMetric}
              />
            </WhatsAppWebFrame>
          )}
        </section>

        {/* Right Column: Usability Testing Suite (Desktop) */}
        {!cleanPresentationMode && (
          <aside className="hidden lg:flex w-80 h-[820px] shrink-0 flex-col">
            <UsabilityPanel
              logs={metricLogs}
              currentNodeTitle={activeFlow.nodes[currentNodeId]?.title || currentNodeId}
              onResetSession={handleResetChat}
            />
          </aside>
        )}
      </main>

      {/* Designer Flow Editor Modal */}
      <FlowEditorModal
        isOpen={isFlowEditorOpen}
        onClose={() => setIsFlowEditorOpen(false)}
        flow={activeFlow}
        onSaveFlow={handleSaveFlow}
        onResetToDefault={handleResetToDefault}
      />

      {/* Figma Info & Source of Truth Modal */}
      <FigmaInfoModal
        isOpen={isFigmaInfoOpen}
        onClose={() => setIsFigmaInfoOpen(false)}
        onOpenFlowEditor={() => setIsFlowEditorOpen(true)}
      />
    </div>
  );
}
