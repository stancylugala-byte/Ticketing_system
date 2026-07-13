import { useEffect, useState, useCallback } from 'react';
import { getAllTickets } from '../../api/managerApi';

const STATUSES   = ['', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const PRIORITIES = ['', 'Low', 'Medium', 'High', 'Critical'];

const priorityBadge = { Critical:'bg-red-100 text-red-700', High:'bg-orange-100 text-orange-700', Medium:'bg-yellow-100 text-yellow-700', Low:'bg-green-100 text-green-700' };
const statusDot     = { Open:'bg-blue-500','In Progress':'bg-yellow-500', Pending:'bg-purple-500', Resolved:'bg-emerald-500', Closed:'bg-gray-400' };

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

export default function AllTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getAllTickets({ ...filters, page, limit: 15 })
      .then(r => { setTickets(r.data.data.tickets); setTotal(r.data.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 15));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">All Tickets</h2>
          <p className="text-sm text-gray-500">Complete ticket directory — {total} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white w-56 placeholder-gray-400"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
        />
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white"
          value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white"
          value={filters.priority} onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(1); }}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
        </select>
        <button onClick={load} className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Refresh</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_90px_110px_100px_100px] px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
          <span>Ticket</span><span>Client</span><span>Priority</span><span>Status</span><span>Assignee</span><span>Created</span>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2 p-4">{[...Array(5)].map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2"><span className="text-3xl">📭</span><p className="text-sm">No tickets found</p></div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="grid grid-cols-[1fr_140px_90px_110px_100px_100px] items-center px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                <span className="text-sm font-semibold text-gray-800 truncate">{t.title}</span>
                <span className="text-[10px] text-gray-400">{t.category?.category_name || '—'}</span>
              </div>
              <span className="text-xs text-gray-600 truncate">{t.client?.full_name || '—'}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${priorityBadge[t.priority] || 'bg-gray-100 text-gray-500'}`}>{t.priority}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusDot[t.status] || 'bg-gray-400'}`} />
                <span className="text-xs text-gray-600">{t.status}</span>
              </div>
              <span className="text-xs text-gray-500 truncate">{t.assignee?.full_name || <em className="text-gray-300">Unassigned</em>}</span>
              <span className="text-xs text-gray-400">{timeAgo(t.created_at)}</span>
            </div>
          ))
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-400">Showing {tickets.length} of {total}</span>
          <div className="flex items-center gap-2 text-xs">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
            <span className="text-gray-500 px-1">{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
