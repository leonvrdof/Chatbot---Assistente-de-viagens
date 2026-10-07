import React, { useState } from 'react';
import {
  X,
  Save,
  Code,
  Sliders,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { FlowDefinition, FlowNode, FlowOption } from '../../types/chat';

interface FlowEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  flow: FlowDefinition;
  onSaveFlow: (updatedFlow: FlowDefinition) => void;
  onResetToDefault: () => void;
}

export const FlowEditorModal: React.FC<FlowEditorModalProps> = ({
  isOpen,
  onClose,
  flow,
  onSaveFlow,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'script' | 'json'>('visual');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(flow.startNodeId);
  const [editedFlow, setEditedFlow] = useState<FlowDefinition>(flow);
  const [jsonText, setJsonText] = useState(JSON.stringify(flow, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Script text for rapid text pasting from Figma
  const [scriptInput, setScriptInput] = useState<string>(`[01. Boas-vindas & Apresentação]
Olá! Sou a Lia, sua assistente virtual de viagens ✈️🌴
Estou aqui para te ajudar a encontrar os melhores destinos, passagens aéreas e pacotes com roteiros incríveis.
Para começarmos, como posso te chamar?
-> Avançar

[02. Menu Principal]
Que alegria ter você por aqui! O que você gostaria de planejar hoje?
-> ✈️ Passagens & Destinos
-> 🏨 Pacotes com Hotel
-> 🗺️ Dicas & Roteiro
-> 👤 Falar com Consultor

[03. Destinos Disponíveis]
Temos opções imperdíveis para esta temporada! Qual o seu destino preferido?
-> Porto de Galinhas (PE)
-> Gramado & Canela (RS)
-> Rio de Janeiro (RJ)
-> Buenos Aires (Argentina)

[04. Confirmação & Proposta]
Aqui está a sua proposta oficial com o itinerário completo e valores especiais.
-> ✅ Confirmar Reserva
-> 🔄 Ver Outro Destino`);

  if (!isOpen) return null;

  const currentNode = editedFlow.nodes[selectedNodeId] || Object.values(editedFlow.nodes)[0];

  const handleUpdateNodeText = (text: string) => {
    if (!currentNode) return;
    const updatedNodes = {
      ...editedFlow.nodes,
      [currentNode.id]: {
        ...currentNode,
        messages: [{ ...currentNode.messages[0], text }],
      },
    };
    const updated = { ...editedFlow, nodes: updatedNodes };
    setEditedFlow(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleUpdateOption = (index: number, field: keyof FlowOption, value: string) => {
    if (!currentNode || !currentNode.options) return;
    const newOptions = [...currentNode.options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    const updatedNodes = {
      ...editedFlow.nodes,
      [currentNode.id]: {
        ...currentNode,
        options: newOptions,
      },
    };
    const updated = { ...editedFlow, nodes: updatedNodes };
    setEditedFlow(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleAddOption = () => {
    if (!currentNode) return;
    const newOption: FlowOption = {
      id: `opt_${Date.now()}`,
      title: 'Nova Opção',
      nextNodeId: flow.startNodeId,
    };
    const newOptions = [...(currentNode.options || []), newOption];
    const updatedNodes = {
      ...editedFlow.nodes,
      [currentNode.id]: {
        ...currentNode,
        options: newOptions,
      },
    };
    const updated = { ...editedFlow, nodes: updatedNodes };
    setEditedFlow(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleDeleteOption = (index: number) => {
    if (!currentNode || !currentNode.options) return;
    const newOptions = currentNode.options.filter((_, i) => i !== index);
    const updatedNodes = {
      ...editedFlow.nodes,
      [currentNode.id]: {
        ...currentNode,
        options: newOptions,
      },
    };
    const updated = { ...editedFlow, nodes: updatedNodes };
    setEditedFlow(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  // Convert raw script into structured flow nodes
  const handleParseScript = () => {
    const blocks = scriptInput.split(/\n\s*\n/).filter((b) => b.trim().length > 0);
    const newNodes: Record<string, FlowNode> = {};
    const createdNodeIds: string[] = [];

    blocks.forEach((block, idx) => {
      const lines = block.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      let title = `Etapa ${idx + 1}`;
      const messageLines: string[] = [];
      const optionTitles: string[] = [];

      lines.forEach((line) => {
        if (line.startsWith('[') && line.endsWith(']')) {
          title = line.slice(1, -1);
        } else if (line.startsWith('->') || line.startsWith('- >')) {
          optionTitles.push(line.replace(/^->\s*|^- >\s*/, ''));
        } else {
          messageLines.push(line);
        }
      });

      const nodeId = `node_${idx + 1}`;
      createdNodeIds.push(nodeId);

      newNodes[nodeId] = {
        id: nodeId,
        title,
        messages: [{ type: 'text', text: messageLines.join('\n\n') }],
        interactiveType: optionTitles.length > 0 ? 'quick_replies' : 'text_input',
        options: optionTitles.map((t, oIdx) => ({
          id: `opt_${idx + 1}_${oIdx + 1}`,
          title: t,
          nextNodeId: `node_${idx + 2}`, // Points to next step by default
        })),
        delayMs: 650,
      };
    });

    // Fix the last node target to first node
    const lastId = createdNodeIds[createdNodeIds.length - 1];
    if (lastId && newNodes[lastId]?.options) {
      newNodes[lastId].options = newNodes[lastId].options?.map((o) => ({
        ...o,
        nextNodeId: createdNodeIds[0] || lastId,
      }));
    }

    if (createdNodeIds.length > 0) {
      const updated: FlowDefinition = {
        ...editedFlow,
        startNodeId: createdNodeIds[0],
        nodes: newNodes,
      };
      setEditedFlow(updated);
      setSelectedNodeId(createdNodeIds[0]);
      setJsonText(JSON.stringify(updated, null, 2));
      setActiveTab('visual');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleSave = () => {
    if (activeTab === 'json') {
      try {
        const parsed = JSON.parse(jsonText);
        onSaveFlow(parsed);
        setJsonError(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch {
        setJsonError('Erro ao analisar JSON. Verifique a sintaxe.');
      }
    } else {
      onSaveFlow(editedFlow);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Sincronizador de Fraseologias do Figma (Lia)
            </h2>
            <p className="text-xs text-slate-400">
              Cole ou edite as falas exatas, botões e transições definidas nas telas do seu Figma.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'visual' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'script' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Colar Roteiro Figma</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'json' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'visual' ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Node Selection */}
              <div className="w-64 border-r border-slate-800 overflow-y-auto p-3 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Etapas do Microfluxo
                </p>
                {Object.values(editedFlow.nodes).map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium truncate transition-colors ${
                      node.id === currentNode?.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {node.title}
                  </button>
                ))}
              </div>

              {/* Right Column: Node Details Editor */}
              {currentNode && (
                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold mb-1 block">
                      Nome da Etapa no Figma:
                    </label>
                    <input
                      type="text"
                      value={currentNode.title}
                      onChange={(e) => {
                        const updated = {
                          ...editedFlow,
                          nodes: {
                            ...editedFlow.nodes,
                            [currentNode.id]: { ...currentNode, title: e.target.value },
                          },
                        };
                        setEditedFlow(updated);
                        setJsonText(JSON.stringify(updated, null, 2));
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold mb-1 block">
                      Mensagem da Lia no WhatsApp (Texto exato do Figma):
                    </label>
                    <textarea
                      rows={5}
                      value={currentNode.messages[0]?.text || ''}
                      onChange={(e) => handleUpdateNodeText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-hidden focus:border-emerald-500 font-sans leading-relaxed text-[13px]"
                    />
                  </div>

                  {/* Options & Quick Reply Buttons */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 font-semibold">
                        Botões de Opção no WhatsApp:
                      </label>
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center gap-1 border border-slate-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Botão</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentNode.options?.map((opt, oIdx) => (
                        <div
                          key={opt.id || oIdx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700"
                        >
                          <input
                            type="text"
                            value={opt.title}
                            placeholder="Texto exato do botão no Figma"
                            onChange={(e) => handleUpdateOption(oIdx, 'title', e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                          />
                          <span className="text-slate-500">➔</span>
                          <select
                            value={opt.nextNodeId}
                            onChange={(e) => handleUpdateOption(oIdx, 'nextNodeId', e.target.value)}
                            className="w-48 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200"
                          >
                            {Object.values(editedFlow.nodes).map((n) => (
                              <option key={n.id} value={n.id}>
                                {n.title}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(oIdx)}
                            className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg"
                            title="Remover Opção"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'script' ? (
            <div className="flex-1 flex flex-col p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Colar Roteiro Rápido do Figma</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Copie e cole o texto corrido das caixas do Figma. Use <code>[Nome da Etapa]</code> para criar a tela e <code>-&gt; Opção</code> para criar os botões clicáveis:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleParseScript}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Converter em Telas do WhatsApp</span>
                </button>
              </div>

              <textarea
                value={scriptInput}
                onChange={(e) => setScriptInput(e.target.value)}
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
                placeholder="[01. Boas-vindas]&#10;Olá! Sou a Lia...&#10;-> Agendar Viagem&#10;-> Dúvidas"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-4">
              <p className="text-xs text-slate-400 mb-2">
                Copie o JSON para salvar ou cole um JSON estruturado para carregar seu fluxo do Figma:
              </p>
              {jsonError && (
                <div className="p-2.5 mb-2 bg-red-900/30 border border-red-800 text-red-300 rounded-lg text-xs">
                  {jsonError}
                </div>
              )}
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          <button
            type="button"
            onClick={onResetToDefault}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão do Assistente</span>
          </button>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" />
                Fraseologias aplicadas com sucesso!
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Salvar e Aplicar no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
