import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { PlusCircle, Sparkles, MessageSquare, Database, Newspaper, User, Trash2, Activity, LogOut } from 'lucide-react';

const Sidebar = ({ chats, activeChatId, onNewChat, onSelectChat, onPromptSelect, onNavigate, onDeleteChat }) => {
  const location = useLocation();
  const isNewsTab = location.pathname === '/news';
  const isChatTab = location.pathname === '/';
  const isPlayerTab = location.pathname === '/players';
  const isLiveTab = location.pathname === '/live';

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const suggestedPrompts = [
    "Give me a batting summary for Rohit Sharma",
    "Compare the economy rate of Jasprit Bumrah and Rashid Khan",
    "Which team has won the most IPL trophies?"
  ];

  return (
    <div className="flex flex-col h-full p-4">

      <div className="flex flex-col space-y-2 pb-6 border-b border-slate-800 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className={`flex items-center gap-3 w-full text-left p-2.5 text-sm font-medium rounded-lg transition-colors ${isChatTab ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
        >
          <Database size={16} /> Data Analyst
        </button>
        <button
          onClick={() => onNavigate('/news')}
          className={`flex items-center gap-3 w-full text-left p-2.5 text-sm font-medium rounded-lg transition-colors ${isNewsTab ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
        >
          <Newspaper size={16} /> News Desk
        </button>
        <button
          onClick={() => onNavigate('/live')}
          className={`flex items-center justify-between w-full text-left p-2.5 text-sm font-medium rounded-lg transition-colors ${isLiveTab ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
        >
          <div className="flex items-center gap-3">
            <Activity size={16} className={isLiveTab ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
            Live Center
          </div>
        </button>
        <button
          onClick={() => onNavigate('/players')}
          className={`flex items-center gap-3 w-full text-left p-2.5 text-sm font-medium rounded-lg transition-colors ${isPlayerTab ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
        >
          <User size={16} /> Player Intelligence
        </button>
      </div>

      {isChatTab && (
        <div className="flex flex-col flex-1 overflow-hidden space-y-6">

          <button
            onClick={onNewChat}
            className="w-full py-2.5 px-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <PlusCircle size={18} />
            New Analysis
          </button>

          {!activeChatId && (
            <div className="flex flex-col space-y-2 shrink-0">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-emerald-500" />
                The Playbook
              </div>
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onPromptSelect(prompt)}
                  className="text-left p-2.5 text-sm text-slate-300 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:border-emerald-500/30 transition-all truncate"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col space-y-2 flex-1 overflow-hidden pt-2 border-slate-800">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1 shrink-0">
              <MessageSquare size={14} className="text-blue-400" />
              Chat History
            </div>

            {chats.length === 0 ? (
              <div className="text-sm text-slate-600 italic px-2">No past queries yet.</div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {chats.map((chat) => (
                  <div key={chat.id} className="group relative flex items-center">
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className={`flex-1 text-left p-2.5 pr-8 text-sm flex items-center gap-2 truncate rounded-lg transition-colors ${activeChatId === chat.id
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                        }`}
                      title={chat.title}
                    >
                      <span className="truncate">{chat.title}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteChat) onDeleteChat(chat.id);
                      }}
                      className={`absolute right-2 p-1.5 rounded-md transition-all duration-200 
                      opacity-0 group-hover:opacity-100 focus:opacity-100
                      ${activeChatId === chat.id ? 'text-emerald-500/70 hover:text-red-400 hover:bg-slate-700' : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'}
                    `}
                      title="Delete Analysis"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-auto w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>

    </div>
  );
};

export default Sidebar;

