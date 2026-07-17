import { useEffect, useState } from 'react';
import { getEscalatedTickets } from '../../api/managerApi';

const priorityBadge = { Critical:'bg-red-100 text-red-700 border border-red-200', High:'bg-orange-100 text-orange-700 border border-orange-200' };

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

export default function EscalatedTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEscalatedTickets()
      .then(r => setTickets(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Escalated Tickets</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">High and Critical priority tickets requiring immediate attention</p>
        </div>
        <span className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg">
          {tickets.length} Active Escalations
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_130px_90px_110px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>Ticket</span><span>Client</span><span>Priority</span><span>Status</span><span>Assigned To</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(4)].map((_,i) => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 dark:text-slate-500 gap-2"><span className="text-3xl">?</span><p className="text-sm font-medium">No escalated tickets — all clear!</p></div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="grid grid-cols-[1fr_130px_90px_110px_120px] items-center px-5 py-4 border-b border-gray-100 dark:border-slate-700 hover:bg-red-50/30 transition-colors">
              <div className="flex flex-col gap-0.5 pr-3 min-w-0">
                <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{t.title}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">{timeAgo(t.created_at)}</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-300 truncate">{t.client?.full_name || '—'}</span>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${priorityBadge[t.priority] || 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>{t.priority}</span>
              <span className="text-xs text-gray-600 dark:text-slate-300">{t.status}</span>
              <span className="text-xs text-gray-600 dark:text-slate-300 truncate">{t.assignee?.full_name || <em className="text-gray-400 dark:text-slate-500">Unassigned</em>}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
