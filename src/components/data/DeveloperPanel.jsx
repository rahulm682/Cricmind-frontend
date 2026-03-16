import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, Zap } from 'lucide-react';

const DeveloperPanel = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!message.sql_used) return null;

  const isCacheHit = message.cached_via === 'semantic_cache';
  const distanceScore = message.distance || message.missed_by_distance;

  return (
    <div className="mt-3 w-full border border-slate-700/50 rounded-lg overflow-hidden bg-slate-900/30 transition-all">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-1.5 font-mono">
          ⚙️ Under the Hood {isCacheHit && <span className="text-emerald-500 ml-2 border border-emerald-500/30 bg-emerald-500/10 px-1.5 rounded uppercase text-[10px]">Cache Hit</span>}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="p-3 border-t border-slate-700/50 space-y-3 bg-slate-950/50 text-xs">

          <div className="flex flex-col gap-2 p-2 rounded bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              {isCacheHit ? (
                <Zap size={14} className="text-emerald-400" />
              ) : (
                <Database size={14} className="text-blue-400" />
              )}
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">
                Retrieval Engine
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="text-slate-500">Source: </span>
                <span className={isCacheHit ? "text-emerald-400 font-medium" : "text-blue-400 font-medium"}>
                  {isCacheHit ? "pgvector Semantic Cache" : "Groq Llama-3.3 (Fresh Gen)"}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Vector Distance: </span>
                <span className="text-slate-300 font-mono">
                  {distanceScore ? parseFloat(distanceScore).toFixed(4) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500 flex items-center gap-1">
              Executed PostgreSQL
            </span>
            <div className="relative">
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-emerald-300 font-mono text-[11px] leading-relaxed">
                <code>{message.sql_used}</code>
              </pre>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DeveloperPanel;
