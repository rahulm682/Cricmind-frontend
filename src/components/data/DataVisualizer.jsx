import React, { useState, useMemo } from 'react';
import { Table as TableIcon, BarChart3, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];


const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl shadow-black/60 min-w-[120px]">
      {label && <p className="text-xs text-slate-500 mb-2 font-medium">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-xs text-slate-400">{entry.name}</span>
          <span className="text-xs font-bold text-slate-100 ml-auto pl-3">
            {typeof entry.value === 'number' && !Number.isInteger(entry.value)
              ? entry.value.toFixed(2)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};


const ChartLegend = ({ payload }) => {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
          <span className="text-xs text-slate-500">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};


const axisProps = {
  tick: { fill: '#475569', fontSize: 11 },
  tickLine: false,
  axisLine: false,
};

const gridProps = {
  strokeDasharray: '3 3',
  stroke: '#1e293b',
  vertical: false,
};


const DataVisualizer = ({ config }) => {
  const [view, setView] = useState('chart');

  const chartData = useMemo(() => {
    if (!config?.labels || !config?.datasets) return [];
    return config.labels.map((label, index) => {
      const row = { name: label };
      config.datasets.forEach(ds => { row[ds.label] = ds.data[index]; });
      return row;
    });
  }, [config]);

  if (!config || chartData.length === 0) return null;

  const numericalColumns = config.datasets.map(ds => ds.label);
  const chartType = config.chart_type || 'bar';

  const renderChart = () => {
    if (chartType === 'pie') {
      const pieData = chartData.map(item => ({
        name: item.name,
        value: item[numericalColumns[0]],
      }));
      return (
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Legend content={<ChartLegend />} />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={40}
            paddingAngle={2}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#334155', strokeWidth: 1 }}
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
        </PieChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<ChartTooltip />} />
          <Legend content={<ChartLegend />} />
          {numericalColumns.map((col, index) => (
            <Line
              key={col}
              type="monotone"
              dataKey={col}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2.5}
              dot={{ r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      );
    }

    return (
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="name" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(30,41,59,0.5)' }} />
        <Legend content={<ChartLegend />} />
        {numericalColumns.map((col, index) => (
          <Bar
            key={col}
            dataKey={col}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    );
  };

  return (
    <div className="mt-3 w-full border border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-lg shadow-black/20">

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2 min-w-0">
          <TrendingUp size={13} className="text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
            {config.title || 'Data Visualisation'}
          </span>
        </div>

        <div className="flex items-center bg-slate-950 rounded-lg p-1 gap-1 border border-slate-800 shrink-0 ml-3">
          <button
            onClick={() => setView('chart')}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
              text-xs font-semibold transition-all duration-150
              ${view === 'chart'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-900/40'
                : 'text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <BarChart3 size={12} />
            Chart
          </button>
          <button
            onClick={() => setView('table')}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
              text-xs font-semibold transition-all duration-150
              ${view === 'table'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-900/40'
                : 'text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <TableIcon size={12} />
            Table
          </button>
        </div>
      </div>

      <div className="p-4">
        {view === 'table' ? (

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Entity
                  </th>
                  {numericalColumns.map((col) => (
                    <th key={col} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors duration-100"
                  >
                    <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap text-sm">
                      {row.name}
                    </td>
                    {numericalColumns.map((col) => (
                      <td key={col} className="px-4 py-3 text-slate-400 whitespace-nowrap text-sm tabular-nums">
                        {typeof row[col] === 'number' && !Number.isInteger(row[col])
                          ? row[col].toFixed(2)
                          : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        ) : (

          <div className="h-72 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

        )}
      </div>
    </div>
  );
};

export default DataVisualizer;
