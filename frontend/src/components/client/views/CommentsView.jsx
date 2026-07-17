import { useEffect, useState, useRef } from 'react';
import { getMyTickets, getTicketById, addComment } from '../../../api/clientApi';

function initials(n = '') { return n.split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase(); }
function fmtTime(d) { return d ? new Date(d).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''; }

export default function CommentsView() {
  const [tickets, setTickets]   = useState([]);
  const [selected, setSelected] = useState('');
  const [ticket, setTicket]     = useState(null);
  const [comment, setComment]   = useState('');
  const [sending, setSending]   = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    getMyTickets({ limit: 50 }).then(r => {
      const t = (r.data.data.tickets || []).filter(x => x.status !== 'Closed');
      setTickets(t);
      if (t.length > 0) loadTicket(t[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [ticket?.comments]);

  const loadTicket = (id) => {
    setSelected(id);
    getTicketById(id).then(r => setTicket(r.data.data)).catch(() => {});
  };

  const send = async () => {
    if (!comment.trim() || !selected) return;
    setSending(true);
    try { await addComment(selected, comment); setComment(''); loadTicket(selected); }
    finally { setSending(false); }
  };

  const comments = ticket?.comments || [];

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      {/* Ticket picker */}
      <div className="w-64 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shrink-0">
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">My Tickets</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
          {tickets.map(t => (
            <button key={t.id} onClick={() => loadTicket(t.id)}
              className={`w-full text-left px-4 py-3 transition-colors ${selected === t.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600' : 'hover:bg-gray-50 dark:hover:bg-slate-800 border-l-2 border-transparent'}`}>
              <p className="text-[11px] font-bold text-blue-600 mb-0.5">#{t.id.slice(0,8).toUpperCase()}</p>
              <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{t.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{t.status}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        {!ticket ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a ticket to view comments</div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-600">#{ticket.id.slice(0,8).toUpperCase()}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{ticket.title}</span>
                <span className={`ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0
                  ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 bg-gray-50 dark:bg-slate-900">
              {comments.length === 0
                ? <p className="text-center text-xs text-gray-400 py-6">No messages yet. Start the conversation!</p>
                : comments.map(c => {
                    const isAgent = ['SupportOfficer','Developer','Admin','Manager'].includes(c.author?.role);
                    return (
                      <div key={c.comment_id} className={`flex items-end gap-2 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                          {initials(c.author?.full_name)}
                        </div>
                        <div className={`flex flex-col max-w-[75%] gap-0.5 ${isAgent ? 'items-end' : 'items-start'}`}>
                          <p className="text-[10px] text-gray-400 px-1">{c.author?.full_name}</p>
                          <div className={`px-3 py-2.5 rounded-xl text-sm leading-relaxed ${isAgent ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 rounded-bl-sm'}`}>
                            {c.comment}
                          </div>
                          <span className="text-[9px] text-gray-400 px-1">{fmtTime(c.created_at)}</span>
                        </div>
                      </div>
                    );
                  })
              }
              <div ref={endRef} />
            </div>

            {ticket.status !== 'Closed' && (
              <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-3 bg-gray-50 dark:bg-slate-800 shrink-0">
                <div className="flex gap-2">
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
                    placeholder="Write a message..." onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
                    className="flex-1 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-blue-400 resize-none" />
                  <button onClick={send} disabled={sending || !comment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors self-end">
                    {sending ? '…' : '➤'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Ctrl+Enter to send</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

