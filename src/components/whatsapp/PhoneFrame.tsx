import React from 'react';
import { Wifi, Battery } from 'lucide-react';
import { ThemeMode } from '../../types/chat';

interface PhoneFrameProps {
  children: React.ReactNode;
  theme: ThemeMode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, theme }) => {
  const isDark = theme === 'dark';
  const now = new Date();
  const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="relative mx-auto flex items-center justify-center p-2 sm:p-4">
      {/* Smartphone Outer Chassis with Shadow and Bezel */}
      <div
        className={`relative w-[380px] sm:w-[410px] h-[780px] sm:h-[820px] rounded-[50px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] border-[4px] border-[#2A2B2E] transition-colors flex flex-col overflow-hidden ${
          isDark ? 'bg-[#1C1D21]' : 'bg-[#2B2D31]'
        }`}
      >
        {/* Hardware side buttons */}
        <div className="absolute -left-[14px] top-[110px] w-[4px] h-[28px] bg-[#3A3C42] rounded-l-md" />
        <div className="absolute -left-[14px] top-[150px] w-[4px] h-[50px] bg-[#3A3C42] rounded-l-md" />
        <div className="absolute -left-[14px] top-[210px] w-[4px] h-[50px] bg-[#3A3C42] rounded-l-md" />
        <div className="absolute -right-[14px] top-[140px] w-[4px] h-[70px] bg-[#3A3C42] rounded-r-md" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden flex flex-col bg-black">
          {/* Status Bar */}
          <div
            className={`relative z-30 h-10 px-6 flex items-center justify-between text-xs select-none transition-colors ${
              isDark ? 'bg-[#202C33] text-white' : 'bg-[#F0F2F5] text-slate-800'
            }`}
          >
            {/* Clock */}
            <span className="font-semibold tracking-tight text-[13px]">{timeFormatted}</span>

            {/* Dynamic Island / Camera Notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-700/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#080808]" />
            </div>

            {/* Signal & Battery icons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4" />
                <span className="text-[10px] font-mono">98%</span>
              </div>
            </div>
          </div>

          {/* Chat Application View */}
          <div className="flex-1 w-full relative overflow-hidden flex flex-col">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div
            className={`relative z-30 h-5 w-full flex items-center justify-center transition-colors ${
              isDark ? 'bg-[#202C33]' : 'bg-[#F0F2F5]'
            }`}
          >
            <div className="w-32 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
