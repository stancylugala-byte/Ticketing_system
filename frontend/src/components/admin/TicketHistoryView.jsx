import { useEffect, useState } from 'react';
import { getTicketHistory } from '../../api/adminApi';

const priorityBadge = {
  Critical: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  High:     'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  Medium:   'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  Low:      'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
};

const statusDot = {
  Open:         'bg-blue-500',
  'In Progress':'bg-yellow-500',
  Pending:      'bg-purple-500',
  Resolved:     'bg-emerald-500',
  Closed:       'bg-gray-400',
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

export default function TicketHistoryView() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    getTicketHistory().then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? data.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.includes(search.toLowerCase())
      )
    : data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ticket History</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Immutable log of all ticket transitions — {data.length} records</p>
        </div>
        <input
          className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-red-400 bg-white dark:bg-slate-800 dark:text-slate-100 w-52 placeholder-gray-400 dark:placeholder-slate-500"
          placeholder="Search by title or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[140px_1fr_100px_100px_120px_120px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>Ticket ID</span><span>Title</span><span>Priority</span><span>Status</span>
          <span>Client</span><span>Created</span><span>Last Update</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(6)].map((_,i) => <div key={i} className="h-12 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2">
            <span className="text-3xl">🎫</span>
            <p className="text-sm">No ticket history found</p>
          </div>
        ) : (
          filtered.slice(0, 50).map(t => (
            <div key={t.id} className="grid grid-cols-[140px_1fr_100px_100px_120px_120px_120px] items-center px-5 py-3 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                #{t.id.slice(0,8).toUpperCase()}
              </span>
              <span className="text-sm text-gray-800 dark:text-slate-100 truncate pr-3">{t.title}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${priorityBadge[t.priority] || 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                {t.priority}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusDot[t.status] || 'bg-gray-400'}`} />
                <span className="text-xs text-gray-600 dark:text-slate-300">{t.status}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 truncate">{t.client?.full_name || '—'}</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">{fmtDate(t.created_at)}</span>
              <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">{fmtDate(t.updated_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
