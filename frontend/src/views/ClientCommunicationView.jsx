import { useState, useEffect, useRef } from 'react';
import { getTicketQueue, getTicketById, getComments, addComment } from '../api/tickets';

function timeLabel(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function initials(name = '') {
  return (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// SVG icons replacing broken emoji chars
const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const NoteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const priorityBadge = {
  Critical: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  High:     'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  Medium:   'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  Low:      'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
};

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
    getTicketQueue({ queue: 'assigned', limit: 50 })
      .then(r => setTicketList(r.data.data.tickets || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

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
  const internalComments = comments.filter(c =>  c.is_internal);
  const displayed        = tab === 'internal' ? internalComments : publicComments;

  return (
    <div className="flex flex-col h-full gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Client Communication</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Respond to clients directly or add internal notes visible only to your team</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* ── Ticket list ── */}
        <div className="w-72 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shrink-0">
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Active Tickets ({ticketList.length})
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
            {ticketList.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-gray-400 dark:text-slate-500">No tickets available</p>
              </div>
            ) : ticketList.map(t => (
              <button
                key={t.id}
                onClick={() => loadTicket(t)}
                className={`w-full text-left px-4 py-3.5 transition-colors border-l-2 ${
                  selected?.id === t.id
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-600'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    #{t.id.slice(0,8).toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${priorityBadge[t.priority] || 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                    {t.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate mb-1">{t.title}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">{t.client?.full_name || 'Client'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Communication panel ── */}
        {!detail ? (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-slate-500">
            <EmptyIcon />
            <p className="text-sm font-medium">Select a ticket to start communicating</p>
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">

            {/* Ticket header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      #{detail.id.slice(0,8).toUpperCase()}
                    </span>
                    <span className="text-gray-300 dark:text-slate-600">·</span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{detail.client?.full_name}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{detail.title}</h3>
                  {detail.tag && (
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">{detail.tag}</p>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                  detail.status === 'Resolved'
                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : detail.status === 'Pending'
                      ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'
                      : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                }`}>
                  {detail.status}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 px-5 shrink-0 bg-white dark:bg-slate-800">
              {[
                { key: 'respond',  label: 'Respond to Client', icon: <ChatIcon />, count: publicComments.length },
                { key: 'internal', label: 'Internal Note',     icon: <LockIcon />, count: internalComments.length },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                    tab === t.key
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                  }`}
                >
                  {t.icon}
                  {t.label}
                  {t.count > 0 && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                      t.key === 'respond' ? 'bg-blue-600' : 'bg-amber-500'
                    }`}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Info banner */}
            <div className={`px-5 py-2 text-xs flex items-center gap-2 shrink-0 ${
              tab === 'internal'
                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-b border-amber-100 dark:border-amber-500/20'
                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-b border-blue-100 dark:border-blue-500/20'
            }`}>
              {tab === 'internal' ? <LockIcon /> : <ChatIcon />}
              {tab === 'respond'
                ? 'Messages here are visible to the client in their portal.'
                : 'Internal notes are only visible to support officers and developers.'}
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 min-h-0 bg-gray-50 dark:bg-slate-900/40">
              {displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500 gap-2 py-10">
                  {tab === 'internal' ? <NoteIcon /> : <ChatIcon />}
                  <p className="text-sm">
                    {tab === 'internal' ? 'No internal notes yet.' : 'No messages yet. Start the conversation.'}
                  </p>
                </div>
              ) : (
                displayed.map(c => {
                  const isAgent = ['SupportOfficer','Developer','Admin','Manager'].includes(c.author?.role);
                  return (
                    <div key={c.comment_id} className={`flex items-end gap-2.5 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isAgent ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-200'
                      }`}>
                        {initials(c.author?.full_name)}
                      </div>
                      <div className={`flex flex-col max-w-[70%] gap-1 ${isAgent ? 'items-end' : 'items-start'}`}>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 px-1">
                          {c.author?.full_name} · {c.author?.role}
                        </p>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAgent
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 rounded-bl-sm'
                        }`}>
                          {c.comment}
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 px-1">{timeLabel(c.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Reply box */}
            <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 shrink-0">
              <textarea
                className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-900 dark:text-slate-100 outline-none focus:border-blue-400 dark:focus:border-blue-500 resize-none placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                placeholder={tab === 'internal'
                  ? 'Write an internal note (only visible to your team)...'
                  : 'Type your reply to the client...'}
                rows={3}
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400 dark:text-slate-500">Ctrl+Enter to send</p>
                <button
                  onClick={handleSend}
                  disabled={sending || !reply.trim()}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                    tab === 'internal'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {tab === 'internal' ? <NoteIcon /> : <SendIcon />}
                  {sending ? 'Sending...' : tab === 'internal' ? 'Save Note' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
