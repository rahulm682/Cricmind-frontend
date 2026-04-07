import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import {
  PlusCircle, Sparkles, MessageSquare, Database,
  Newspaper, User, Trash2, Activity, LogOut, Radio
} from 'lucide-react';


const NavItem = ({ icon: Icon, label, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg
      text-sm font-medium transition-all duration-150 group
      ${isActive
        ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/20'
        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
      }
    `}
  >
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r-full" />
    )}

    <Icon
      size={15}
      className={`shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}
    />
    <span className="flex-1 truncate">{label}</span>

    {badge && badge}
  </button>
);


const LiveBadge = () => (
  <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5 tracking-wider uppercase shrink-0">
    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
    Live
  </span>
);


const SectionLabel = ({ icon: Icon, label, iconClass = 'text-slate-600' }) => (
  <div className="flex items-center gap-1.5 px-1 mb-2">
    {Icon && <Icon size={12} className={iconClass} />}
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
      {label}
    </span>
  </div>
);


const Sidebar = ({ chats, activeChatId, onNewChat, onSelectChat, onPromptSelect, onNavigate, onDeleteChat }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isChatTab = location.pathname === '/';
  const isNewsTab = location.pathname === '/news';
  const isPlayerTab = location.pathname === '/players';
  const isLiveTab = location.pathname === '/live';

  const handleLogout = () => dispatch(logout());

  const suggestedPrompts = [
    "Give me a batting summary for Rohit Sharma",
    "Compare the economy rate of Jasprit Bumrah and Rashid Khan",
    "Which team has won the most IPL trophies?",
  ];

  return (
    <div className="flex flex-col h-full py-4 px-3">

      <div className="space-y-1 pb-4 border-b border-slate-800/80 mb-4">
        <SectionLabel label="Navigation" />

        <NavItem
          icon={Database}
          label="Data Analyst"
          isActive={isChatTab}
          onClick={() => onNavigate('/')}
        />
        <NavItem
          icon={Newspaper}
          label="News Desk"
          isActive={isNewsTab}
          onClick={() => onNavigate('/news')}
        />
        <NavItem
          icon={Radio}
          label="Live Center"
          isActive={isLiveTab}
          onClick={() => onNavigate('/live')}
          badge={<LiveBadge />}
        />
        <NavItem
          icon={User}
          label="Player Intelligence"
          isActive={isPlayerTab}
          onClick={() => onNavigate('/players')}
        />
      </div>

      {isChatTab && (
        <div className="flex flex-col flex-1 overflow-hidden space-y-4">

          <button
            onClick={onNewChat}
            className="
              w-full py-2.5 px-4 flex items-center justify-center gap-2
              bg-emerald-500/10 hover:bg-emerald-500/18
              text-emerald-400 font-semibold text-sm
              border border-emerald-500/25 hover:border-emerald-500/45
              rounded-lg transition-all duration-150 shrink-0
              shadow-sm shadow-emerald-900/10
            "
          >
            <PlusCircle size={16} />
            New Analysis
          </button>

          {!activeChatId && (
            <div className="space-y-2 shrink-0 animate-in fade-in duration-300">
              <SectionLabel icon={Sparkles} label="The Playbook" iconClass="text-emerald-600" />
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onPromptSelect(prompt)}
                  className="
                    w-full text-left px-3 py-2.5 rounded-lg text-xs
                    text-slate-400 hover:text-slate-200
                    bg-slate-800/30 hover:bg-slate-800/70
                    border border-slate-800 hover:border-emerald-500/25
                    transition-all duration-150 leading-snug
                  "
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col flex-1 overflow-hidden min-h-0">
            <SectionLabel icon={MessageSquare} label="Chat History" iconClass="text-blue-600" />

            {chats.length === 0 ? (
              <p className="text-xs text-slate-600 italic px-1 mt-1">No past queries yet.</p>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {chats.map((chat) => (
                  <div key={chat.id} className="group relative flex items-center">
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      title={chat.title}
                      className={`
                        relative flex-1 text-left px-3 py-2 pr-8 rounded-lg
                        text-xs font-medium truncate transition-all duration-150
                        border
                        ${activeChatId === chat.id
                          ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/20'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-transparent'
                        }
                      `}
                    >
                      {activeChatId === chat.id && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-emerald-500 rounded-r-full" />
                      )}
                      <span className="truncate block">{chat.title}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteChat) onDeleteChat(chat.id);
                      }}
                      title="Delete analysis"
                      className={`
                        absolute right-1.5 p-1 rounded-md
                        opacity-0 group-hover:opacity-100 focus:opacity-100
                        transition-all duration-150
                        ${activeChatId === chat.id
                          ? 'text-emerald-600/60 hover:text-red-400 hover:bg-slate-800'
                          : 'text-slate-600 hover:text-red-400 hover:bg-slate-800'
                        }
                      `}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-800/80 shrink-0">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
            text-sm text-slate-500 hover:text-red-400
            hover:bg-red-500/6 border border-transparent hover:border-red-500/15
            transition-all duration-150
          "
        >
          <LogOut size={15} className="shrink-0" />
          Sign out
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
