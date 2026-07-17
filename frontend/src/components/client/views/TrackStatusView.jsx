import { useEffect, useState, useCallback } from 'react';
import { getMyTickets, submitFeedback, getFeedback } from '../../../api/clientApi';

const STAGES = ['Open','In Progress','Pending','Resolved','Closed'];
const stageIndex = { Open:0, 'In Progress':1, Pending:2, Resolved:3, Closed:4 };

const statusBadge = {
  Open:         'bg-blue-100 text-blue-700',
  'In Progress':'bg-yellow-100 text-yellow-700',
  Pending:      'bg-purple-100 text-purple-700',
  Resolved:     'bg-emerald-100 text-emerald-700',
  Closed:       'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
};
const priorityBadge = {
  Critical:'bg-red-100 text-red-700',
  High:    'bg-orange-100 text-orange-700',
  Medium:  'bg-yellow-100 text-yellow-700',
  Low:     'bg-green-100 text-green-700',
};

// ── CSAT Widget ───────────────────────────────────────────────────────────────
function CsatWidget({ ticketId, onSubmitted }) {
  const [existing, setExisting]   = useState(undefined); // undefined=loading, null=none
  const [rating,   setRating]     = useState(0);
  const [hovered,  setHovered]    = useState(0);
  const [comment,  setComment]    = useState('');
  const [saving,   setSaving]     = useState(false);
  const [done,     setDone]       = useState(false);
  const [err,      setErr]        = useState('');

  useEffect(() => {
    getFeedback(ticketId)
      .then(r => { setExisting(r.data.data); if (r.data.data) { setRating(r.data.data.rating); setComment(r.data.data.comment || ''); } })
      .catch(() => setExisting(null));
  }, [ticketId]);

  const handle = async () => {
    if (rating < 1) return setErr('Please select a star rating.');
    setSaving(true); setErr('');
    try {
      await submitFeedback(ticketId, rating, comment);
      setDone(true);
      onSubmitted?.();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to submit feedback.');
    } finally { setSaving(false); }
  };

  if (existing === undefined) return null; // still loading

  if (done || existing) {
    return (
      <div className="mt-4 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center gap-3">
        <span className="text-xl">⭐</span>
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Feedback submitted — {existing?.rating ?? rating}/5 stars
          </p>
          {(existing?.comments || comment) && (
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">"{existing?.comments || comment}"</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">How was your experience?</p>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Rate your support experience to close this ticket.</p>

      {/* Star selector */}
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map(s => (
          <button key={s} type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            className={`text-2xl transition-transform hover:scale-110 ${
              s <= (hovered || rating) ? 'text-amber-400' : 'text-gray-300 dark:text-slate-600'
            }`}>★</button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-xs font-semibold text-amber-600 dark:text-amber-400 self-center">
            {['','Poor','Fair','Good','Great','Excellent'][rating]}
          </span>
        )}
      </div>

      <textarea
        rows={2} placeholder="Optional comment…"
        value={comment} onChange={e => setComment(e.target.value)}
        className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 resize-none focus:outline-none focus:border-blue-500 placeholder-gray-400 dark:placeholder-slate-500"
      />
      {err && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{err}</p>}
      <button onClick={handle} disabled={saving || rating < 1}
        className="mt-2 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {saving ? 'Submitting…' : 'Submit Feedback & Close Ticket'}
      </button>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function TrackStatusView() {
  const [tickets,  setTickets]  = useState([]);
  const [filter,   setFilter]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const p = { limit: 50 };
    if (filter) p.status = filter;
    getMyTickets(p)
      .then(r => setTickets(r.data.data.tickets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Track Status</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Monitor progress and submit feedback when your ticket is resolved.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['','Open','In Progress','Pending','Resolved','Closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400 dark:text-slate-500 gap-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <span className="text-3xl">📊</span>
          <p className="text-sm">No tickets found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map(t => {
            const idx   = stageIndex[t.status] ?? 0;
            const isExp = expanded === t.id;
            const canRate = ['Resolved','Closed'].includes(t.status);

            return (
              <div key={t.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="px-5 py-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : t.id)}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityBadge[t.priority]}`}>{t.priority}</span>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[t.status]}`}>{t.status}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{t.title}</p>
                      {t.assignee && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Assigned to: {t.assignee.full_name}</p>}
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform shrink-0 mt-1 ${isExp ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Progress stepper */}
                  <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 dark:bg-slate-700 rounded-full" />
                    <div className="absolute top-5 left-0 h-1 bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${(idx / (STAGES.length - 1)) * 100}%` }} />
                    <div className="flex justify-between relative z-10">
                      {STAGES.map((s, i) => (
                        <div key={s} className="flex flex-col items-center gap-1.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                            ${i < idx  ? 'bg-emerald-500 text-white'
                              : i === idx ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                              : 'bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500'}`}>
                            {i < idx ? '✓' : i === idx ? '●' : '○'}
                          </div>
                          <span className={`text-[9px] font-semibold whitespace-nowrap
                            ${i === idx ? 'text-blue-600' : i < idx ? 'text-emerald-600' : 'text-gray-400 dark:text-slate-500'}`}>
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded details + CSAT */}
                {isExp && (
                  <div className="border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-5 py-4">
                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div><span className="text-gray-400 dark:text-slate-500">Category:</span> <span className="font-medium text-gray-700 dark:text-slate-300">{t.category?.category_name || '—'}</span></div>
                      <div><span className="text-gray-400 dark:text-slate-500">SLA:</span> <span className="font-medium text-gray-700 dark:text-slate-300">{t.slaPolicy ? `${t.slaPolicy.resolution_time}h target` : '—'}</span></div>
                      <div><span className="text-gray-400 dark:text-slate-500">Created:</span> <span className="font-medium text-gray-700 dark:text-slate-300">{new Date(t.created_at).toLocaleDateString()}</span></div>
                      <div><span className="text-gray-400 dark:text-slate-500">Updated:</span> <span className="font-medium text-gray-700 dark:text-slate-300">{new Date(t.updated_at).toLocaleDateString()}</span></div>
                      {t.tag && (
                        <div className="col-span-2">
                          <span className="text-gray-400 dark:text-slate-500">Context:</span>{' '}
                          <span className="font-medium text-gray-700 dark:text-slate-300">{t.tag}</span>
                        </div>
                      )}
                    </div>

                    {/* CSAT form shown for resolved/closed tickets */}
                    {canRate && <CsatWidget ticketId={t.id} onSubmitted={load} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
