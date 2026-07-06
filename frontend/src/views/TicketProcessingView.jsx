import { useState, useCallback, useEffect } from 'react';
import { getTicketById, updateTicketStatus, addComment, getComments, getTicketQueue } from '../api/tickets';

const STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-yellow-100 text-yellow-700',
  Low:      'bg-green-100 text-green-700',
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

export default function TicketProcessingView({ initialTicket }) {
  const [ticketList, setTicketList] = useState([]);
  const [selected, setSelected]     = useState(initialTicket || null);
  const [detail, setDetail]         = useState(null);
  const [comments, setComments]     = useState([]);
  const [note, setNote]             = useState('');
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);

  // Load ticket list once on mount
  useEffect(() => {
    getTicketQueue({ queue: 'assigned', limit: 20 })
      .then(r => setTicketList(r.data.data.tickets || []))
      .catch(() => {});
  }, []);

  const loadTicket = useCallback((ticket) => {
    setSelected(ticket);
    setShowNoteBox(false);
    setShowStatusDrop(false);
    getTicketById(ticket.id).then(r => setDetail(r.data.data)).catch(() => setDetail(ticket));
    getComments(ticket.id).then(r => setComments(r.data.data || [])).catch(() => {});
  }, []);

  const handleStatusChange = async (status) => {
    if (!detail) return;
    setUpdatingStatus(true);
    setShowStatusDrop(false);
    try {
      const r = await updateTicketStatus(detail.id, status);
      setDetail(r.data.data);
    } finally { setUpdatingStatus(false); }
  };

  const handleAddNote = async () => {
    if (!note.trim() || !detail) return;
    setSaving(true);
    try {
      await addComment(detail.id, note, true);
      setNote('');
      setShowNoteBox(false);
      const r = await getComments(detail.id);
      setComments(r.data.data || []);
    } finally { setSaving(false); }
  };

  const handleRequestInfo = async () => {
    if (!detail) return;
    await addComment(detail.id, 'To help us resolve this issue faster, could you please provide additional diagnostic information, error logs, or steps to reproduce the problem?', false).catch(() => {});
    const r = await getComments(detail.id);
    setComments(r.data.data || []);
  };

  return (
    <div className="flex flex-col h-full gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Ticket Processing</h1>
        <p className="text-sm text-gray-500 mt-0.5">View details, update status, add notes, and request information</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left — ticket picker */}
        <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned to Me</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {ticketList.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No assigned tickets</p>
            ) : (
              ticketList.map(t => (
                <button
                  key={t.id}
                  onClick={() => loadTicket(t)}
                  className={`w-full text-left px-4 py-3 transition-colors
                    ${selected?.id === t.id ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-gray-50 border-l-2 border-transparent'}`}
                >
                  <p className="text-[11px] font-bold text-blue-600 mb-0.5">#{t.id.slice(0,8).toUpperCase()}</p>
                  <p className="text-xs font-semibold text-gray-800 truncate">{t.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(t.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right — workspace */}
        {!detail ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-3">
            <span className="text-4xl">👈</span>
            <p className="text-sm font-medium">Select a ticket from the list to start processing</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">

            {/* Ticket detail card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
              {/* Card header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600">#{detail.id.slice(0,8).toUpperCase()}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityBadge[detail.priority] || 'bg-gray-100 text-gray-500'}`}>{detail.priority}</span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">{detail.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Client: <span className="font-medium text-gray-700">{detail.client?.full_name || '—'}</span>
                    <span className="mx-2 text-gray-300">·</span>
                    Opened {timeAgo(detail.created_at)}
                    {detail.assignee && <><span className="mx-2 text-gray-300">·</span>Assigned to <span className="font-medium text-gray-700">{detail.assignee.full_name}</span></>}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg
                  ${detail.status === 'Resolved' || detail.status === 'Closed' ? 'bg-emerald-50 text-emerald-700' : detail.status === 'Pending' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                  {detail.status}
                </span>
              </div>

              {/* Description */}
              <div className="px-5 py-4 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{detail.description}</p>
              </div>

              {/* Action buttons */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</p>
                <div className="grid grid-cols-2 gap-3">

                  {/* View Ticket Details */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">🔍</span>
                      <p className="text-sm font-semibold text-gray-800">View Ticket Details</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Access full ticket properties, deployment tags and system logs.</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs"><span className="text-gray-400">Category</span><span className="font-medium text-gray-700">{detail.category?.category_name || '—'}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-gray-400">SLA Limit</span><span className="font-medium text-gray-700">{detail.slaPolicy ? `${detail.slaPolicy.resolution_time}h` : '—'}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-gray-400">Created</span><span className="font-medium text-gray-700">{new Date(detail.created_at).toLocaleDateString()}</span></div>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">🔄</span>
                      <p className="text-sm font-semibold text-gray-800">Update Status</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Modify the live lifecycle state of this ticket.</p>
                    <div className="relative">
                      <button
                        onClick={() => setShowStatusDrop(v => !v)}
                        disabled={updatingStatus}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 hover:border-blue-400 transition-colors"
                      >
                        <span>{updatingStatus ? 'Updating...' : detail.status}</span>
                        <span className="text-gray-400">▾</span>
                      </button>
                      {showStatusDrop && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          {STATUSES.map(s => (
                            <button key={s} onClick={() => handleStatusChange(s)}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors ${detail.status === s ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Notes */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">📝</span>
                      <p className="text-sm font-semibold text-gray-800">Add Notes</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Attach internal administrative notes to the ticket log.</p>
                    {showNoteBox ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white outline-none focus:border-blue-400 resize-none"
                          placeholder="Write your internal note..."
                          rows={3}
                          value={note}
                          onChange={e => setNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => setShowNoteBox(false)} className="flex-1 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100">Cancel</button>
                          <button onClick={handleAddNote} disabled={saving || !note.trim()} className="flex-1 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {saving ? 'Saving...' : 'Save Note'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowNoteBox(true)} className="w-full py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        + Add Note
                      </button>
                    )}
                  </div>

                  {/* Request More Information */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">📋</span>
                      <p className="text-sm font-semibold text-gray-800">Request More Information</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Trigger an automated message to the client requesting debug logs.</p>
                    <button onClick={handleRequestInfo} className="w-full py-2 text-xs font-semibold border border-blue-200 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      Send Request
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal notes log */}
            {comments.filter(c => c.is_internal).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 shrink-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Internal Notes</p>
                <div className="flex flex-col gap-2">
                  {comments.filter(c => c.is_internal).map(c => (
                    <div key={c.comment_id} className="flex gap-2.5">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        {initials(c.author?.full_name)}
                      </div>
                      <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-700">{c.comment}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{c.author?.full_name} · {timeAgo(c.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
