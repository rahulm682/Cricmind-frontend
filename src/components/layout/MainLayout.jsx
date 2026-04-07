import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

const CricketBallIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#059669" />
    <circle cx="12" cy="12" r="10" stroke="#047857" strokeWidth="1" />
    <path d="M12 2 C8 6, 8 18, 12 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
    <path d="M12 2 C16 6, 16 18, 12 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
    <path d="M6.5 7.5 C8.5 8.5, 9.5 9.5, 9 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M17.5 7.5 C15.5 8.5, 14.5 9.5, 15 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M6.5 16.5 C8.5 15.5, 9.5 14.5, 9 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M17.5 16.5 C15.5 15.5, 14.5 14.5, 15 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

const MainLayout = ({ sidebarContent, chatContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

      <header className="relative flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900 z-50 shrink-0">

        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3">

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all duration-150"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 shadow-sm shadow-emerald-900/30">
              <CricketBallIcon size={18} />
            </div>

            <div className="flex items-baseline gap-0">
              <span className="text-lg font-black tracking-widest text-slate-100 leading-none">
                CRIC
              </span>
              <span className="text-lg font-black tracking-widest text-emerald-400 leading-none">
                MIND
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 text-xs text-slate-500 bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI Cricket Analytics (IPL)
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase bg-slate-800/50 border border-slate-700/40 rounded px-2 py-1">
            Beta
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            absolute md:relative z-40 h-full
            bg-slate-900 
            transition-all duration-300 ease-in-out 
            flex flex-col overflow-hidden shrink-0
            ${isSidebarOpen
              ? 'w-64 translate-x-0 border-r border-slate-800/80'
              : 'w-64 md:w-0 -translate-x-full md:translate-x-0 border-none'
            }
          `}
        >
          <div className="flex-1 overflow-y-auto w-64 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {sidebarContent}
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full relative min-w-0 bg-slate-950 transition-all duration-300">
          <div className="flex-1 overflow-hidden">
            {chatContent}
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;