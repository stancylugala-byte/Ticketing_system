import { useEffect, useState } from 'react';
import { getKPIs } from '../../api/managerApi';

export default function ManagerKPIs() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getKPIs().then(r => setData(r.data.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Ticket Volume', value: data?.totalTickets ?? '—', sub: '+12% from last month', icon: '??', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'SLA Compliance',      value: data ? `${data.slaBreaches === 0 ? '100' : ((1 - data.slaBreaches / Math.max(data.totalTickets,1)) * 100).toFixed(1)}%` : '—', sub: 'Target: >98%', icon: '??', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Open Tickets',        value: data?.openTickets ?? '—', sub: 'Active cases', icon: '??', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { label: 'Avg. CSAT Score',     value: data?.csat != null ? `${data.csat}/5` : '—', sub: 'Based on feedback', icon: '?', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-1">
      {cards.map(c => (
        <div key={c.label} className={`bg-white dark:bg-slate-800 rounded-xl border ${c.border} px-5 py-4 shadow-sm flex items-center gap-4`}>
          <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 truncate">{c.label}</p>
            {!data ? (
              <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className={`text-2xl font-bold leading-none ${c.color}`}>{c.value}</p>
            )}
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
