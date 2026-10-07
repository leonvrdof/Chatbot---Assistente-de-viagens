/**
 * Types for WhatsApp Conversational Prototype & Usability Testing
 */

export type InteractiveType =
  | 'text_input'
  | 'quick_replies'
  | 'list_message'
  | 'date_selection'
  | 'rating_csat'
  | 'media_confirmation'
  | 'agent_handoff'
  | 'end';

export interface FlowOption {
  id: string;
  title: string;
  description?: string; // Used in list messages
  nextNodeId: string;
  keywords?: string[]; // Natural language synonyms
  badge?: string; // e.g. "Mais rápido", "Recomendado"
}

export interface BotMessagePart {
  type: 'text' | 'image' | 'document' | 'audio' | 'location';
  text?: string;
  mediaUrl?: string;
  mediaTitle?: string;
  mediaSubtitle?: string;
  fileSize?: string;
  audioDuration?: string;
  caption?: string;
}

export interface FlowNode {
  id: string;
  title: string; // Internal name in microflow (e.g. "01. Triagem Inicial")
  category?: string; // Grouping (e.g. "Boas-vindas", "Triagem", "Agendamento")
  messages: BotMessagePart[];
  interactiveType: InteractiveType;
  options?: FlowOption[];
  inputPlaceholder?: string;
  inputType?: 'text' | 'cpf' | 'number' | 'email' | 'date';
  variableToSave?: string; // e.g. "userName", "selectedSpecialty"
  validationRegex?: string;
  validationError?: string;
  fallbackMessage?: string;
  quickReplyOptions?: string[]; // Simplified quick replies if needed
  listButtonLabel?: string; // e.g. "📋 Ver Especialidades Médicas"
  listTitle?: string; // Modal title e.g. "Selecione uma especialidade"
  listSections?: {
    title: string;
    options: FlowOption[];
  }[];
  agentName?: string;
  handoffDepartment?: string;
  delayMs?: number; // Simulated bot typing delay
}

export interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  botProfile: {
    name: string;
    verified: boolean;
    subtitle: string;
    avatarColor: string;
    avatarText: string;
    avatarUrl?: string;
    phone: string;
    category: string;
  };
  startNodeId: string;
  nodes: Record<string, FlowNode>;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  parts: BotMessagePart[];
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  nodeId?: string;
  isQuickReplyAction?: boolean;
}

export interface UsabilityMetricLog {
  id: string;
  timestamp: number;
  type: 'node_visited' | 'option_selected' | 'free_text' | 'fallback_triggered' | 'task_completed';
  nodeId: string;
  nodeTitle: string;
  userInput?: string;
  durationInPreviousNodeSec?: number;
  notes?: string;
}

export interface UsabilitySession {
  startTime: number;
  endTime?: number;
  participantName: string;
  taskGoal: string;
  currentStepIndex: number;
  totalStepsCompleted: number;
  fallbackCount: number;
  pathHistory: string[];
  logs: UsabilityMetricLog[];
  researcherNotes: string;
}

export type ViewportMode = 'mobile' | 'web';
export type ThemeMode = 'light' | 'dark';
