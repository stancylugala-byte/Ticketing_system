import { useEffect, useState, useRef } from 'react';
import { getTicketById, updateTicketStatus, addComment, getComments } from '../api/tickets';

const STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-yellow-100 text-yellow-700',
  Low:      'bg-green-100 text-green-700',
};

function timeLabel(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function TicketDetail({ ticket: initial, onClose, onUpdate }) {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState('communication');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!initial?.id) return;
    getTicketById(initial.id).then(r => setTicket(r.data.data)).catch(() => {});
    loadComments(initial.id);
  }, [initial?.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [comments]);

  const loadComments = (id) => {
    getComments(id).then(r => setComments(r.data.data || [])).catch(() => {});
  };

  const handleStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      const r = await updateTicketStatus(ticket.id, status);
      setTicket(r.data.data);
      onUpdate?.();
    } finally { setUpdatingStatus(false); }
  };

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await addComment(ticket.id, reply, tab === 'internal');
      setReply('');
      loadComments(ticket.id);
    } finally { setSending(false); }
  };

  if (!initial) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm text-gray-400">
        <span className="text-4xl mb-3">👈</span>
        <p className="text-sm">Select a ticket to view details</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  const publicComments   = comments.filter(c => !c.is_internal);
  const internalComments = comments.filter(c => c.is_internal);
  const displayed = tab === 'internal' ? internalComments : publicComments;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600">#{ticket.id.slice(0,8).toUpperCase()}</span>
          <button className="text-gray-400 hover:text-gray-600 text-sm px-1.5 py-0.5 rounded hover:bg-gray-100">⤢</button>
          <button className="text-gray-400 hover:text-gray-600 text-sm px-1.5 py-0.5 rounded hover:bg-gray-100">⋮</button>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">✕</button>
      </div>

      {/* Title */}
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-[15px] font-bold text-gray-900 leading-snug">{ticket.title}</h2>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
            {initials(ticket.client?.full_name)}
          </div>
          <span className="text-sm font-semibold text-gray-700">{ticket.client?.full_name || 'Unknown'}</span>
        </div>
        <span className="text-gray-300">·</span>
        <span className="text-xs text-gray-400">🕐 Opened {timeLabel(ticket.created_at)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-y border-gray-200 bg-gray-50 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
          <select
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white outline-none focus:border-blue-500 cursor-pointer font-medium"
            value={ticket.status}
            onChange={e => handleStatus(e.target.value)}
            disabled={updatingStatus}
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Priority</span>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${priorityBadge[ticket.priority] || 'bg-gray-100 text-gray-500'}`}>
            {ticket.priority}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Assignee</span>
          <span className="text-xs font-medium text-gray-700">
            {ticket.assignee?.full_name || <em className="text-gray-400 not-italic">Unassigned</em>}
          </span>
        </div>
        {ticket.slaPolicy && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">SLA</span>
            <span className="text-xs font-medium text-gray-700">{ticket.slaPolicy.resolution_time}h limit</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-4 py-2.5 text-sm text-gray-500 border-b border-gray-200 max-h-20 overflow-y-auto leading-relaxed">
        {ticket.description}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4">
        {[
          { key: 'communication', label: 'Communication', count: publicComments.length },
          { key: 'internal', label: 'Internal Notes 🔒', count: internalComments.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors
              ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
        {displayed.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">
            {tab === 'internal' ? 'No internal notes yet.' : 'No messages yet. Start the conversation.'}
          </p>
        ) : (
          displayed.map(c => {
            const isAgent = ['SupportOfficer', 'Developer', 'Admin'].includes(c.author?.role);
            return (
              <div key={c.comment_id} className={`flex items-end gap-2 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                  ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {initials(c.author?.full_name)}
                </div>
                <div className={`flex flex-col max-w-[75%] gap-1 ${isAgent ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isAgent
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                    {c.comment}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{timeLabel(c.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Reply box */}
      <div className="border-t border-gray-200 bg-gray-50 px-3.5 py-3">
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-blue-500 resize-none placeholder-gray-400 transition-colors"
          placeholder={tab === 'internal' ? 'Add an internal note...' : 'Type a reply to the client...'}
          rows={3}
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-600 text-base p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Attachment">📎</button>
            <button className="text-gray-400 hover:text-gray-600 text-base p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Templates">💬</button>
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !reply.trim()}
            className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? '…' : '➤'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-3.5 py-3 border-t border-gray-200">
        <button
          onClick={() => handleStatus('Resolved')}
          disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-colors
            ${ticket.status === 'Resolved' || ticket.status === 'Closed'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
        >
          ✓ {ticket.status === 'Resolved' ? 'Resolved' : 'Solve Ticket'}
        </button>
      </div>
    </div>
  );
}
