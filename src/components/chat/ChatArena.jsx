import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatArena = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-24 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto flex flex-col">

        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <span className="text-2xl">🏏</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Welcome to Cricmind</h2>
            <p>Ask a question to query the PostgreSQL database.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}

        {isLoading && (
          <div className="flex w-full justify-start mb-6 animate-pulse">
            <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3 shrink-0 mt-1 border border-emerald-500/30">
              <Bot size={18} />
            </div>
            <div className="max-w-[85%] flex flex-col items-start">
              <div className="px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[46px]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Invisible div to act as a scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatArena;