import { useEffect, useState } from 'react';
import { getMyTickets, getTicketById, addComment, closeTicket, reopenTicket } from '../../../api/clientApi';

const priorityBadge = { Critical:'bg-red-100 text-red-700', High:'bg-orange-100 text-orange-700', Medium:'bg-yellow-100 text-yellow-700', Low:'bg-green-100 text-green-700' };
const statusBadge   = { Open:'bg-blue-100 text-blue-700','In Progress':'bg-yellow-100 text-yellow-700', Pending:'bg-purple-100 text-purple-700', Resolved:'bg-emerald-100 text-emerald-700', Closed:'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300' };

function timeAgo(d) {
  if (!d) return '—';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}
function initials(name = '') { return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(); }
function fmtTime(d) { return d ? new Date(d).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'; }

function TicketDrawer({ ticketId, onClose, onRefresh }) {
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [acting, setActing] = useState(false);
  const endRef = { current: null };

  useEffect(() => {
    if (!ticketId) return;
    getTicketById(ticketId).then(r => setTicket(r.data.data)).catch(() => {});
  }, [ticketId]);

  const send = async () => {
    if (!comment.trim()) return;
    setSending(true);
    try { await addComment(ticketId, comment); setComment(''); getTicketById(ticketId).then(r => setTicket(r.data.data)); onRefresh?.(); }
    finally { setSending(false); }
  };

  const doClose = async () => {
    if (!confirm('Close this ticket?')) return;
    setActing(true);
    try { await closeTicket(ticketId); getTicketById(ticketId).then(r => setTicket(r.data.data)); onRefresh?.(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActing(false); }
  };

  const doReopen = async () => {
    if (!confirm('Reopen this ticket?')) return;
    setActing(true);
    try { await reopenTicket(ticketId); getTicketById(ticketId).then(r => setTicket(r.data.data)); onRefresh?.(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setActing(false); }
  };

  if (!ticket) return <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-500 text-sm"><div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />Loading...</div>;

  const comments = ticket.comments || [];
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold text-blue-600 shrink-0">#{ticket.id.slice(0,8).toUpperCase()}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{ticket.title}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:text-slate-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shrink-0">✕</button>
      </div>

      {/* Meta */}
      <div className="flex gap-3 flex-wrap px-5 py-3 border-b border-gray-100 dark:border-slate-700 shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Status</span>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[ticket.status]}`}>{ticket.status}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Priority</span>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${priorityBadge[ticket.priority]}`}>{ticket.priority}</span>
        </div>
        {ticket.assignee && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Assigned To</span>
            <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{ticket.assignee.full_name}</span>
          </div>
        )}
        {ticket.slaPolicy && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">SLA</span>
            <span className="text-xs font-medium text-blue-600">{ticket.slaPolicy.resolution_time}h limit</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700 shrink-0">
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase mb-1.5">Description</p>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{ticket.description}</p>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3 min-h-0 bg-gray-50 dark:bg-slate-900">
        {comments.length === 0
          ? <p className="text-center text-xs text-gray-400 dark:text-slate-500 py-4">No messages yet. Start the conversation.</p>
          : comments.map(c => {
              const isAgent = ['SupportOfficer','Developer','Admin','Manager'].includes(c.author?.role);
              return (
                <div key={c.comment_id} className={`flex items-end gap-2 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 dark:text-slate-200'}`}>
                    {initials(c.author?.full_name)}
                  </div>
                  <div className={`flex flex-col max-w-[75%] gap-0.5 ${isAgent ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${isAgent ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 rounded-bl-sm'}`}>
                      {c.comment}
                    </div>
                    <span className="text-[9px] text-gray-400 dark:text-slate-500 px-1">{fmtTime(c.created_at)}</span>
                  </div>
                </div>
              );
            })
        }
        <div ref={ref => { if (ref) endRef.current = ref; }} />
      </div>

      {/* Reply + actions */}
      {ticket.status !== 'Closed' && (
        <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 shrink-0">
          <div className="flex gap-2 mb-2.5">
            <textarea
              className="flex-1 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-blue-400 resize-none"
              placeholder="Type a message..." rows={2}
              value={comment} onChange={e => setComment(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
            />
            <button onClick={send} disabled={sending || !comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors self-end">
              {sending ? '…' : '➤'}
            </button>
          </div>
          <div className="flex gap-2">
            {ticket.status === 'Resolved' && (
              <button onClick={doClose} disabled={acting}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                ✓ Close Ticket
              </button>
            )}
            {ticket.status === 'Closed' && (
              <button onClick={doReopen} disabled={acting}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                ↩ Reopen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TicketListView({ onRefresh }) {
  const [tickets, setTickets]   = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [filter, setFilter]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (filter) params.status = filter;
    getMyTickets(params)
      .then(r => { setTickets(r.data.data.tickets || []); setTotal(r.data.data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, filter]);

  const FILTERS = ['', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="flex gap-4 h-full">
      {/* Ticket table */}
      <div className={`flex flex-col gap-4 ${selected ? 'flex-1' : 'w-full'}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">My Tickets</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{total} total tickets</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors
                  ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                {f || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="grid grid-cols-[1fr_90px_100px_90px_80px] px-4 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
            <span>Ticket</span><span>Priority</span><span>Status</span><span>Updated</span><span>Action</span>
          </div>
          {loading ? (
            <div className="p-4 flex flex-col gap-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2"><span className="text-3xl">📭</span><p className="text-sm">No tickets found</p></div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className={`grid grid-cols-[1fr_90px_100px_90px_80px] items-center px-4 py-3.5 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${selected === t.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-600' : ''}`}>
                <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                  <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{t.title}</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">{t.category?.category_name}</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${priorityBadge[t.priority]}`}>{t.priority}</span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${statusBadge[t.status]}`}>{t.status}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">{timeAgo(t.updated_at)}</span>
                <button onClick={() => setSelected(selected === t.id ? null : t.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  {selected === t.id ? 'Close' : 'View ›'}
                </button>
              </div>
            ))
          )}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
            <span className="text-xs text-gray-400 dark:text-slate-500">{tickets.length} of {total}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">← Prev</button>
              <span className="text-xs text-gray-500 dark:text-slate-400 px-1">{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="w-96 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <TicketDrawer ticketId={selected} onClose={() => setSelected(null)} onRefresh={() => { load(); onRefresh?.(); }} />
        </div>
      )}
    </div>
  );
}

