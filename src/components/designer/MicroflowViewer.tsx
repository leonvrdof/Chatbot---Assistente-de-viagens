import React from 'react';
import { GitBranch, Sparkles, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { FlowDefinition, FlowNode } from '../../types/chat';

interface MicroflowViewerProps {
  flow: FlowDefinition;
  currentNodeId: string;
  onSelectNode: (nodeId: string) => void;
  visitedNodes?: string[];
}

export const MicroflowViewer: React.FC<MicroflowViewerProps> = ({
  flow,
  currentNodeId,
  onSelectNode,
  visitedNodes = [],
}) => {
  const nodeList = Object.values(flow.nodes);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 flex flex-col h-full overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold tracking-tight">Microfluxo Conversacional (Figma)</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {nodeList.length} etapas mapeadas
        </span>
      </div>

      <p className="text-xs text-slate-400 my-2">
        Acompanhe a jornada do participante em tempo real ou clique em uma etapa para pular diretamente para ela no protótipo:
      </p>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
        {nodeList.map((node: FlowNode, idx: number) => {
          const isCurrent = node.id === currentNodeId;
          const isVisited = visitedNodes.includes(node.id);

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : isVisited
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-800/30 border-slate-800/80 hover:bg-slate-800/60 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] bg-slate-700 text-slate-300">
                    {idx + 1}
                  </span>
                  <span
                    className={`font-semibold tracking-tight ${
                      isCurrent ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {node.title}
                  </span>
                </div>
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-black flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-2.5 h-2.5" />
                    Ativa
                  </span>
                )}
                {!isCurrent && isVisited && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              {/* Message excerpt */}
              <p className="text-[11px] text-slate-400 line-clamp-2 pl-7 mb-2">
                {node.messages[0]?.text?.replace(/\*/g, '') || '[Mensagem Multimídia]'}
              </p>

              {/* Options & Branches */}
              {node.options && node.options.length > 0 && (
                <div className="pl-7 space-y-1 pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <CornerDownRight className="w-3 h-3" />
                    <span>Ramificações:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {node.options.map((opt) => (
                      <span
                        key={opt.id}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1"
                      >
                        <span>{opt.title}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
