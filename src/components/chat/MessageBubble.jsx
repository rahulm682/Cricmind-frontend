import React from 'react';
import { User, Bot } from 'lucide-react';
import DataVisualizer from '../data/DataVisualizer';


const BotAvatar = () => (
  <div className="shrink-0 mt-1 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-sm shadow-emerald-900/20">
    <Bot size={15} className="text-emerald-400" />
  </div>
);

const UserAvatar = () => (
  <div className="shrink-0 mt-1 w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center">
    <User size={15} className="text-slate-400" />
  </div>
);


const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-5 gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
        <div className="max-w-[80%] flex flex-col items-end">
          <div className="
            px-4 py-3 rounded-2xl rounded-tr-sm
            bg-gradient-to-br from-emerald-950/60 to-slate-900
            border border-emerald-900/50
            text-emerald-50 text-sm leading-relaxed
            shadow-sm
          ">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
        <UserAvatar />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start mb-5 gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <BotAvatar />
      <div className="max-w-[85%] flex flex-col items-start min-w-0">

        <span className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-widest mb-1.5 ml-0.5">
          Cricmind AI
        </span>

        <div className="
          px-4 py-3 rounded-2xl rounded-tl-sm
          bg-slate-900 border border-slate-800/80
          text-slate-200 text-sm leading-relaxed
          shadow-sm
        ">
          <p className="whitespace-pre-wrap">{message.content.trim()}</p>
        </div>

        {message.chart_config && (
          <div className="w-full mt-3">
            <DataVisualizer config={message.chart_config} />
          </div>
        )}

      </div>
    </div>
  );
};

export default MessageBubble;