import React from 'react';
import { X, ExternalLink, Check, Sparkles, Figma, FileText, ArrowRight } from 'lucide-react';

interface FigmaInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFlowEditor: () => void;
}

export const FigmaInfoModal: React.FC<FigmaInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenFlowEditor,
}) => {
  if (!isOpen) return null;

  const figmaUrl =
    'https://www.figma.com/design/iS4Jq0wyODvgVXuYrSGNNh/Fluxo-Conversacional---Assistente-viagens?node-id=1-2&t=DLwgd085zEFn6v2A-1';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl text-slate-100 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Figma className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Sincronização com o Figma: Assistente Lia
              </h3>
              <p className="text-[11px] text-slate-400">Source of Truth (node-id=1-2)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200">
            <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-300">
              <span>⚠️ Importante sobre a Fraseologia do Figma:</span>
            </p>
            <p className="text-[11.5px] leading-relaxed">
              O link público do Figma disponibiliza apenas uma visão panorâmica em miniatura do canvas
              (onde estão os 13 blocos de microfluxos), sem exportar os textos internos via API pública aberta.
            </p>
          </div>

          <p>
            Para que <strong>nenhuma frase seja adaptada ou alterada</strong> em relação às suas definições originais:
          </p>

          <div className="space-y-2 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>Cole aqui no chat:</strong> Envie as falas das mensagens da Lia e opções de botões exatamente como estão nas caixas do seu Figma.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>Ou use a aba "Colar Roteiro Figma":</strong> Abra o editor no topo e cole o texto corrido das caixas com <code>[Etapa]</code> e <code>-&gt; Botão</code>.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
          <a
            href={figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 underline underline-offset-2"
          >
            <span>Ver no Figma</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFlowEditor();
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Abrir Editor de Fraseologias</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
