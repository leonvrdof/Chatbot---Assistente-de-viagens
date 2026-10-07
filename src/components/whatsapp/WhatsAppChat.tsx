import React, { useState, useEffect, useRef } from 'react';
import { Lock, Star, ChevronRight, UserCheck } from 'lucide-react';
import {
  FlowDefinition,
  FlowNode,
  ChatMessage,
  FlowOption,
  ThemeMode,
  UsabilityMetricLog,
} from '../../types/chat';
import { WhatsAppHeader } from './WhatsAppHeader';
import { WhatsAppBubble } from './WhatsAppBubble';
import { WhatsAppQuickReplies } from './WhatsAppQuickReplies';
import { WhatsAppListModal } from './WhatsAppListModal';
import { WhatsAppInput } from './WhatsAppInput';
import { WhatsAppDoodleBackground } from './WhatsAppDoodleBackground';
import { playWhatsAppIncomingSound, playClickSound } from '../../utils/audio';
import {
  validateDestination,
  getPasseiosForDestino,
  getHospedagensForDestino,
  getLodgingPreferenceConfig,
  getHospedagensForDestinoAndPreference,
} from '../../utils/destinations';
import {
  lookupContact,
  normalizePhone,
} from '../../utils/contacts';
import {
  parseTravelDates,
} from '../../utils/dates';
import {
  getRecommendations,
  getPagedRecommendations,
  formatRecommendationsMarkdown,
  DESTINATION_CATALOG,
} from '../../utils/recommendations';

