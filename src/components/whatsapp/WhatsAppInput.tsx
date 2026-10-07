import React, { useState, useRef, useEffect } from 'react';
import {
  Smile,
  Paperclip,
  Mic,
  Send,
  FileText,
  Image as ImageIcon,
  Camera,
  MapPin,
  User,
} from 'lucide-react';
import { ThemeMode } from '../../types/chat';
import { playClickSound, playWhatsAppOutgoingSound } from '../../utils/audio';

interface WhatsAppInputProps {
  onSendMessage: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  theme: ThemeMode;
  suggestedText?: string;
}

export const WhatsAppInput: React.FC<WhatsAppInputProps> = ({
  onSendMessage,
  placeholder = 'Mensagem',
  disabled = false,
  theme,
  suggestedText,
}) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (suggestedText) {
      setText(suggestedText);
      inputRef.current?.focus();
    }
  }, [suggestedText]);

  // Audio recording simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingAudio) {
      timer = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingAudio]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    playWhatsAppOutgoingSound();
    onSendMessage(trimmed);
    setText('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isRecordingAudio) {
      // Finish recording and send audio message
      setIsRecordingAudio(false);
      playWhatsAppOutgoingSound();
      onSendMessage(`🎤 [Áudio gravado · 0:${recordingSeconds.toString().padStart(2, '0')}]`);
    } else {
      playClickSound();
      setIsRecordingAudio(true);
    }
  };

  const quickEmojis = ['👍', '❤️', '😊', '✈️', '🌴', '📅', '🏖️', '🏨', '🙏', '✨', '👋'];

  const attachmentOptions = [
    { label: 'Documento', icon: FileText, color: 'bg-[#7F66FF] text-white' },
    { label: 'Fotos e Vídeos', icon: ImageIcon, color: 'bg-[#007BFC] text-white' },
    { label: 'Câmera', icon: Camera, color: 'bg-[#FF2E74] text-white' },
    { label: 'Localização', icon: MapPin, color: 'bg-[#1FA855] text-white' },
    { label: 'Contato', icon: User, color: 'bg-[#009DE2] text-white' },
  ];

  return (
    <div
      className={`relative z-20 px-2 py-2 flex items-end gap-1.5 select-none transition-colors ${
        theme === 'dark' ? 'bg-[#202C33]' : 'bg-[#F0F2F5]'
      }`}
    >
      {/* Quick Emoji Bar Popup */}
      {showEmojiPicker && (
        <div
          className={`absolute bottom-full left-3 mb-2 p-2 rounded-xl shadow-xl border flex flex-wrap gap-1.5 max-w-[280px] z-30 transition-all ${
            theme === 'dark'
              ? 'bg-[#233138] border-[#222E35]'
              : 'bg-white border-[#E9EDEF]'
          }`}
        >
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setText((prev) => prev + emoji);
                inputRef.current?.focus();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-lg transition-transform active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Tray Popup */}
      {showAttachmentMenu && (
        <div
          className={`absolute bottom-full left-10 mb-2 p-2 rounded-2xl shadow-2xl border flex flex-col gap-1 z-30 min-w-[180px] transition-all animate-in slide-in-from-bottom-2 ${
            theme === 'dark'
              ? 'bg-[#233138] border-[#222E35]'
              : 'bg-white border-[#E9EDEF]'
          }`}
        >
          {attachmentOptions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setShowAttachmentMenu(false);
                playWhatsAppOutgoingSound();
                onSendMessage(`📎 [Enviou anexo: ${item.label}]`);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.color}`}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input Capsule */}
      <div
        className={`flex-1 flex items-center rounded-3xl px-3 py-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] border transition-all ${
          theme === 'dark'
            ? 'bg-[#2A3942] border-[#2A3942] text-[#E9EDEF]'
            : 'bg-white border-white text-[#111B21]'
        }`}
      >
        {isRecordingAudio ? (
          <div className="flex-1 flex items-center gap-2 py-1 text-red-500 animate-pulse font-medium text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Gravando áudio... 0:{recordingSeconds.toString().padStart(2, '0')}</span>
            <button
              type="button"
              onClick={() => setIsRecordingAudio(false)}
              className="ml-auto text-[11px] text-slate-500 underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowAttachmentMenu(false);
              }}
              className="p-1 text-[#54656F] dark:text-[#8696A0] hover:text-inherit rounded-full transition-colors"
              title="Emojis"
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={text}
              disabled={disabled}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? 'Aguardando assistente...' : placeholder}
              className="flex-1 bg-transparent px-2.5 py-1 text-[14.5px] leading-snug focus:outline-hidden placeholder:text-[#8696A0] dark:placeholder:text-[#8696A0]"
            />

            <button
              type="button"
              onClick={() => {
                setShowAttachmentMenu(!showAttachmentMenu);
                setShowEmojiPicker(false);
              }}
              className="p-1 text-[#54656F] dark:text-[#8696A0] hover:text-inherit rounded-full transition-colors"
              title="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5 -rotate-45" />
            </button>
          </>
        )}
      </div>

      {/* Right Voice/Send Circle Button */}
      {text.trim().length > 0 ? (
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled}
          className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008f70] text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          title="Enviar Mensagem"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleMicClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 ${
            isRecordingAudio
              ? 'bg-red-500 text-white animate-bounce'
              : 'bg-[#00A884] hover:bg-[#008f70] text-white'
          }`}
          title={isRecordingAudio ? 'Enviar Áudio' : 'Gravar Áudio'}
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
