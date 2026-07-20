import { useEffect, useState, useCallback } from 'react';
import { getTicketQueue, claimTicket, getDashboardStats } from '../api/tickets';

const FILTERS = [
  { key: 'new',       label: 'New Tickets',      color: 'bg-blue-100 text-blue-700' },
  { key: 'assigned',  label: 'Assigned Tickets',  color: 'bg-yellow-100 text-yellow-700' },
  { key: 'pending',   label: 'Pending Tickets',   color: 'bg-purple-100 text-purple-700' },
  { key: 'escalated', label: 'Escalated Tickets', color: 'bg-red-100 text-red-700' },
];

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700 border border-red-200',
  High:     'bg-orange-100 text-orange-700 border border-orange-200',
  Medium:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Low:      'bg-green-100 text-green-700 border border-green-200',
};

const statusConfig = {
  'Open':        { dot: 'bg-blue-500',    label: 'New' },
  'In Progress': { dot: 'bg-yellow-500',  label: 'Assigned' },
  'Pending':     { dot: 'bg-purple-500',  label: 'Pending' },
  'Resolved':    { dot: 'bg-emerald-500', label: 'Resolved' },
  'Closed':      { dot: 'bg-gray-400',    label: 'Closed' },
};

function timeAgo(d) {
  if (!d) return '';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function TicketQueueView({ onOpenTicket }) {
  const [activeFilter, setActiveFilter] = useState('new');
  const [tickets, setTickets]           = useState([]);
  const [total, setTotal]               = useState(0);
  const [stats, setStats]               = useState(null);
  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(false);

  // Load stats for KPI cards
  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    getTicketQueue({ queue: activeFilter, search, page, limit: 10 })
      .then(r => { setTickets(r.data.data.tickets || []); setTotal(r.data.data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeFilter, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleClaim = async (e, id) => {
    e.stopPropagation();
    await claimTicket(id).catch(() => {});
    load();
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  const kpiCards = [
    { label: 'Assigned Tickets', value: stats?.assigned ?? '—',      bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30', text: 'text-blue-700 dark:text-blue-400' },
    { label: 'Pending Tickets',  value: stats?.pending ?? '—',       bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/30', text: 'text-orange-700 dark:text-orange-400' },
    { label: 'Resolved Today',   value: stats?.resolvedToday ?? '—', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-700 dark:text-emerald-400' },
    { label: 'SLA Due Today',    value: stats?.slaBreaches ?? '—',   bg: (stats?.slaBreaches ?? 0) > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-slate-900', border: (stats?.slaBreaches ?? 0) > 0 ? 'border-red-300 dark:border-red-500/30' : 'border-gray-200 dark:border-slate-700', text: (stats?.slaBreaches ?? 0) > 0 ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-slate-200' },
  ];

  return (
    <div className="flex flex-col h-full gap-5">

      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ticket Queue</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Monitor and manage all incoming support tickets</p>
      </div>

      {/* KPI cards � 2�2 */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map(c => (
          <div key={c.label} className={`rounded-xl border ${c.border} ${c.bg} px-5 py-4`}>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`text-3xl font-bold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-5 pt-4 pb-0 shrink-0">
          <div className="flex gap-1 border-b border-gray-200 dark:border-slate-700 w-full">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => { setActiveFilter(f.key); setPage(1); }}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all
                  ${activeFilter === f.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 hover:border-gray-300'
                  }`}
              >
                {f.label}
              </button>
            ))}
            {/* Search right side */}
            <div className="ml-auto mb-1 flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none">??</span>
                <input
                  className="pl-7 pr-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-800 transition-all w-52 placeholder-gray-400"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button onClick={load} className="px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:bg-slate-900 hover:text-blue-600 transition-colors">?</button>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_160px_100px_130px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shrink-0">
          <span>Ticket</span>
          <span>Client</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Time</span>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-2 p-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-slate-500 gap-2">
              <span className="text-3xl">??</span>
              <p className="text-sm font-medium">No tickets in this queue</p>
            </div>
          ) : (
            tickets.map(ticket => {
              const sc = statusConfig[ticket.status] || statusConfig['Open'];
              return (
                <div
                  key={ticket.id}
                  onClick={() => onOpenTicket?.(ticket)}
                  className="grid grid-cols-[1fr_160px_100px_130px_120px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors group"
                >
                  {/* Ticket info */}
                  <div className="flex flex-col gap-0.5 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-600 shrink-0">#{ticket.id.slice(0,8).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate group-hover:text-blue-700 transition-colors">{ticket.title}</span>
                    {ticket.category?.category_name && (
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{ticket.category.category_name}</span>
                    )}
                  </div>

                  {/* Client */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 bg-slate-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                      {initials(ticket.client?.full_name)}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-slate-300 truncate">{ticket.client?.full_name || '�'}</span>
                  </div>

                  {/* Priority */}
                  <div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${priorityBadge[ticket.priority] || 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                      {ticket.priority}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                    <span className="text-xs text-gray-600 dark:text-slate-300">{ticket.status}</span>
                    {ticket.status === 'Open' && !ticket.assigned_to && (
                      <button
                        onClick={e => handleClaim(e, ticket.id)}
                        className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Claim
                      </button>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-gray-400 dark:text-slate-500">{timeAgo(ticket.created_at)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shrink-0">
          <span className="text-xs text-gray-400 dark:text-slate-500">Showing {tickets.length} of {total} tickets</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">? Prev</button>
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium px-1">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next ?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