interface WhatsAppChatProps {
  flow: FlowDefinition;
  currentNodeId: string;
  onNodeTransition: (targetNodeId: string, userText: string, option?: FlowOption) => void;
  onReset: () => void;
  onOpenFlowViewer: () => void;
  onOpenFlowEditor: () => void;
  theme: ThemeMode;
  showDesignerDebug?: boolean;
  onLogMetric?: (log: Omit<UsabilityMetricLog, 'id' | 'timestamp'>) => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  flow,
  currentNodeId,
  onNodeTransition,
  onReset,
  onOpenFlowViewer,
  onOpenFlowEditor,
  theme,
  showDesignerDebug = false,
  onLogMetric,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const initialTours = getPasseiosForDestino('Porto de Galinhas');
  const initialHosp = getHospedagensForDestino('Porto de Galinhas');
  const defaultColdRecs = DESTINATION_CATALOG.filter((d) => d.climateType === 'frio' && !d.isBeach && d.scope === 'internacional');
  const [userVariables, setUserVariables] = useState<Record<string, string>>({
    nome: 'Viajante',
    nome_usuario: 'Leonardo',
    userName: 'Viajante',
    destino: 'Porto de Galinhas',
    'destino 1': defaultColdRecs[0]?.displayTitle || 'Ushuaia — Argentina',
    'destino 2': defaultColdRecs[1]?.displayTitle || 'Reykjavik — Islândia',
    sugestoes_offset: '2',
    preferencia_clima: 'frio',
    preferencia_estilo: 'natureza',
    preferencia_praia: 'nao',
    preferencia_escopo: 'internacional',
    data_ida: '12/11/2026',
    data_volta: '20/11/2026',
    quantidade_pessoas: '4',
    'hospedagem 1': initialHosp.hospedagem_1,
    'hospedagem 2': initialHosp.hospedagem_2,
    'passeio 1': initialTours.passeio_1,
    'passeio 2': initialTours.passeio_2,
    passeio_1: initialTours.passeio_1,
    passeio_2: initialTours.passeio_2,
    passeio_escolhido: initialTours.passeio_1,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentNode: FlowNode = flow.nodes[currentNodeId] || flow.nodes[flow.startNodeId];

  // Helper to format text with dynamic user variables like {{nome}}, {{destino}}, {{passeio 1}}
  const interpolateVariables = (text: string) => {
    return text.replace(/\{\{([^}]+)\}\}/g, (_, rawKey) => {
      const key = rawKey.trim();
      if (userVariables[key] !== undefined) {
        return userVariables[key];
      }
      if (key === 'nome_usuario' || key === 'nome' || key === 'userName') {
        return userVariables.nome_usuario || userVariables.nome || userVariables.userName || 'Leonardo';
      }
      if (key === 'destino') return userVariables.destino || 'Porto de Galinhas';
      if (key === 'detalhes_sugestoes') {
        return userVariables.detalhes_sugestoes || `${userVariables['destino 1']}\n${userVariables['destino 2']}`;
      }
      if (key === 'destino 1') return userVariables['destino 1'] || 'Porto de Galinhas (PE)';
      if (key === 'destino 2') return userVariables['destino 2'] || 'Gramado & Canela (RS)';
      if (key === 'destino 3') return userVariables['destino 3'] || '';
      if (key === 'data_ida') return userVariables.data_ida || '12/11/2026';
      if (key === 'data_volta') return userVariables.data_volta || '20/11/2026';
      if (key === 'duracao_dias') return userVariables.duracao_dias || '8';
      if (key === 'periodo_extenso') return userVariables.periodo_extenso || '12 a 20 de novembro de 2026';
      if (key === 'estacao_ano') return userVariables.estacao_ano || 'Primavera';
      if (key === 'contexto_climatico') return userVariables.contexto_climatico || 'Período favorável para a viagem.';
      if (key === 'quantidade_pessoas') return userVariables.quantidade_pessoas || '4';
      if (key === 'hospedagem 1') return userVariables['hospedagem 1'] || 'Vivá Porto de Galinhas Resort';
      if (key === 'hospedagem 2') return userVariables['hospedagem 2'] || 'Pousada Recanto dos Corais';
      if (key === 'passeio 1' || key === 'passeio_1') return userVariables['passeio 1'] || initialTours.passeio_1;
      if (key === 'passeio 2' || key === 'passeio_2') return userVariables['passeio 2'] || initialTours.passeio_2;
      if (key === 'passeio_escolhido' || key === 'passeio escolhido') return userVariables.passeio_escolhido || initialTours.passeio_1;
      return key;
    });
  };

  // Scroll to bottom smoothly
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  // When node changes, trigger simulated typing and load bot messages
  useEffect(() => {
    if (!currentNode) return;

    setIsTyping(true);
    const delay = currentNode.delayMs || 700;

    const timer = setTimeout(() => {
      setIsTyping(false);

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Build processed message parts with variables
      let partsSource = currentNode.messages;
      if (currentNode.id === 'node_hospedagem_abertura') {
        const lodgingConfig = getLodgingPreferenceConfig(userVariables.destino || '');
        partsSource = [
          { type: 'text', text: lodgingConfig.questionText },
          { type: 'text', text: lodgingConfig.subText },
        ];
      }

      const processedParts = partsSource.map((m) => ({
        ...m,
        text: m.text ? interpolateVariables(m.text) : undefined,
        caption: m.caption ? interpolateVariables(m.caption) : undefined,
      }));

      // Emit each part as its own authentic WhatsApp speech bubble
      const newBotMessages: ChatMessage[] = processedParts.map((part, pIdx) => ({
        id: `bot-${Date.now()}-${pIdx}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'bot',
        parts: [part],
        timestamp: timeStr,
        status: 'read',
        nodeId: currentNode.id,
      }));

      setMessages((prev) => [...prev, ...newBotMessages]);
      playWhatsAppIncomingSound();
      scrollToBottom();

      onLogMetric?.({
        type: 'node_visited',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [currentNodeId, flow]);

  // Interpolate options titles and descriptions (dynamically adapted for node_hospedagem_abertura)
  const rawOptions =
    currentNode.id === 'node_hospedagem_abertura'
      ? getLodgingPreferenceConfig(userVariables.destino || '').options
      : currentNode.options || [];

  const interpolatedOptions = rawOptions.map((opt) => ({
    ...opt,
    title: interpolateVariables(opt.title),
    description: opt.description ? interpolateVariables(opt.description) : undefined,
  }));

  // Handle Quick Reply selection
  const handleSelectQuickReply = (option: FlowOption) => {
    if (isTyping) return;

    const resolvedTitle = interpolateVariables(option.title);

    // Dynamic lodging location preference selection
    if (currentNode.id === 'node_hospedagem_abertura') {
      const newHosp = getHospedagensForDestinoAndPreference(userVariables.destino || '', resolvedTitle);
      setUserVariables((prev) => ({
        ...prev,
        preferencia_hospedagem: resolvedTitle,
        'hospedagem 1': newHosp.hospedagem_1,
        'hospedagem 2': newHosp.hospedagem_2,
      }));
    }

    // 05A: Sugestões — Calor / Frio
    if (currentNode.id === 'node_sugestoes_calor_frio') {
      let climaVal: 'calor' | 'frio' | undefined = undefined;
      if (option.id === 'opt_clima_calor') climaVal = 'calor';
      else if (option.id === 'opt_clima_frio') climaVal = 'frio';
      setUserVariables((prev) => ({
        ...prev,
        preferencia_clima: climaVal || 'tanto_faz',
      }));
    }

    // 05B: Sugestões — Estilo de Destino
    if (currentNode.id === 'node_sugestoes_estilo') {
      let estiloVal: 'praia' | 'natureza' | 'historica' = 'natureza';
      let querPraia = false;
      if (option.id === 'opt_est_praia') {
        estiloVal = 'praia';
        querPraia = true;
      } else if (option.id === 'opt_est_natureza') {
        estiloVal = 'natureza';
        querPraia = false;
      } else if (option.id === 'opt_est_historica') {
        estiloVal = 'historica';
        querPraia = false;
      }
      setUserVariables((prev) => ({
        ...prev,
        preferencia_estilo: estiloVal,
        preferencia_praia: querPraia ? 'sim' : 'nao',
      }));
    }

    // 05C: Sugestões — Nacional / Internacional
    if (currentNode.id === 'node_sugestoes_nacional_internacional') {
      const escopoVal: 'nacional' | 'internacional' = option.id === 'opt_escopo_internacional' ? 'internacional' : 'nacional';
      const climaPref = userVariables.preferencia_clima === 'frio' ? 'frio' : userVariables.preferencia_clima === 'calor' ? 'calor' : undefined;
      const querPraiaPref = userVariables.preferencia_praia === 'sim';
      const estiloPref = (userVariables.preferencia_estilo as any) || undefined;

      const paged = getPagedRecommendations(
        {
          clima: climaPref,
          escopo: escopoVal,
          querPraia: querPraiaPref,
          estilo: estiloPref,
        },
        0,
        2
      );

      const dest1 = paged.destinations[0]?.displayTitle || (escopoVal === 'internacional' ? 'Ushuaia — Argentina' : 'Gramado & Canela — Brasil');
      const dest2 = paged.destinations[1]?.displayTitle || (escopoVal === 'internacional' ? 'Reykjavik — Islândia' : 'Campos do Jordão — Brasil');

      setUserVariables((prev) => ({
        ...prev,
        preferencia_escopo: escopoVal,
        sugestoes_offset: '2',
        'destino 1': dest1,
        'destino 2': dest2,
        destino_1: dest1,
        destino_2: dest2,
      }));
    }

    // 05D: "Quero outras sugestões" Pagination
    if (option.id === 'opt_sug_outras' || option.title.includes('outras sugestões')) {
      const currentOffset = parseInt(userVariables.sugestoes_offset || '2', 10);
      const climaPref = userVariables.preferencia_clima === 'frio' ? 'frio' : userVariables.preferencia_clima === 'calor' ? 'calor' : undefined;
      const querPraiaPref = userVariables.preferencia_praia === 'sim';
      const escopoVal = (userVariables.preferencia_escopo as any) || 'internacional';
      const estiloPref = (userVariables.preferencia_estilo as any) || undefined;

      const paged = getPagedRecommendations(
        {
          clima: climaPref,
          escopo: escopoVal,
          querPraia: querPraiaPref,
          estilo: estiloPref,
        },
        currentOffset,
        2
      );

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        sender: 'user',
        parts: [{ type: 'text', text: resolvedTitle }],
        timestamp: timeStr,
        status: 'read',
        isQuickReplyAction: true,
      };
      setMessages((prev) => [...prev, userMsg]);
      scrollToBottom();

      onLogMetric?.({
        type: 'option_selected',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: resolvedTitle,
      });

      if (paged.destinations.length >= 2) {
        const dest1 = paged.destinations[0].displayTitle;
        const dest2 = paged.destinations[1].displayTitle;

        setUserVariables((prev) => ({
          ...prev,
          sugestoes_offset: `${paged.nextOffset}`,
          'destino 1': dest1,
          'destino 2': dest2,
          destino_1: dest1,
          destino_2: dest2,
        }));

        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const botMsg1: ChatMessage = {
            id: `bot-${Date.now()}-1`,
            sender: 'bot',
            parts: [{
              type: 'text',
              text: `Com base no que você me contou, separei algumas sugestões de destino:\n\n*1. ${dest1}*\n*2. ${dest2}*`,
            }],
            timestamp: timeStr,
            status: 'read',
          };
          const botMsg2: ChatMessage = {
            id: `bot-${Date.now()}-2`,
            sender: 'bot',
            parts: [{
              type: 'text',
              text: 'Qual você prefere?',
            }],
            timestamp: timeStr,
            status: 'read',
          };
          setMessages((prev) => [...prev, botMsg1, botMsg2]);
          playWhatsAppIncomingSound();
          scrollToBottom();
        }, 700);
        return;
      } else {
        // Caso não existam outras opções compatíveis
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const noMoreMsg: ChatMessage = {
            id: `bot-no-more-${Date.now()}`,
            sender: 'bot',
            parts: [{
              type: 'text',
              text: 'Não encontrei outras opções compatíveis no momento com esses critérios. Você gostaria de flexibilizar alguma preferência?',
            }],
            timestamp: timeStr,
            status: 'read',
          };
          setMessages((prev) => [...prev, noMoreMsg]);
          playWhatsAppIncomingSound();
          scrollToBottom();
          setUserVariables((prev) => ({ ...prev, sugestoes_offset: '0' }));
        }, 700);
        return;
      }
    }

    // Save variable if chosen option represents a destination, lodging or tour
    if (option.title.includes('{{destino 1}}') || option.id.includes('dest_1')) {
      const rawDest = userVariables['destino 1'] || 'Ushuaia';
      const cleanDest = rawDest.replace(/^\d+\.\s*/, '').replace(/\s*—.*$/, '').replace(/\s*\(.*?\)/, '').trim();
      const newTours = getPasseiosForDestino(cleanDest);
      const newHosp = getHospedagensForDestino(cleanDest);
      setUserVariables((prev) => ({
        ...prev,
        destino: cleanDest,
        'hospedagem 1': newHosp.hospedagem_1,
        'hospedagem 2': newHosp.hospedagem_2,
        'passeio 1': newTours.passeio_1,
        'passeio 2': newTours.passeio_2,
        passeio_1: newTours.passeio_1,
        passeio_2: newTours.passeio_2,
        passeio_escolhido: newTours.passeio_1,
      }));
    } else if (option.title.includes('{{destino 2}}') || option.id.includes('dest_2')) {
      const rawDest = userVariables['destino 2'] || 'Reykjavik';
      const cleanDest = rawDest.replace(/^\d+\.\s*/, '').replace(/\s*—.*$/, '').replace(/\s*\(.*?\)/, '').trim();
      const newTours = getPasseiosForDestino(cleanDest);
      const newHosp = getHospedagensForDestino(cleanDest);
      setUserVariables((prev) => ({
        ...prev,
        destino: cleanDest,
        'hospedagem 1': newHosp.hospedagem_1,
        'hospedagem 2': newHosp.hospedagem_2,
        'passeio 1': newTours.passeio_1,
        'passeio 2': newTours.passeio_2,
        passeio_1: newTours.passeio_1,
        passeio_2: newTours.passeio_2,
        passeio_escolhido: newTours.passeio_1,
      }));
    } else if (option.title.includes('{{passeio 1}}') || option.id === 'opt_passeio_1') {
      setUserVariables((prev) => ({ ...prev, passeio_escolhido: prev['passeio 1'] || resolvedTitle }));
    } else if (option.title.includes('{{passeio 2}}') || option.id === 'opt_passeio_2') {
      setUserVariables((prev) => ({ ...prev, passeio_escolhido: prev['passeio 2'] || resolvedTitle }));
    } else if (option.id === 'opt_passeio_outras') {
      const newTours = getPasseiosForDestino(userVariables.destino || '');
      setUserVariables((prev) => ({ ...prev, passeio_escolhido: newTours.outras }));
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Add user message to chat
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      parts: [{ type: 'text', text: resolvedTitle }],
      timestamp: timeStr,
      status: 'read',
      isQuickReplyAction: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    onLogMetric?.({
      type: 'option_selected',
      nodeId: currentNode.id,
      nodeTitle: currentNode.title,
      userInput: resolvedTitle,
    });

    onNodeTransition(option.nextNodeId, resolvedTitle, option);
  };

  // Handle free text or typed input
  const handleUserSendMessage = (text: string) => {
    if (isTyping) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      parts: [{ type: 'text', text }],
      timestamp: timeStr,
      status: 'read',
    };

    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    // Specific telephone validation & database contact lookup
    if (currentNode.id === 'node_cadastro_pedir_telefone' || currentNode.id === 'node_cadastro_criar_novo') {
      const normalized = normalizePhone(text);

      // Validate that digits were provided (at least 8 digits)
      if (!normalized || normalized.length < 8) {
        onLogMetric?.({
          type: 'fallback_triggered',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Telefone inválido: ${text}`,
        });

        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const fallbackText =
            currentNode.fallbackMessage ||
            'Não consegui reconhecer esse número.\n\nPode enviar novamente, apenas com os números e o DDD?\n\n_Exemplo:_ _11992483496_';

          const fallbackMsg: ChatMessage = {
            id: `bot-fallback-${Date.now()}`,
            sender: 'bot',
            parts: [{ type: 'text', text: fallbackText }],
            timestamp: timeStr,
            status: 'read',
          };
          setMessages((prev) => [...prev, fallbackMsg]);
          playWhatsAppIncomingSound();
          scrollToBottom();
        }, 600);
        return;
      }

      // Query registered contacts database
      const contact = lookupContact(normalized);

      if (contact) {
        // SIM: Número encontrado na base de dados!
        // Recuperar {{nome_usuario}} e identificar como contato recorrente.
        // NUNCA pedir novamente o nome de um usuário que já tenha sido identificado pela base!
        setUserVariables((prev) => ({
          ...prev,
          nome_usuario: contact.name,
          nome: contact.name,
          userName: contact.name,
          telefone: contact.phone,
          userPhone: contact.phone,
          userStatus: contact.status,
        }));

        onLogMetric?.({
          type: 'free_text',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Telefone ${normalized} -> Encontrado: ${contact.name} (Status: Contato recorrente)`,
        });

        // Transição imediata para node_cadastro_reconhecido
        onNodeTransition('node_cadastro_reconhecido', text);
        return;
      } else {
        // NÃO: Número NÃO encontrado na base!
        // Identificar como novo usuário -> iniciar fluxo de cadastro.
        setUserVariables((prev) => ({
          ...prev,
          telefone: normalized,
          userPhone: normalized,
          userStatus: 'Novo contato',
        }));

        onLogMetric?.({
          type: 'free_text',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Telefone ${normalized} -> Não encontrado (Status: Novo contato)`,
        });

        if (currentNode.id === 'node_cadastro_criar_novo') {
          onNodeTransition('node_cadastro_criado', text);
        } else {
          onNodeTransition('node_cadastro_verificando', text);
        }
        return;
      }
    }

    // Specific destination validation for node_destino_definido
    if (currentNode.id === 'node_destino_definido') {
      const validation = validateDestination(text);
      if (validation.isValid && validation.destinationName) {
        const validatedDest = validation.destinationName;
        const newTours = getPasseiosForDestino(validatedDest);
        const newHosp = getHospedagensForDestino(validatedDest);

        setUserVariables((prev) => ({
          ...prev,
          destino: validatedDest,
          'hospedagem 1': newHosp.hospedagem_1,
          'hospedagem 2': newHosp.hospedagem_2,
          'passeio 1': newTours.passeio_1,
          'passeio 2': newTours.passeio_2,
          passeio_1: newTours.passeio_1,
          passeio_2: newTours.passeio_2,
          passeio_escolhido: newTours.passeio_1,
        }));

        onLogMetric?.({
          type: 'free_text',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Destino validado: ${validatedDest}`,
        });

        // Advance to 06A. Sobre a Viagem — Datas
        onNodeTransition('node_sobre_viagem_abertura', text);
        return;
      } else {
        // Destination does not exist, cannot be identified or is insufficient:
        // Do NOT advance in flow! Transition to node_destino_erro with exact error phraseology
        onLogMetric?.({
          type: 'fallback_triggered',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Destino não reconhecido: ${text}`,
        });

        onNodeTransition('node_destino_erro', text);
        return;
      }
    }

    // If user is in node_destino_erro and types free text
    if (currentNode.id === 'node_destino_erro') {
      const validation = validateDestination(text);
      if (validation.isValid && validation.destinationName) {
        const validatedDest = validation.destinationName;
        const newTours = getPasseiosForDestino(validatedDest);
        const newHosp = getHospedagensForDestino(validatedDest);

        setUserVariables((prev) => ({
          ...prev,
          destino: validatedDest,
          'hospedagem 1': newHosp.hospedagem_1,
          'hospedagem 2': newHosp.hospedagem_2,
          'passeio 1': newTours.passeio_1,
          'passeio 2': newTours.passeio_2,
          passeio_1: newTours.passeio_1,
          passeio_2: newTours.passeio_2,
          passeio_escolhido: newTours.passeio_1,
        }));

        onLogMetric?.({
          type: 'free_text',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Destino validado: ${validatedDest}`,
        });

        onNodeTransition('node_sobre_viagem_abertura', text);
        return;
      }

      // Check if user matched one of the error options (Definir novo destino / Quero saber sugestões)
      const normInput = text.toLowerCase().trim();
      const matchedOpt = currentNode.options?.find((opt) => {
        const titleMatch = opt.title.toLowerCase().includes(normInput) || normInput.includes(opt.title.toLowerCase());
        const kwMatch = opt.keywords?.some((kw) => normInput.includes(kw.toLowerCase()));
        return titleMatch || kwMatch;
      });

      if (matchedOpt) {
        onNodeTransition(matchedOpt.nextNodeId, text, matchedOpt);
        return;
      }

      // If text is not valid and did not match options: do not advance, repeat exact error phraseology
      onLogMetric?.({
        type: 'fallback_triggered',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: `Destino não reconhecido no erro: ${text}`,
      });

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const errorMsg: ChatMessage = {
          id: `bot-fallback-${Date.now()}`,
          sender: 'bot',
          parts: [{ type: 'text', text: 'Não consegui entender para onde deseja viajar. Como deseja continuar?' }],
          timestamp: timeStr,
          status: 'read',
        };
        setMessages((prev) => [...prev, errorMsg]);
        playWhatsAppIncomingSound();
        scrollToBottom();
      }, 600);
      return;
    }

    // Specific destination choice in node_sugestoes_apresentacao
    if (currentNode.id === 'node_sugestoes_apresentacao') {
      const normInput = text.toLowerCase().trim();

      // Check for "Quero outras sugestões"
      if (normInput === '3' || normInput.includes('outras') || normInput.includes('mais')) {
        const fakeOpt: FlowOption = {
          id: 'opt_sug_outras',
          title: '3. Quero outras sugestões',
          nextNodeId: 'node_sugestoes_apresentacao',
        };
        handleSelectQuickReply(fakeOpt);
        return;
      }

      let chosenDestName = '';
      if (normInput === '1' || normInput === 'primeira' || normInput === 'primeiro' || normInput.includes('destino 1')) {
        chosenDestName = userVariables['destino 1'];
      } else if (normInput === '2' || normInput === 'segunda' || normInput === 'segundo' || normInput.includes('destino 2')) {
        chosenDestName = userVariables['destino 2'];
      } else {
        const validation = validateDestination(text);
        if (validation.isValid && validation.destinationName) {
          chosenDestName = validation.destinationName;
        } else if (userVariables['destino 1']?.toLowerCase().includes(normInput)) {
          chosenDestName = userVariables['destino 1'];
        } else if (userVariables['destino 2']?.toLowerCase().includes(normInput)) {
          chosenDestName = userVariables['destino 2'];
        }
      }

      if (chosenDestName) {
        const cleanDest = chosenDestName.replace(/^\d+\.\s*/, '').replace(/\s*—.*$/, '').replace(/\s*\(.*?\)/, '').trim();
        const newTours = getPasseiosForDestino(cleanDest);
        const newHosp = getHospedagensForDestino(cleanDest);

        setUserVariables((prev) => ({
          ...prev,
          destino: cleanDest,
          'hospedagem 1': newHosp.hospedagem_1,
          'hospedagem 2': newHosp.hospedagem_2,
          'passeio 1': newTours.passeio_1,
          'passeio 2': newTours.passeio_2,
          passeio_1: newTours.passeio_1,
          passeio_2: newTours.passeio_2,
          passeio_escolhido: newTours.passeio_1,
        }));

        onLogMetric?.({
          type: 'free_text',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Destino escolhido das sugestões: ${cleanDest}`,
        });

        onNodeTransition('node_sobre_viagem_abertura', text);
        return;
      }
    }

    // Natural language multi-criteria suggestions parsing
    const normText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const mentionsFrio = normText.includes('frio') || normText.includes('inverno') || normText.includes('neve') || normText.includes('gelad');
    const mentionsCalor = normText.includes('calor') || normText.includes('quente') || normText.includes('verao') || normText.includes('sol');
    const mentionsSemPraia = normText.includes('sem praia') || normText.includes('nao praia') || normText.includes('nao quero praia') || normText.includes('sem mar') || normText.includes('natureza') || normText.includes('montanha') || normText.includes('historica');
    const mentionsPraia = !mentionsSemPraia && (normText.includes('com praia') || normText.includes('praia') || normText.includes('litoral') || normText.includes('mar'));
    const mentionsInternacional = normText.includes('internacional') || normText.includes('exterior') || normText.includes('fora do brasil');
    const mentionsNacional = normText.includes('nacional') || normText.includes('brasil') || normText.includes('no brasil');

    const isCombinedCriteria = (mentionsFrio || mentionsCalor) && (mentionsSemPraia || mentionsPraia || mentionsInternacional || mentionsNacional);

    if (isCombinedCriteria || (currentNode.id.startsWith('node_sugestoes_') && (mentionsFrio || mentionsCalor || mentionsSemPraia || mentionsPraia || mentionsInternacional || mentionsNacional))) {
      const climaVal = mentionsFrio ? 'frio' : mentionsCalor ? 'calor' : (userVariables.preferencia_clima as any) || undefined;
      const querPraiaVal = mentionsSemPraia ? false : mentionsPraia ? true : userVariables.preferencia_praia === 'sim';
      const escopoVal = mentionsInternacional ? 'internacional' : mentionsNacional ? 'nacional' : (userVariables.preferencia_escopo as any) || 'internacional';

      const paged = getPagedRecommendations(
        {
          clima: climaVal,
          querPraia: querPraiaVal,
          escopo: escopoVal,
        },
        0,
        2
      );

      const dest1 = paged.destinations[0]?.displayTitle || (escopoVal === 'internacional' ? 'Ushuaia — Argentina' : 'Gramado & Canela — Brasil');
      const dest2 = paged.destinations[1]?.displayTitle || (escopoVal === 'internacional' ? 'Reykjavik — Islândia' : 'Campos do Jordão — Brasil');

      setUserVariables((prev) => ({
        ...prev,
        preferencia_clima: climaVal || 'tanto_faz',
        preferencia_praia: querPraiaVal === false ? 'nao' : 'sim',
        preferencia_escopo: escopoVal || 'internacional',
        sugestoes_offset: '2',
        'destino 1': dest1,
        'destino 2': dest2,
        destino_1: dest1,
        destino_2: dest2,
      }));

      onLogMetric?.({
        type: 'free_text',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: `Critérios cruzados: Clima=${climaVal}, Praia=${querPraiaVal}, Escopo=${escopoVal}`,
      });

      onNodeTransition('node_sugestoes_apresentacao', text);
      return;
    }

    // Specific dates parsing & validation for node_sobre_viagem_abertura
    if (currentNode.id === 'node_sobre_viagem_abertura') {
      const parsedDates = parseTravelDates(text, userVariables.destino || '');

      if (!parsedDates.isValid || !parsedDates.data_ida || !parsedDates.data_volta) {
        onLogMetric?.({
          type: 'fallback_triggered',
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          userInput: `Datas inválidas: ${text}`,
        });

        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const errorMsgText =
            parsedDates.errorMessage ||
            'Não consegui reconhecer as datas de ida e volta.\n\nPode enviar novamente no formato dd/mm/aaaa a dd/mm/aaaa?\n\n_Exemplo:_ _12/11/2026 a 20/11/2026_';

          const fallbackMsg: ChatMessage = {
            id: `bot-fallback-${Date.now()}`,
            sender: 'bot',
            parts: [{ type: 'text', text: errorMsgText }],
            timestamp: timeStr,
            status: 'read',
          };
          setMessages((prev) => [...prev, fallbackMsg]);
          playWhatsAppIncomingSound();
          scrollToBottom();
        }, 600);
        return;
      }

      // Store both dates strictly separate and calculate duration/season/climate
      setUserVariables((prev) => ({
        ...prev,
        data_ida: parsedDates.data_ida!,
        data_volta: parsedDates.data_volta!,
        duracao_dias: `${parsedDates.duracao_dias}`,
        periodo_extenso: parsedDates.periodo_extenso || `${parsedDates.data_ida} a ${parsedDates.data_volta}`,
        estacao_ano: parsedDates.estacao_ano || 'Verão',
        contexto_climatico: parsedDates.contexto_climatico || 'Período favorável para a viagem.',
      }));

      onLogMetric?.({
        type: 'free_text',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: `Ida: ${parsedDates.data_ida}, Volta: ${parsedDates.data_volta} (${parsedDates.duracao_dias} dias - ${parsedDates.estacao_ano})`,
      });

      // Advance to 06B. Sobre a Viagem — Quantidade de Pessoas
      onNodeTransition('node_sobre_viagem_pessoas', text);
      return;
    }

