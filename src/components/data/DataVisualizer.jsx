import React, { useState } from 'react';
import { Table as TableIcon, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DataVisualizer = ({ data }) => {
  const [view, setView] = useState('table');

  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const xAxisKey = columns.find(col => typeof data[0][col] === 'string') || columns[0];

  const numericalColumns = columns.filter(col => typeof data[0][col] === 'number');

  const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="mt-4 w-full border border-slate-700 bg-slate-900 rounded-xl overflow-hidden shadow-lg">

      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Query Results ({data.length} rows)
        </span>

        {numericalColumns.length > 0 && data.length > 1 && (
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors ${view === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <TableIcon size={14} /> Table
            </button>
            <button
              onClick={() => setView('chart')}
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors ${view === 'chart' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <BarChart3 size={14} /> Chart
            </button>
          </div>
        )}
      </div>

      <div className="p-4 overflow-x-auto">
        {view === 'table' ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-700">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">{col.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-slate-300 whitespace-nowrap">
                      {/* Format numbers to 2 decimal places if they are floats */}
                      {typeof row[col] === 'number' && !Number.isInteger(row[col])
                        ? row[col].toFixed(2)
                        : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />

                {/* Custom dark mode tooltip */}
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f1f5f9' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#cbd5e1' }} />

                {numericalColumns.map((col, index) => (
                  <Bar
                    key={col}
                    dataKey={col}
                    name={col.replace(/_/g, ' ')}
                    fill={chartColors[index % chartColors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualizer;
