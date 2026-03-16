import React, { useState } from 'react';
import { Menu, X, Activity } from 'lucide-react';

const MainLayout = ({ sidebarContent, chatContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

      <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-50 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
          >
            {isSidebarOpen ? <X size={20} className="md:hidden" /> : <Menu size={20} className="md:hidden" />}
            <Menu size={20} className="hidden md:block" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400">
            <Activity size={24} />
            <h1 className="text-xl font-bold tracking-wider">CRICMIND</h1>
          </div>
        </div>

        <span className="hidden md:block text-sm font-medium text-slate-500">
          AI Data Analytics Dashboard
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            absolute md:relative z-40 h-full bg-slate-900 border-slate-800 
            transition-all duration-300 ease-in-out flex flex-col overflow-hidden shrink-0
            ${isSidebarOpen
              ? 'w-72 translate-x-0 border-r'
              : 'w-72 md:w-0 -translate-x-full md:translate-x-0 border-none'
            }
          `}
        >
          <div className="flex-1 overflow-y-auto w-72 pt-4">
            {sidebarContent}
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full relative w-full transition-all duration-300 min-w-0 bg-slate-950">
          <div className="flex-1 overflow-hidden">
            {chatContent}
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