    // Specific lodging location preference for node_hospedagem_abertura
    if (currentNode.id === 'node_hospedagem_abertura') {
      const lodgingConfig = getLodgingPreferenceConfig(userVariables.destino || '');
      const normalizedInput = text.toLowerCase().trim();
      const matched = lodgingConfig.options.find((opt) => {
        const titleMatch = opt.title.toLowerCase().includes(normalizedInput) || normalizedInput.includes(opt.title.toLowerCase());
        const kwMatch = opt.keywords?.some((kw) => normalizedInput.includes(kw.toLowerCase()));
        return titleMatch || kwMatch;
      });

      const selectedOpt = matched || lodgingConfig.options[0];
      const newHosp = getHospedagensForDestinoAndPreference(userVariables.destino || '', selectedOpt.title);
      setUserVariables((prev) => ({
        ...prev,
        preferencia_hospedagem: selectedOpt.title,
        'hospedagem 1': newHosp.hospedagem_1,
        'hospedagem 2': newHosp.hospedagem_2,
      }));

      onLogMetric?.({
        type: 'free_text',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: `Preferência de hospedagem: ${selectedOpt.title}`,
      });

      onNodeTransition('node_hospedagem_apresentacao', text, selectedOpt);
      return;
    }

    // If current node saves a variable (e.g. userName or quantidade_pessoas)
    if (currentNode.variableToSave && currentNode.variableToSave !== 'destino') {
      setUserVariables((prev) => ({
        ...prev,
        [currentNode.variableToSave!]: text,
      }));
    }

