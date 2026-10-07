import React from 'react';
import { ThemeMode } from '../../types/chat';

interface WhatsAppDoodleBackgroundProps {
  theme: ThemeMode;
}

export const WhatsAppDoodleBackground: React.FC<WhatsAppDoodleBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden transition-colors ${
        isDark ? 'bg-[#0B141A]' : 'bg-[#EFEAE2]'
      }`}
    >
      {/* WhatsApp authentic doodle SVG background pattern */}
      <svg
        className={`w-full h-full object-cover transition-opacity ${
          isDark ? 'opacity-[0.05]' : 'opacity-[0.075]'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="whatsapp-doodle-pattern"
            x="0"
            y="0"
            width="280"
            height="280"
            patternUnits="userSpaceOnUse"
          >
            {/* Coffee cup */}
            <path
              d="M30 40 h20 a6 6 0 0 1 6 6 v10 a10 10 0 0 1 -10 10 h-6 a10 10 0 0 1 -10 -10 v-10 a6 6 0 0 1 6 -6 z M56 46 h4 a4 4 0 0 1 4 4 v2 a4 4 0 0 1 -4 4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Speech bubble */}
            <path
              d="M110 30 h35 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-20 l-8 8 v-8 h-7 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8 z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            {/* Airplane */}
            <path
              d="M210 50 l24 -16 l-8 26 l-10 -4 l-4 8 l-2 -8 z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Clock */}
            <circle cx="50" cy="130" r="14" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M50 122 v8 h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            {/* Heart */}
            <path
              d="M130 115 c-4 -6 -12 -6 -16 0 c-4 6 0 12 16 20 c16 -8 20 -14 16 -20 c-4 -6 -12 -6 -16 0 z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            {/* Star */}
            <polygon
              points="220,115 224,124 234,125 226,132 229,142 220,136 211,142 214,132 206,125 216,124"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Smartphone */}
            <rect x="35" y="195" width="22" height="38" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="46" cy="225" r="1.5" fill="currentColor" />
            <line x1="42" y1="200" x2="50" y2="200" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Compass / Location */}
            <circle cx="130" cy="205" r="12" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M124 211 l12 -12 l-4 6 z" fill="currentColor" />
            {/* Camera */}
            <path
              d="M205 200 h6 l3 -4 h12 l3 4 h6 a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 h-30 a4 4 0 0 1 -4 -4 v-18 a4 4 0 0 1 4 -4 z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="222" cy="213" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#whatsapp-doodle-pattern)"
          className={isDark ? 'text-white' : 'text-[#4A5568]'}
        />
      </svg>
    </div>
  );
};
