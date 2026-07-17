import { useState, useCallback, useEffect } from 'react';
import {
  getTicketById, updateTicketStatus, addComment,
  getComments, getTicketQueue, assignTicket, getTicketAttachments
} from '../api/tickets';
import api from '../api/axios';
import { API_BASE } from '../api/axios';

const STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
  High:     'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
  Medium:   'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
  Low:      'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
};

const statusBadge = s => ({
  Resolved:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Closed:       'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400',
  Pending:      'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  'In Progress':'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
}[s] || 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400');

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
  return (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// Shared styles
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionHead = ({ children }) => (
  <div className="px-5 py-2.5 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/60">
    <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{children}</p>
  </div>
);

const inputCls = `w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs 
  bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 
  outline-none focus:border-blue-400 resize-none 
  placeholder-gray-400 dark:placeholder-slate-500`;

export default function TicketProcessingView({ initialTicket }) {
  const [ticketList,     setTicketList]     = useState([]);
  const [selected,       setSelected]       = useState(initialTicket || null);
  const [detail,         setDetail]         = useState(null);
  const [comments,       setComments]       = useState([]);
  const [attachments,    setAttachments]    = useState([]);
  const [lightbox,       setLightbox]       = useState(null); // url of image to preview
  const [developers,     setDevelopers]     = useState([]);
  const [selectedDev,    setSelectedDev]    = useState(null); // staged developer before confirm
  const [note,           setNote]           = useState('');
  const [reply,          setReply]          = useState('');
  const [showNote,       setShowNote]       = useState(false);
  const [showReply,      setShowReply]      = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showAssignDrop, setShowAssignDrop] = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [updStatus,      setUpdStatus]      = useState(false);
  const [assigning,      setAssigning]      = useState(false);
  const [commTab,        setCommTab]        = useState('public'); // 'public' | 'internal'

  // Load ticket list + developer list on mount
  useEffect(() => {
    getTicketQueue({ queue: 'assigned', limit: 50 })
      .then(r => setTicketList(r.data.data.tickets || []))
      .catch(() => {});
    // Use dedicated developers endpoint accessible to all authenticated staff
    api.get('/tickets/developers')
      .then(r => setDevelopers(r.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialTicket) loadTicket(initialTicket);
  }, [initialTicket?.id]);

  const loadComments = useCallback((id) => {
    getComments(id).then(r => setComments(r.data.data || [])).catch(() => setComments([]));
  }, []);

  const loadAttachments = useCallback((id) => {
    getTicketAttachments(id).then(r => setAttachments(r.data.data || [])).catch(() => setAttachments([]));
  }, []);

  const loadTicket = useCallback((t) => {
    setSelected(t);
    setShowNote(false); setShowReply(false);
    setShowStatusDrop(false); setShowAssignDrop(false);
    setSelectedDev(null);
    setAttachments([]);
    getTicketById(t.id)
      .then(r => setDetail(r.data.data))
      .catch(() => setDetail(t));
    loadComments(t.id);
    loadAttachments(t.id);
  }, [loadComments, loadAttachments]);

  const doStatusChange = async (s) => {
    if (!detail) return;
    setUpdStatus(true); setShowStatusDrop(false);
    try { const r = await updateTicketStatus(detail.id, s); setDetail(r.data.data); }
    catch (e) { console.error(e); }
    finally { setUpdStatus(false); }
  };

  const doAssign = async (devId) => {
    if (!detail) return;
    setAssigning(true); setShowAssignDrop(false);
    try { const r = await assignTicket(detail.id, devId); setDetail(r.data.data); setSelectedDev(null); }
    catch (e) { console.error(e); }
    finally { setAssigning(false); }
  };

  const doNote = async () => {
    if (!note.trim() || !detail) return;
    setSaving(true);
    try { await addComment(detail.id, note, true); setNote(''); setShowNote(false); loadComments(detail.id); }
    finally { setSaving(false); }
  };

  const doReply = async () => {
    if (!reply.trim() || !detail) return;
    setSaving(true);
    try { await addComment(detail.id, reply, false); setReply(''); setShowReply(false); loadComments(detail.id); }
    finally { setSaving(false); }
  };

  const doRequestInfo = async () => {
    if (!detail) return;
    await addComment(detail.id, 'To help us resolve your issue faster, please provide additional details — error messages, steps to reproduce, and any relevant screenshots or logs.', false).catch(() => {});
    loadComments(detail.id);
  };

  const publicComments   = comments.filter(c => !c.is_internal);
  const internalComments = comments.filter(c =>  c.is_internal);

  const slaBreached = detail?.slaPolicy
    && !['Resolved','Closed'].includes(detail.status)
    && (Date.now() - new Date(detail.created_at).getTime()) > detail.slaPolicy.resolution_time * 3600000;

  // Parse org/system from tag field
  const parseTag = (tag) => {
    if (!tag) return null;
    const org = tag.match(/Organisation:\s*([^|]+)/)?.[1]?.trim();
    const sys = tag.match(/System:\s*([^|]+)/)?.[1]?.trim();
    return (org || sys) ? { org, sys } : null;
  };
  const tagInfo = detail ? parseTag(detail.tag) : null;

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Ticket Processing</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage, respond, escalate and resolve support tickets</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* ── Left: ticket list ── */}
        <Card className="w-72 shrink-0 flex flex-col overflow-hidden">
          <SectionHead>Assigned to Me ({ticketList.length})</SectionHead>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
            {ticketList.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <span className="text-3xl">📭</span>
                <p className="text-xs text-gray-400 dark:text-slate-500">No assigned tickets</p>
              </div>
            ) : ticketList.map(t => (
              <button key={t.id} onClick={() => loadTicket(t)}
                className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                  selected?.id === t.id
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-transparent'
                }`}>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-0.5">#{t.id.slice(0,8).toUpperCase()}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{t.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${priorityBadge[t.priority] || ''}`}>{t.priority}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${statusBadge(t.status)}`}>{t.status}</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{timeAgo(t.created_at)}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* ── Right: workspace ── */}
        {!detail ? (
          <Card className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-slate-500">
            <span className="text-5xl">👈</span>
            <p className="text-sm font-medium">Select a ticket from the list to start processing</p>
          </Card>
        ) : (
          <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">

            {/* ── Ticket header ── */}
            <Card>
              <div className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">#{detail.id.slice(0,8).toUpperCase()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityBadge[detail.priority] || ''}`}>{detail.priority}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge(detail.status)}`}>{detail.status}</span>
                    {slaBreached && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">⚠ SLA BREACHED</span>}
                  </div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{detail.title}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-gray-500 dark:text-slate-400">
                    <span>Client: <strong className="text-gray-700 dark:text-slate-300">{detail.client?.full_name || '—'}</strong></span>
                    <span>Opened: <strong className="text-gray-700 dark:text-slate-300">{timeAgo(detail.created_at)}</strong></span>
                    {detail.assignee && <span>Assigned to: <strong className="text-gray-700 dark:text-slate-300">{detail.assignee.full_name}</strong></span>}
                    {detail.slaPolicy && <span>SLA: <strong className="text-gray-700 dark:text-slate-300">{detail.slaPolicy.resolution_time}h resolve</strong></span>}
                  </div>
                  {/* Organisation & System */}
                  {tagInfo && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tagInfo.org && (
                        <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-2 py-0.5 rounded-full">
                          🏢 {tagInfo.org}
                        </span>
                      )}
                      {tagInfo.sys && (
                        <span className="inline-flex items-center gap-1 text-xs bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 px-2 py-0.5 rounded-full">
                          💻 {tagInfo.sys}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="px-5 pb-4 border-t border-gray-100 dark:border-slate-700 pt-3">
                <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{detail.description}</p>
              </div>
            </Card>

            {/* ── Attachments (screenshots) ── */}
            {attachments.length > 0 && (
              <Card>
                <SectionHead>Screenshots & Attachments ({attachments.length})</SectionHead>
                <div className="px-5 py-4 flex flex-wrap gap-3">
                  {attachments.map(a => (
                    <button
                      key={a.attachment_id}
                      type="button"
                      onClick={() => setLightbox(`http://localhost:5000${a.file_path}`)}
                      className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      title={a.file_name}
                    >
                      <img
                        src={`http://localhost:5000${a.file_path}`}
                        alt={a.file_name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🔍 View</span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="px-5 pb-3 text-[10px] text-gray-400 dark:text-slate-500">Click any image to view full size</p>
              </Card>
            )}

            {/* ── Ticket metadata ── */}
            <Card>              <SectionHead>Ticket Details</SectionHead>
              <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {[
                  { label: 'Category',     value: detail.category?.category_name || '—' },
                  { label: 'Priority',     value: detail.priority },
                  { label: 'SLA Target',   value: detail.slaPolicy ? `${detail.slaPolicy.response_time}h response / ${detail.slaPolicy.resolution_time}h resolve` : '—' },
                  { label: 'Status',       value: detail.status },
                  { label: 'Assigned To',  value: detail.assignee?.full_name || 'Unassigned' },
                  { label: 'SLA Status',   value: slaBreached ? '⚠ Breached' : '✓ On Track', breach: true },
                  { label: 'Created',      value: new Date(detail.created_at).toLocaleString('en-GB') },
                  { label: 'Last Updated', value: new Date(detail.updated_at).toLocaleString('en-GB') },
                  ...(detail.tag ? [{ label: 'Client Context', value: detail.tag }] : []),
                ].map(({ label, value, breach }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                    <p className={`text-sm font-semibold ${
                      label === 'SLA Status'
                        ? (slaBreached ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')
                        : label === 'Client Context'
                          ? 'text-indigo-600 dark:text-indigo-400 text-xs break-all'
                          : 'text-gray-800 dark:text-slate-200'
                    }`}>{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Actions ── */}
            <Card>
              <SectionHead>Actions</SectionHead>
              <div className="p-4 grid grid-cols-2 gap-3">

                {/* Update Status */}
                <div className="rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">🔄 Update Status</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Change the lifecycle state of this ticket.</p>
                  <div className="relative">
                    <button onClick={() => { setShowStatusDrop(v => !v); setShowAssignDrop(false); }}
                      disabled={updStatus}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <span>{updStatus ? 'Updating…' : `Current: ${detail.status}`}</span>
                      <span className="text-gray-400 dark:text-slate-500 ml-1">▾</span>
                    </button>
                    {showStatusDrop && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-xl z-40 overflow-hidden">
                        {STATUSES.map(s => (
                          <button key={s} onClick={() => doStatusChange(s)}
                            className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${
                              detail.status === s
                                ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold'
                                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Assign to Developer */}
                <div className="rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">👨‍💻 Escalate to Developer</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Assign to a developer for a code-level fix.</p>

                  {/* Current assignee chip */}
                  {detail.assignee && !selectedDev && (
                    <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-lg">
                      <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0" />
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 truncate">
                        Assigned: {detail.assignee.full_name}
                      </span>
                    </div>
                  )}

                  {/* Developer selector */}
                  <div className="relative mb-2">
                    <button
                      onClick={() => { setShowAssignDrop(v => !v); setShowStatusDrop(false); }}
                      disabled={assigning}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                      <span className="truncate">
                        {selectedDev
                          ? `✓ ${selectedDev.full_name}`
                          : 'Select developer…'}
                      </span>
                      <span className="text-gray-400 dark:text-slate-500 ml-1 shrink-0">▾</span>
                    </button>

                    {showAssignDrop && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-xl z-40 overflow-hidden max-h-52 overflow-y-auto">
                        {developers.length === 0
                          ? <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4">No developers available</p>
                          : developers.map(dev => (
                            <button key={dev.id}
                              onClick={() => { setSelectedDev(dev); setShowAssignDrop(false); }}
                              className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${
                                selectedDev?.id === dev.id
                                  ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold'
                                  : detail.assignee?.id === dev.id
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
                                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                              }`}>
                              <span className="font-medium">{dev.full_name}</span>
                              {detail.assignee?.id === dev.id && <span className="ml-1 text-[9px] text-indigo-500 dark:text-indigo-400">(current)</span>}
                              <span className="block text-[10px] text-gray-400 dark:text-slate-500">{dev.email}</span>
                            </button>
                          ))
                        }
                      </div>
                    )}
                  </div>

                  {/* Escalate confirm button — only shows after a dev is selected */}
                  {selectedDev ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDev(null)}
                        className="flex-1 py-2 text-xs font-semibold border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={() => doAssign(selectedDev.id)}
                        disabled={assigning}
                        className="flex-1 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5">
                        {assigning
                          ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Escalating…</>
                          : <>🚀 Escalate to {selectedDev.full_name.split(' ')[0]}</>
                        }
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 italic">
                      Select a developer above, then confirm escalation.
                    </p>
                  )}
                </div>

                {/* Add Internal Note */}
                <div className="rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">📝 Internal Note</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Private — only visible to support staff.</p>
                  {showNote ? (
                    <div className="flex flex-col gap-2">
                      <textarea rows={3} placeholder="Write internal note…" value={note} onChange={e => setNote(e.target.value)} className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => setShowNote(false)} className="flex-1 py-1.5 text-xs text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={doNote} disabled={saving || !note.trim()} className="flex-1 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                          {saving ? 'Saving…' : 'Save Note'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setShowNote(true); setShowReply(false); }} className="w-full py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      + Add Note
                    </button>
                  )}
                </div>

                {/* Reply to Client */}
                <div className="rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">💬 Reply to Client</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Visible to the client on their portal.</p>
                  {showReply ? (
                    <div className="flex flex-col gap-2">
                      <textarea rows={3} placeholder="Your message to the client…" value={reply} onChange={e => setReply(e.target.value)} className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => setShowReply(false)} className="flex-1 py-1.5 text-xs text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={doReply} disabled={saving || !reply.trim()} className="flex-1 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                          {saving ? 'Sending…' : 'Send Reply'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => { setShowReply(true); setShowNote(false); }} className="w-full py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        ✉ Send Reply
                      </button>
                      <button onClick={doRequestInfo} className="w-full py-2 text-xs font-bold border border-blue-300 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                        📋 Request More Info
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* ── Communication thread ── */}
            <Card>
              <div className="px-5 py-2.5 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/60 flex items-center gap-3">
                <button onClick={() => setCommTab('public')}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${commTab === 'public' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                  Client Thread ({publicComments.length})
                </button>
                <button onClick={() => setCommTab('internal')}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${commTab === 'internal' ? 'bg-amber-500 text-white' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                  🔒 Internal Notes ({internalComments.length})
                </button>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3 min-h-[80px]">
                {commTab === 'public' && (
                  publicComments.length === 0
                    ? <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4">No client messages yet. Use "Send Reply" above to start the conversation.</p>
                    : publicComments.map(c => {
                        const isStaff = c.author?.role !== 'Client';
                        return (
                          <div key={c.comment_id} className={`flex gap-2.5 ${isStaff ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isStaff ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-200'}`}>
                              {initials(c.author?.full_name)}
                            </div>
                            <div className={`flex-1 max-w-lg rounded-xl px-3 py-2.5 ${isStaff ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20' : 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[11px] font-semibold ${isStaff ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-slate-200'}`}>{c.author?.full_name || 'System'}</span>
                                <span className="text-[10px] text-gray-400 dark:text-slate-500">{timeAgo(c.created_at)}</span>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed">{c.comment}</p>
                            </div>
                          </div>
                        );
                      })
                )}
                {commTab === 'internal' && (
                  internalComments.length === 0
                    ? <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4">No internal notes yet.</p>
                    : internalComments.map(c => (
                        <div key={c.comment_id} className="flex gap-2.5">
                          <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{initials(c.author?.full_name)}</div>
                          <div className="flex-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">{c.author?.full_name || 'Staff'}</span>
                              <span className="text-[10px] text-gray-400 dark:text-slate-500">{timeAgo(c.created_at)}</span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed">{c.comment}</p>
                          </div>
                        </div>
                      ))
                )}
              </div>
            </Card>

          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl font-bold leading-none"
            >×</button>
            <img
              src={lightbox}
              alt="Attachment preview"
              className="max-h-[85vh] max-w-full rounded-xl shadow-2xl object-contain"
            />
            <a
              href={lightbox}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline"
              onClick={e => e.stopPropagation()}
            >
              Open in new tab ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