    // Check for keyword matching among options
    const normalizedInput = text.toLowerCase().trim();
    let matchedOption = currentNode.options?.find((opt) => {
      const titleMatch = opt.title.toLowerCase().includes(normalizedInput) || normalizedInput.includes(opt.title.toLowerCase());
      const keywordMatch = opt.keywords?.some((kw) => normalizedInput.includes(kw.toLowerCase()));
      return titleMatch || keywordMatch;
    });

    // If no exact match and there is a direct single option (e.g. advance text input)
    if (!matchedOption && currentNode.options && currentNode.options.length === 1) {
      matchedOption = currentNode.options[0];
    }

    if (matchedOption) {
      onLogMetric?.({
        type: 'free_text',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: text,
      });
      onNodeTransition(matchedOption.nextNodeId, text, matchedOption);
    } else {
      // Trigger friendly WhatsApp fallback
      onLogMetric?.({
        type: 'fallback_triggered',
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        userInput: text,
      });

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const fallbackText =
          currentNode.fallbackMessage ||
          'Desculpe, não consegui identificar sua resposta. 🤖\n\nPor favor, toque em uma das opções abaixo ou digite de outra forma para continuarmos:';

        const fallbackMsg: ChatMessage = {
          id: `bot-fallback-${Date.now()}`,
          sender: 'bot',
          parts: [{ type: 'text', text: fallbackText }],
          timestamp: timeStr,
          status: 'read',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        playWhatsAppIncomingSound();
        scrollToBottom();
      }, 600);
    }
  };

  // Reset conversation handler
  const handleReset = () => {
    setMessages([]);
    const defaultTours = getPasseiosForDestino('Porto de Galinhas');
    const defaultHosp = getHospedagensForDestino('Porto de Galinhas');
    setUserVariables({
      nome: 'Viajante',
      userName: 'Viajante',
      destino: 'Porto de Galinhas',
      'destino 1': 'Porto de Galinhas (PE)',
      'destino 2': 'Gramado & Canela (RS)',
      data_ida: '12/11/2026',
      data_volta: '20/11/2026',
      quantidade_pessoas: '4',
      'hospedagem 1': defaultHosp.hospedagem_1,
      'hospedagem 2': defaultHosp.hospedagem_2,
      'passeio 1': defaultTours.passeio_1,
      'passeio 2': defaultTours.passeio_2,
      passeio_1: defaultTours.passeio_1,
      passeio_2: defaultTours.passeio_2,
      passeio_escolhido: defaultTours.passeio_1,
    });
    onReset();
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden select-none font-sans ${
        theme === 'dark' ? 'bg-[#0B141A]' : 'bg-[#EFEAE2]'
      }`}
    >
      {/* WhatsApp Official Top Header */}
      <WhatsAppHeader
        botProfile={flow.botProfile}
        isTyping={isTyping}
        onResetChat={handleReset}
        onOpenFlowViewer={onOpenFlowViewer}
        onOpenFlowEditor={onOpenFlowEditor}
        theme={theme}
      />

      {/* Chat Messages Body with Wallpaper Doodle */}
      <div
        ref={chatContainerRef}
        className="relative flex-1 overflow-y-auto px-1 sm:px-2 py-3 space-y-1.5 scroll-smooth"
      >
        <WhatsAppDoodleBackground theme={theme} />

        {/* End-to-End Encryption Notice Banner */}
        <div className="relative z-10 flex justify-center my-2 px-6">
          <div className="bg-[#FFEECD] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[11px] px-3.5 py-1.5 rounded-lg shadow-xs text-center max-w-sm flex items-center justify-center gap-1.5 border border-amber-200/50 dark:border-amber-900/20">
            <Lock className="w-3 h-3 text-[#008069] dark:text-[#00A884] shrink-0" />
            <span>As mensagens são protegidas com a criptografia de ponta a ponta do WhatsApp.</span>
          </div>
        </div>

        {/* Date separator */}
        <div className="relative z-10 flex justify-center my-2">
          <span className="bg-[#FFFFFF] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[10.5px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs border border-slate-200/50 dark:border-slate-800">
            Hoje
          </span>
        </div>

        {/* Render Conversation Messages */}
        <div className="relative z-10 space-y-1 pb-2">
          {messages.map((msg) => (
            <WhatsAppBubble
              key={msg.id}
              sender={msg.sender}
              parts={msg.parts}
              timestamp={msg.timestamp}
              status={msg.status}
              theme={theme}
              nodeTitle={showDesignerDebug && msg.nodeId ? flow.nodes[msg.nodeId]?.title : undefined}
              showDesignerDebug={showDesignerDebug}
            />
          ))}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div className="flex items-start px-3 my-1">
              <div
                className={`rounded-lg px-3.5 py-2.5 shadow-sm flex items-center gap-1.5 ${
                  theme === 'dark' ? 'bg-[#202C33]' : 'bg-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-[#00A884] animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 rounded-full bg-[#00A884] animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-[#00A884] animate-bounce" />
              </div>
            </div>
          )}

          {/* If node interactiveType is list_message: show trigger button */}
          {!isTyping && currentNode.interactiveType === 'list_message' && (
            <div className="flex justify-start px-3 py-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsListModalOpen(true);
                }}
                className={`py-2.5 px-4 rounded-xl text-[13.5px] font-semibold flex items-center gap-2 shadow-md border transition-all active:scale-[0.98] ${
                  theme === 'dark'
                    ? 'bg-[#202C33] text-[#00A884] border-[#222E35] hover:bg-[#233138]'
                    : 'bg-white text-[#008069] border-[#E9EDEF] hover:bg-slate-50'
                }`}
              >
                <span>{currentNode.listButtonLabel || '📋 Ver Opções'}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {/* If node interactiveType is quick_replies: show WhatsApp action buttons */}
          {!isTyping &&
            currentNode.interactiveType === 'quick_replies' &&
            interpolatedOptions.length > 0 && (
              <WhatsAppQuickReplies
                options={interpolatedOptions}
                onSelect={handleSelectQuickReply}
                disabled={isTyping}
                theme={theme}
              />
            )}

          {/* If node is rating_csat: render 5-star rating */}
          {!isTyping && currentNode.interactiveType === 'rating_csat' && (
            <div className="px-3 py-2">
              <div
                className={`p-3 rounded-xl max-w-xs shadow-sm border ${
                  theme === 'dark' ? 'bg-[#202C33] border-[#222E35]' : 'bg-white border-[#E9EDEF]'
                }`}
              >
                <p className="text-xs font-semibold mb-2.5 text-center text-slate-700 dark:text-slate-300">
                  Avalie sua experiência de 1 a 5 estrelas:
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        const opt = currentNode.options?.[star - 1] || {
                          id: `star_${star}`,
                          title: `Nota ${star} ⭐`,
                          nextNodeId: currentNode.options?.[0]?.nextNodeId || flow.startNodeId,
                        };
                        handleSelectQuickReply(opt);
                      }}
                      className="p-1.5 rounded-lg hover:scale-125 transition-transform text-amber-400 hover:text-amber-500"
                      title={`${star} estrelas`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If node is agent_handoff: show human transfer status */}
          {!isTyping && currentNode.interactiveType === 'agent_handoff' && (
            <div className="px-3 py-2">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100 text-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">{currentNode.agentName || 'Consultor Humano'}</p>
                  <p className="text-[11px] opacity-80">{currentNode.handoffDepartment || 'Atendimento Humanizado'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Bottom Input Bar */}
      <WhatsAppInput
        onSendMessage={handleUserSendMessage}
        placeholder={currentNode.inputPlaceholder || 'Mensagem'}
        disabled={isTyping}
        theme={theme}
      />

      {/* WhatsApp List Message Modal / Bottom Sheet */}
      <WhatsAppListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title={currentNode.listTitle || 'Opções'}
        sections={currentNode.listSections}
        options={currentNode.options}
        onSelectOption={handleSelectQuickReply}
        theme={theme}
      />
    </div>
  );
};
