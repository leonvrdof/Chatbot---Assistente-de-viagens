import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Download,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  User,
  Target,
} from 'lucide-react';
import { UsabilityMetricLog } from '../../types/chat';

interface UsabilityPanelProps {
  logs: UsabilityMetricLog[];
  currentNodeTitle: string;
  onResetSession: () => void;
}

export const UsabilityPanel: React.FC<UsabilityPanelProps> = ({
  logs,
  currentNodeTitle,
  onResetSession,
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [participantName, setParticipantName] = useState('Participante 01');
  const [taskGoal, setTaskGoal] = useState(
    'Cotar um pacote de viagem com voos e hotel para Porto de Galinhas e baixar a proposta'
  );
  const [notes, setNotes] = useState('');

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fallbackCount = logs.filter((l) => l.type === 'fallback_triggered').length;
  const stepsCount = logs.filter((l) => l.type === 'node_visited').length;

  const handleExportReport = () => {
    const reportText = `# Relatório de Teste de Usabilidade - Protótipo Conversacional WhatsApp
Projeto: Assistente de Viagens (Figma Source of Truth)
Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

## 1. Dados do Teste
- Participante: ${participantName}
- Objetivo / Tarefa: ${taskGoal}
- Tempo Total Decorrido: ${formatTimer(elapsedSeconds)}
- Total de Telas/Etapas Visitadas: ${stepsCount}
- Ocorrências de Fallback (Mensagens não reconhecidas): ${fallbackCount}

## 2. Anotações do Designer / Pesquisador:
${notes || 'Nenhuma anotação registrada.'}

## 3. Log Cronológico de Interações:
${logs
  .map(
    (l, idx) =>
      `${idx + 1}. [${new Date(l.timestamp).toLocaleTimeString()}] ${l.type.toUpperCase()}: ${l.nodeTitle} ${
        l.userInput ? `(Entrada: "${l.userInput}")` : ''
      }`
  )
  .join('\n')}

---
Gerado pelo Protótipo Conversacional WhatsApp para Portfólio de Conversational Design.
`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_Usabilidade_${participantName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 flex flex-col h-full overflow-hidden shadow-xl text-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold tracking-tight">Painel de Teste de Usabilidade</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-emerald-400 text-sm font-bold bg-slate-800 px-2.5 py-1 rounded-lg">
          <Timer className="w-3.5 h-3.5" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setElapsedSeconds(0);
              onResetSession();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            title="Zerar Cronômetro e Sessão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Etapa atual: <span className="text-emerald-400 font-semibold">{currentNodeTitle}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Etapas Percorridas</p>
            <p className="text-base font-bold font-mono">{stepsCount}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Fallbacks / Desvios</p>
            <p className="text-base font-bold font-mono">{fallbackCount}</p>
          </div>
        </div>
      </div>

      {/* Participant & Task Form */}
      <div className="space-y-2">
        <div>
          <label className="text-[10.5px] text-slate-400 flex items-center gap-1 mb-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>Nome do Participante / ID:</span>
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[10.5px] text-slate-400 flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-slate-400" />
            <span>Roteiro / Tarefa Proposta:</span>
          </label>
          <textarea
            rows={2}
            value={taskGoal}
            onChange={(e) => setTaskGoal(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500 resize-none"
          />
        </div>
      </div>

      {/* Live Researcher Notes */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-[10.5px] text-slate-400 mb-1">
          Anotações de Observação (Dúvidas, hesitações, feedbacks):
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: O participante hesitou ao escolher a data; preferiu clicar nos botões rápidos em vez de digitar..."
          className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500 resize-none"
        />
      </div>

      {/* Export Action */}
      <button
        type="button"
        onClick={handleExportReport}
        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Exportar Relatório do Teste (.MD)</span>
      </button>
    </div>
  );
};
