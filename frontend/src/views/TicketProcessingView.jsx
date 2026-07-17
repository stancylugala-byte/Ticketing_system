import { useState, useCallback, useEffect } from 'react';
import {
  getTicketById, updateTicketStatus, addComment,
  getComments, getTicketQueue, assignTicket
} from '../api/tickets';
import api from '../api/axios';

const STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  High:     'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
  Medium:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  Low:      'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
};

const statusStyle = s => ({
  Resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Closed:   'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400',
  Pending:  'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
}[s] || 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400');

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

// Shared card container
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const ActionCard = ({ icon, title, children }) => (
  <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 p-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-base">{icon}</span>
      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{title}</p>
    </div>
    {children}
  </div>
);

export default function TicketProcessingView({ initialTicket }) {
  const [ticketList,      setTicketList]      = useState([]);
  const [selected,        setSelected]        = useState(initialTicket || null);
  const [detail,          setDetail]          = useState(null);
  const [comments,        setComments]        = useState([]);
  const [developers,      setDevelopers]      = useState([]);

  // form state
  const [note,            setNote]            = useState('');
  const [reply,           setReply]           = useState('');
  const [showNoteBox,     setShowNoteBox]     = useState(false);
  const [showReplyBox,    setShowReplyBox]    = useState(false);
  const [showStatusDrop,  setShowStatusDrop]  = useState(false);
  const [showAssignDrop,  setShowAssignDrop]  = useState(false);

  // loading
  const [saving,          setSaving]          = useState(false);
  const [updatingStatus,  setUpdatingStatus]  = useState(false);
  const [assigning,       setAssigning]       = useState(false);

  // Load my assigned tickets on mount
  useEffect(() => {
    getTicketQueue({ queue: 'assigned', limit: 50 })
      .then(r => setTicketList(r.data.data.tickets || []))
      .catch(() => {});
    // Load developers for assignment
    api.get('/admin/users', { params: { role: 'Developer', limit: 50 } })
      .then(r => setDevelopers(r.data.data.users || []))
      .catch(() => {});
  }, []);

  // When initialTicket changes (e.g. opened from Queue view)
  useEffect(() => {
    if (initialTicket) loadTicket(initialTicket);
  }, [initialTicket?.id]);

  const loadComments = useCallback((ticketId) => {
    getComments(ticketId).then(r => setComments(r.data.data || [])).catch(() => {});
  }, []);

  const loadTicket = useCallback((ticket) => {
    setSelected(ticket);
    setShowNoteBox(false);
    setShowReplyBox(false);
    setShowStatusDrop(false);
    setShowAssignDrop(false);
    getTicketById(ticket.id).then(r => setDetail(r.data.data)).catch(() => setDetail(ticket));
    loadComments(ticket.id);
  }, [loadComments]);

  const handleStatusChange = async (status) => {
    if (!detail) return;
    setUpdatingStatus(true);
    setShowStatusDrop(false);
    try {
      const r = await updateTicketStatus(detail.id, status);
      setDetail(r.data.data);
    } finally { setUpdatingStatus(false); }
  };

  const handleAssign = async (developerId) => {
    if (!detail) return;
    setAssigning(true);
    setShowAssignDrop(false);
    try {
      const r = await assignTicket(detail.id, developerId);
      setDetail(r.data.data);
    } finally { setAssigning(false); }
  };

  const handleAddNote = async () => {
    if (!note.trim() || !detail) return;
    setSaving(true);
    try {
      await addComment(detail.id, note, true);
      setNote(''); setShowNoteBox(false);
      loadComments(detail.id);
    } finally { setSaving(false); }
  };

  const handleReply = async () => {
    if (!reply.trim() || !detail) return;
    setSaving(true);
    try {
      await addComment(detail.id, reply, false);
      setReply(''); setShowReplyBox(false);
      loadComments(detail.id);
    } finally { setSaving(false); }
  };

  const handleRequestInfo = async () => {
    if (!detail) return;
    await addComment(
      detail.id,
      'To help us resolve your issue faster, could you please provide additional details — error messages, steps to reproduce, and any relevant screenshots or logs?',
      false
    ).catch(() => {});
    loadComments(detail.id);
  };

  // Split comments
  const publicComments   = comments.filter(c => !c.is_internal);
  const internalComments = comments.filter(c =>  c.is_internal);

  // SLA breach indicator
  const slaBreached = detail?.slaPolicy && detail.status !== 'Resolved' && detail.status !== 'Closed'
    ? (Date.now() - new Date(detail.created_at).getTime()) > detail.slaPolicy.resolution_time * 60 * 60 * 1000
    : false;

  return (
    <div className="flex flex-col h-full gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Ticket Processing</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage, respond, escalate and resolve support tickets</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* ── Left: ticket list ── */}
        <Card className="w-72 shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 shrink-0">
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Assigned to Me</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
            {ticketList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">📭</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">No assigned tickets</p>
              </div>
            ) : ticketList.map(t => (
              <button key={t.id} onClick={() => loadTicket(t)}
                className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                  selected?.id === t.id
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-600'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-transparent'
                }`}>
                <p className="text-[11px] font-bold text-blue-600 mb-0.5">#{t.id.slice(0,8).toUpperCase()}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{t.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${priorityBadge[t.priority]}`}>{t.priority}</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">{timeAgo(t.created_at)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* ── Right: workspace ── */}
        {!detail ? (
          <Card className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 gap-3">
            <span className="text-5xl">👈</span>
            <p className="text-sm font-medium">Select a ticket from the list</p>
          </Card>
        ) : (
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">

            {/* Ticket header */}
            <Card>
              <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-blue-600">#{detail.id.slice(0,8).toUpperCase()}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityBadge[detail.priority]}`}>{detail.priority}</span>
                    {slaBreached && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">⚠ SLA BREACHED</span>}
                  </div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">{detail.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>Client: <span className="font-medium text-gray-700 dark:text-slate-300">{detail.client?.full_name || '—'}</span></span>
                    <span>Opened: <span className="font-medium text-gray-700 dark:text-slate-300">{timeAgo(detail.created_at)}</span></span>
                    {detail.assignee && <span>Assigned: <span className="font-medium text-gray-700 dark:text-slate-300">{detail.assignee.full_name}</span></span>}
                    {detail.slaPolicy && <span>SLA: <span className="font-medium text-gray-700 dark:text-slate-300">{detail.slaPolicy.resolution_time}h</span></span>}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 ${statusStyle(detail.status)}`}>
                  {detail.status}
                </span>
              </div>

              {/* Description */}
              <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{detail.description}</p>
              </div>

              {/* Actions grid */}
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                <div className="grid grid-cols-2 gap-3">

                  {/* Update Status */}
                  <ActionCard icon="🔄" title="Update Status">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Change the lifecycle state of this ticket.</p>
                    <div className="relative">
                      <button onClick={() => setShowStatusDrop(v => !v)} disabled={updatingStatus}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-slate-200 hover:border-blue-400 transition-colors">
                        <span>{updatingStatus ? 'Updating…' : detail.status}</span>
                        <span className="text-gray-400">▾</span>
                      </button>
                      {showStatusDrop && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-30 overflow-hidden">
                          {STATUSES.map(s => (
                            <button key={s} onClick={() => handleStatusChange(s)}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400 transition-colors ${detail.status === s ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-slate-300'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </ActionCard>

                  {/* Assign to Developer */}
                  <ActionCard icon="👨‍💻" title="Assign to Developer">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Escalate this ticket to a developer for a code-level fix.</p>
                    <div className="relative">
                      <button onClick={() => setShowAssignDrop(v => !v)} disabled={assigning}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-slate-200 hover:border-purple-400 transition-colors">
                        <span className="truncate">{assigning ? 'Assigning…' : (detail.assignee?.full_name || 'Select developer…')}</span>
                        <span className="text-gray-400 shrink-0 ml-1">▾</span>
                      </button>
                      {showAssignDrop && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-30 overflow-hidden max-h-48 overflow-y-auto">
                          {developers.length === 0 ? (
                            <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-3">No developers found</p>
                          ) : developers.map(dev => (
                            <button key={dev.id} onClick={() => handleAssign(dev.id)}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-400 ${
                                detail.assignee?.id === dev.id ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-slate-300'
                              }`}>
                              {dev.full_name} <span className="text-gray-400 dark:text-slate-500">— {dev.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </ActionCard>

                  {/* Add Internal Note */}
                  <ActionCard icon="📝" title="Add Internal Note">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Internal notes are only visible to support staff.</p>
                    {showNoteBox ? (
                      <div className="flex flex-col gap-2">
                        <textarea rows={3} placeholder="Internal note…" value={note} onChange={e => setNote(e.target.value)}
                          className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 dark:text-slate-200 outline-none focus:border-blue-400 resize-none placeholder-gray-400 dark:placeholder-slate-500" />
                        <div className="flex gap-2">
                          <button onClick={() => setShowNoteBox(false)} className="flex-1 py-1.5 text-xs text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">Cancel</button>
                          <button onClick={handleAddNote} disabled={saving || !note.trim()} className="flex-1 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {saving ? 'Saving…' : 'Save Note'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowNoteBox(true)} className="w-full py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        + Add Note
                      </button>
                    )}
                  </ActionCard>

                  {/* Reply to Client */}
                  <ActionCard icon="💬" title="Reply to Client">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Send a visible reply to the client on this ticket.</p>
                    {showReplyBox ? (
                      <div className="flex flex-col gap-2">
                        <textarea rows={3} placeholder="Your reply to the client…" value={reply} onChange={e => setReply(e.target.value)}
                          className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 dark:text-slate-200 outline-none focus:border-blue-400 resize-none placeholder-gray-400 dark:placeholder-slate-500" />
                        <div className="flex gap-2">
                          <button onClick={() => setShowReplyBox(false)} className="flex-1 py-1.5 text-xs text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">Cancel</button>
                          <button onClick={handleReply} disabled={saving || !reply.trim()} className="flex-1 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                            {saving ? 'Sending…' : 'Send Reply'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <button onClick={() => setShowReplyBox(true)} className="w-full py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                          ✉ Reply
                        </button>
                        <button onClick={handleRequestInfo} className="w-full py-2 text-xs font-semibold border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                          📋 Request More Info
                        </button>
                      </div>
                    )}
                  </ActionCard>
                </div>
              </div>
            </Card>

            {/* Ticket metadata */}
            <Card>
              <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Ticket Details</p>
              </div>
              <div className="px-5 py-4 grid grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Category',    value: detail.category?.category_name || '—' },
                  { label: 'SLA Target',  value: detail.slaPolicy ? `${detail.slaPolicy.resolution_time}h` : '—' },
                  { label: 'Created',     value: new Date(detail.created_at).toLocaleString() },
                  { label: 'Last Updated',value: new Date(detail.updated_at).toLocaleString() },
                  { label: 'Assigned To', value: detail.assignee?.full_name || 'Unassigned' },
                  { label: 'SLA Status',  value: slaBreached ? '⚠ Breached' : '✓ On Track' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-gray-400 dark:text-slate-500 mb-0.5">{label}</p>
                    <p className={`font-semibold ${label === 'SLA Status' ? (slaBreached ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400') : 'text-gray-700 dark:text-slate-300'}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Communication thread — public messages visible to client */}
            {publicComments.length > 0 && (
              <Card>
                <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    Client Communication Thread ({publicComments.length})
                  </p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {publicComments.map(c => {
                    const isStaff = c.author?.role !== 'Client';
                    return (
                      <div key={c.comment_id} className={`flex gap-2.5 ${isStaff ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${isStaff ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200'}`}>
                          {initials(c.author?.full_name)}
                        </div>
                        <div className={`flex-1 max-w-md rounded-xl px-3 py-2 ${isStaff ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20' : 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700'}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-semibold ${isStaff ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}>
                              {c.author?.full_name || 'System'}
                            </span>
                            <span className="text-[9px] text-gray-400 dark:text-slate-500">{timeAgo(c.created_at)}</span>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed">{c.comment}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Internal notes */}
            {internalComments.length > 0 && (
              <Card>
                <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-500/10">
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    🔒 Internal Notes ({internalComments.length}) — Not visible to client
                  </p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {internalComments.map(c => (
                    <div key={c.comment_id} className="flex gap-2.5">
                      <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {initials(c.author?.full_name)}
                      </div>
                      <div className="flex-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">{c.author?.full_name || 'Staff'}</span>
                          <span className="text-[9px] text-gray-400 dark:text-slate-500">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed">{c.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
