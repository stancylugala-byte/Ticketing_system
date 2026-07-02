import { useEffect, useState, useCallback } from 'react';
import { getTicketQueue, claimTicket } from '../api/tickets';

const QUEUES = [
  { key: 'assigned', label: 'Assigned to Me', icon: '📋' },
  { key: 'pending',  label: 'Pending',         icon: '⏳' },
  { key: 'escalated',label: 'Escalated',        icon: '⬆' },
  { key: 'unassigned',label:'Unassigned',       icon: '👤' },
  { key: 'new',      label: 'New Tickets',      icon: '🆕' },
];

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-yellow-100 text-yellow-700',
  Low:      'bg-green-100 text-green-700',
};

const statusDot = {
  'Open':        'bg-blue-500',
  'In Progress': 'bg-yellow-500',
  'Pending':     'bg-purple-500',
  'Resolved':    'bg-emerald-500',
  'Closed':      'bg-gray-400',
};

function timeAgo(d) {
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

export default function TicketQueue({ onSelect, selectedId }) {
  const [activeQueue, setActiveQueue] = useState('assigned');
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getTicketQueue({ queue: activeQueue, search, page, limit: 10 })
      .then(r => { setTickets(r.data.data.tickets || []); setTotal(r.data.data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeQueue, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleClaim = async (e, id) => {
    e.stopPropagation();
    await claimTicket(id).catch(() => {});
    load();
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">

      {/* Left queue selector */}
      <div className="w-48 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col py-3 gap-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3.5 pb-1 pt-2">My Workspace</p>
        {QUEUES.slice(0, 3).map(q => (
          <button
            key={q.key}
            onClick={() => { setActiveQueue(q.key); setPage(1); }}
            className={`flex items-center gap-2 w-full px-3.5 py-2 text-[13px] font-medium transition-colors
              ${activeQueue === q.key ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <span className="text-sm">{q.icon}</span>{q.label}
          </button>
        ))}
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3.5 pb-1 pt-4">Global Queues</p>
        {QUEUES.slice(3).map(q => (
          <button
            key={q.key}
            onClick={() => { setActiveQueue(q.key); setPage(1); }}
            className={`flex items-center gap-2 w-full px-3.5 py-2 text-[13px] font-medium transition-colors
              ${activeQueue === q.key ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <span className="text-sm">{q.icon}</span>{q.label}
          </button>
        ))}
      </div>

      {/* Right ticket list */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Search bar */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-gray-200">
          <input
            className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all placeholder-gray-400"
            placeholder="Search this queue..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button onClick={load} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all">↻</button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_50px_100px_130px] px-3.5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
          <span>Ticket Info</span><span className="text-center">Client</span><span>Priority</span><span>Status</span>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm gap-1">
              <span className="text-2xl">📭</span>No tickets in this queue
            </div>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => onSelect(ticket)}
                className={`grid grid-cols-[1fr_50px_100px_130px] items-center px-3.5 py-3 border-b border-gray-100 cursor-pointer transition-colors
                  ${selectedId === ticket.id ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-gray-50'}`}
              >
                {/* Info */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[11px] font-bold text-blue-600">#{ticket.id.slice(0,8).toUpperCase()}</span>
                  <span className="text-sm font-medium text-gray-800 truncate">{ticket.title}</span>
                  <span className="text-[11px] text-gray-400">{timeAgo(ticket.created_at)}{ticket.category?.category_name && <> · <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{ticket.category.category_name}</span></>}</span>
                </div>

                {/* Client avatar */}
                <div className="flex justify-center">
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold" title={ticket.client?.full_name}>
                    {initials(ticket.client?.full_name)}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${priorityBadge[ticket.priority] || 'bg-gray-100 text-gray-500'}`}>
                    {ticket.priority}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[ticket.status] || 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-500">{ticket.status}</span>
                  {ticket.status === 'Open' && !ticket.assigned_to && (
                    <button
                      onClick={e => handleClaim(e, ticket.id)}
                      className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-[11px] font-semibold rounded hover:bg-blue-700 transition-colors"
                    >Claim</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-400">Showing {tickets.length} of {total} tickets</span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-2.5 py-1 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">‹</button>
            <span className="text-xs font-medium">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-2.5 py-1 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
