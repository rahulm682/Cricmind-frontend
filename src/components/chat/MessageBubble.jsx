import React from 'react';
import { User, Bot, Database } from 'lucide-react';
import DataVisualizer from '../data/DataVisualizer';
import DeveloperPanel from '../data/DeveloperPanel';


const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>

      {!isUser && (
        <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3 shrink-0 mt-1 border border-emerald-500/30">
          <Bot size={18} />
        </div>
      )}

      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

        <div
          className={`px-5 py-3 rounded-2xl ${isUser
            ? 'bg-slate-800 text-slate-200 rounded-tr-sm border border-slate-700'
            : 'bg-transparent text-slate-300'
            }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>

        {!isUser && message.data && message.data.length > 0 && (
          <DataVisualizer data={message.data} />
        )}

        {!isUser && message.sql_used && (
          <DeveloperPanel message={message} />
        )}

      </div>

      {isUser && (
        <div className="w-8 h-8 rounded bg-slate-800 text-slate-400 flex items-center justify-center ml-3 shrink-0 mt-1 border border-slate-700">
          <User size={18} />
        </div>
      )}

    </div>
  );
};

export default MessageBubble;
