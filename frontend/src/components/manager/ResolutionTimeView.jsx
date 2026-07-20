import { useEffect, useState } from 'react';
import { getResolutionTime } from '../../api/managerApi';

const priorityBadge = {
  Critical:'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  High:    'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  Medium:  'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  Low:     'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
};

export default function ResolutionTimeView() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResolutionTime().then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const tickets   = data?.tickets || [];
  const withinSla = tickets.filter(t => t.withinSla === true).length;
  const breached  = tickets.filter(t => t.withinSla === false).length;

  const summaryCards = [
    { label: 'Avg Resolution', value: loading ? '—' : `${data?.avgHours}h`, color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-500/10',     icon: '⏱' },
    { label: 'Within SLA',     value: loading ? '—' : withinSla,             color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: '✅' },
    { label: 'SLA Breached',   value: loading ? '—' : breached,              color: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-500/10',         icon: '⚠' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resolution Time Tracking</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Mean-time-to-resolution (MTTR) monitoring across all resolved tickets</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map(c => (
          <div key={c.label} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4 flex items-center gap-4">
            <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_120px_100px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>Ticket</span><span>Priority</span><span>Actual Time</span><span>Target (SLA)</span><span>Result</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(5)].map((_,i) => <div key={i} className="h-12 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2"><span className="text-3xl">📭</span><p className="text-sm">No resolved tickets yet</p></div>
        ) : (
          tickets.slice(0, 30).map(t => (
            <div key={t.id} className="grid grid-cols-[1fr_100px_120px_120px_100px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <div className="min-w-0 pr-3">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">#{t.id.slice(0,8).toUpperCase()}</span>
                <span className="text-sm text-gray-800 dark:text-slate-100 truncate block">{t.title}</span>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${priorityBadge[t.priority] || 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>{t.priority}</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">{t.actualHours}h</span>
              <span className="text-sm text-gray-500 dark:text-slate-400">{t.targetHours ? `${t.targetHours}h` : '—'}</span>
              {t.withinSla === null ? (
                <span className="text-xs text-gray-400 dark:text-slate-500">No SLA</span>
              ) : t.withinSla ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ On time</span>
              ) : (
                <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">✗ Breached</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
