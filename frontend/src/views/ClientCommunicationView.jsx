import { useState, useEffect, useRef } from 'react';
import { getTicketQueue, getTicketById, getComments, addComment } from '../api/tickets';

function timeLabel(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ClientCommunicationView() {
  const [ticketList, setTicketList] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [detail, setDetail]         = useState(null);
  const [comments, setComments]     = useState([]);
  const [tab, setTab]               = useState('respond');
  const [reply, setReply]           = useState('');
  const [sending, setSending]       = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    getTicketQueue({ queue: 'assigned', limit: 20 })
      .then(r => setTicketList(r.data.data.tickets || []))
      .catch(() => {});
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [comments]);

  const loadTicket = (ticket) => {
    setSelected(ticket);
    getTicketById(ticket.id).then(r => setDetail(r.data.data)).catch(() => setDetail(ticket));
    getComments(ticket.id).then(r => setComments(r.data.data || [])).catch(() => {});
  };

  const handleSend = async () => {
    if (!reply.trim() || !detail) return;
    setSending(true);
    try {
      await addComment(detail.id, reply, tab === 'internal');
      setReply('');
      const r = await getComments(detail.id);
      setComments(r.data.data || []);
    } finally { setSending(false); }
  };

  const publicComments   = comments.filter(c => !c.is_internal);
  const internalComments = comments.filter(c => c.is_internal);
  const displayed        = tab === 'internal' ? internalComments : publicComments;

  return (
    <div className="flex flex-col h-full gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Client Communication</h1>
        <p className="text-sm text-gray-500 mt-0.5">Respond to clients directly or add internal notes visible only to your team</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* Ticket list */}
        <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Tickets</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {ticketList.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No tickets available</p>
            ) : (
              ticketList.map(t => {
                const unreadCount = 0; // placeholder
                return (
                  <button
                    key={t.id}
                    onClick={() => loadTicket(t)}
                    className={`w-full text-left px-4 py-3.5 transition-colors
                      ${selected?.id === t.id ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-gray-50 border-l-2 border-transparent'}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                        ${t.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          t.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 truncate mb-1">{t.title}</p>
                    <p className="text-[10px] text-gray-400">{t.client?.full_name || '—'}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Communication panel */}
        {!detail ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-3">
            <span className="text-4xl">💬</span>
            <p className="text-sm font-medium">Select a ticket to start communicating</p>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">

            {/* Ticket header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600">#{detail.id.slice(0,8).toUpperCase()}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{detail.client?.full_name}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{detail.title}</h3>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg
                  ${detail.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {detail.status}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-5 shrink-0">
              {[
                { key: 'respond',  label: 'Respond to Client', icon: '💬' },
                { key: 'internal', label: 'Internal Note',     icon: '🔒' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-colors
                    ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                  {t.key === 'respond' && publicComments.length > 0 && (
                    <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{publicComments.length}</span>
                  )}
                  {t.key === 'internal' && internalComments.length > 0 && (
                    <span className="bg-gray-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{internalComments.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab description */}
            <div className={`px-5 py-2 text-xs shrink-0 ${tab === 'internal' ? 'bg-amber-50 text-amber-700 border-b border-amber-100' : 'bg-blue-50 text-blue-700 border-b border-blue-100'}`}>
              {tab === 'respond'
                ? '📤 Messages here are visible to the client in their portal.'
                : '🔒 Internal notes are only visible to support officers and developers.'}
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 min-h-0">
              {displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
                  <span className="text-2xl">{tab === 'internal' ? '📝' : '💬'}</span>
                  <p className="text-sm">{tab === 'internal' ? 'No internal notes yet.' : 'No messages yet. Start the conversation.'}</p>
                </div>
              ) : (
                displayed.map(c => {
                  const isAgent = ['SupportOfficer', 'Developer', 'Admin'].includes(c.author?.role);
                  return (
                    <div key={c.comment_id} className={`flex items-end gap-2.5 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
                        ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {initials(c.author?.full_name)}
                      </div>
                      <div className={`flex flex-col max-w-[70%] gap-1 ${isAgent ? 'items-end' : 'items-start'}`}>
                        <p className="text-[10px] text-gray-400 px-1">{c.author?.full_name} · {c.author?.role}</p>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${isAgent
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                          }
                          ${c.is_internal ? 'opacity-90' : ''}`}>
                          {c.comment}
                        </div>
                        <p className="text-[10px] text-gray-400 px-1">{timeLabel(c.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Reply box */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 shrink-0">
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-blue-400 resize-none placeholder-gray-400 transition-all"
                placeholder={tab === 'internal' ? 'Write an internal note (only visible to your team)...' : 'Type your reply to the client...'}
                rows={3}
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">Ctrl+Enter to send</p>
                <button
                  onClick={handleSend}
                  disabled={sending || !reply.trim()}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${tab === 'internal'
                      ? 'bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    }`}
                >
                  {sending ? 'Sending...' : tab === 'internal' ? '📝 Save Note' : '➤ Send Reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
