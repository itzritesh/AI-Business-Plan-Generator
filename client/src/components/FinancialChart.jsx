import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const FinancialChart = ({ data, theme = 'dark' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-350">
        <span className="text-sm text-slate-400">No data available. Run calculations to generate.</span>
      </div>
    );
  }

  // Format currency helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* 1. Revenue vs Expenses Chart */}
      <div className="glass-card p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 px-2">
          Revenue vs. Operational Expenses Forecast
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={labelColor} fontSize={11} />
              <YAxis stroke={labelColor} fontSize={11} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                  color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                  borderRadius: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                name="Revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorRev)"
                strokeWidth={2}
              />
              <Area
                name="Expenses"
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorExp)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Cash Balance Chart */}
      <div className="glass-card p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 px-2">
          Projected Cash Balance Runway
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={labelColor} fontSize={11} />
              <YAxis stroke={labelColor} fontSize={11} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                  color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                  borderRadius: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                name="Cash Runway"
                type="monotone"
                dataKey="cashBalance"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorCash)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
