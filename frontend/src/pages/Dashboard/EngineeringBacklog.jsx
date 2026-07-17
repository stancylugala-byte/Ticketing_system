import React, { useState, useEffect, useCallback } from 'react';
import {
  FiAlertTriangle, FiCheckSquare, FiRefreshCw, FiSearch,
  FiActivity, FiZap, FiTool, FiCheck, FiUser
} from 'react-icons/fi';
import {
  fetchDevKPIs, fetchBugs, fetchBugById, updateBugStatus,
  addBugNote, fetchOpenIncidents, fetchCriticalIncidents,
  logWorkHours, submitResolution, fetchDevPerformance
} from '../../api/developerApi';
import { useAuth } from '../../context/AuthContext';
import { useSystemSettings } from '../../context/SystemSettingsContext';

// ─── badge helpers (status-specific color, theme-agnostic via semantic classes) ─
const priorityBadge = p => ({
  Critical: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30',
  High:     'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30',
  Medium:   'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30',
  Low:      'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30',
}[p] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-600');

const statusBadge = s => ({
  Open:          'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
  'In Progress': 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30',
  Pending:       'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30',
  Resolved:      'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30',
  Closed:        'bg-gray-100 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600/50',
}[s] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400');

const fmt  = d => d ? new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const fmtT = d => d ? new Date(d).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';

// ─── Shared micro-components ──────────────────────────────────────────────────
const SLabel = ({ children }) => (
  <p className="text-gray-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{children}</p>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl ${className}`}>
    {children}
  </div>
);

const TInput = ({ className = '', ...p }) => (
  <input {...p}
    className={`bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-500 ${className}`}
  />
);

const TArea = ({ className = '', ...p }) => (
  <textarea {...p}
    className={`w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-slate-100 text-sm resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-500 ${className}`}
  />
);

const Btn = ({ children, onClick, disabled, variant = 'primary', primaryColor }) => {
  const base = 'text-xs px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 font-medium';
  if (variant === 'primary') return (
    <button onClick={onClick} disabled={disabled}
      className={`${base} text-white`}
      style={{ background: primaryColor || '#2563EB' }}>
      {children}
    </button>
  );
  const variants = {
    green:  'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white',
    slate:  'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-100',
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant] || variants.slate}`}>{children}</button>;
};

const Toast = ({ msg, err }) => {
  if (msg) return <div className="text-xs text-green-700 dark:text-emerald-400 bg-green-50 dark:bg-emerald-500/10 border border-green-200 dark:border-emerald-500/20 rounded-lg px-3 py-2">{msg}</div>;
  if (err) return <div className="text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{err}</div>;
  return null;
};

const Spin = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Empty = ({ icon: Icon, msg }) => (
  <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400 dark:text-slate-500">
    <Icon size={32} className="mb-3 opacity-30" />
    <p className="text-sm text-center max-w-xs">{msg}</p>
  </div>
);

// ─── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon: Icon, accent }) => (
  <Card className="p-4 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
      <Icon size={16} className="text-white" />
    </div>
    <div>
      <p className="text-gray-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-gray-900 dark:text-white text-xl font-bold">{value ?? '—'}</p>
    </div>
  </Card>
);

// ─── Ticket card in list ───────────────────────────────────────────────────────
const TicketCard = ({ t, selected, onClick, primaryColor }) => (
  <button onClick={() => onClick(t)}
    className={`w-full text-left p-3 rounded-xl border transition-all ${
      selected
        ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10'
        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-sm'
    }`}
    style={selected ? { borderColor: primaryColor, background: `${primaryColor}15` } : {}}
  >
    <p className="text-gray-900 dark:text-slate-100 text-sm font-medium leading-snug line-clamp-2">{t.title}</p>
    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityBadge(t.priority)}`}>{t.priority}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusBadge(t.status)}`}>{t.status}</span>
      <span className="text-gray-400 dark:text-slate-500 text-[10px] ml-auto">{t.category?.category_name || 'General'}</span>
    </div>
  </button>
);

// ─── Detail / workspace panel ─────────────────────────────────────────────────
const DetailView = ({ bug, view, onStatusChange, onAction, primaryColor }) => {
  const [note,    setNote]    = useState('');
  const [hours,   setHours]   = useState('');
  const [wDesc,   setWDesc]   = useState('');
  const [resNote, setResNote] = useState('');
  const [rca,     setRca]     = useState('');
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [err,     setErr]     = useState('');

  useEffect(() => { setNote(''); setHours(''); setWDesc(''); setResNote(''); setRca(''); setMsg(''); setErr(''); }, [bug?.id, view]);

  const flash  = m => { setMsg(m); setErr('');  setTimeout(() => setMsg(''), 3500); };
  const flashE = e => { setErr(e); setMsg('');  setTimeout(() => setErr(''), 3500); };

  if (!bug) return <Empty icon={FiTool} msg="Select a ticket from the list to open its workspace" />;

  const doStatus = async s => {
    setSaving(true);
    try { await onStatusChange(bug.id, s); flash(`Status updated to "${s}"`); }
    catch { flashE('Failed to update status'); }
    setSaving(false);
  };

  const doNote = async () => {
    if (!note.trim()) return flashE('Note cannot be empty');
    setSaving(true);
    try { await onAction('note', bug.id, { comment: note }); setNote(''); flash('Note added'); }
    catch { flashE('Failed to save note'); }
    setSaving(false);
  };

  const doWorkLog = async () => {
    if (!hours || +hours <= 0 || !wDesc.trim()) return flashE('Enter valid hours and description');
    setSaving(true);
    try { await onAction('worklog', bug.id, { hours: +hours, description: wDesc }); setHours(''); setWDesc(''); flash(`Logged ${hours}h`); }
    catch { flashE('Failed to save work log'); }
    setSaving(false);
  };

  const doRes = async (type, content, clear) => {
    if (!content.trim()) return flashE('Content cannot be empty');
    setSaving(true);
    try { await onAction('resolution', bug.id, { type, content }); clear(); flash(type === 'rca' ? 'RCA saved' : 'Resolution saved — ticket set to Resolved'); }
    catch { flashE('Failed to save'); }
    setSaving(false);
  };

  const comments = bug.comments || [];
  const workLogs = comments.filter(c => c.comment?.startsWith('[WORK LOG]'));
  const resoLogs = comments.filter(c => c.comment?.startsWith('[RESOLUTION NOTE]'));
  const rcaLogs  = comments.filter(c => c.comment?.startsWith('[ROOT CAUSE ANALYSIS]'));

  const show = {
    status:     ['assigned-bugs','bug-status','open-incidents','critical-incidents','update-progress'].includes(view),
    note:       ['assigned-bugs','bug-details'].includes(view),
    worklog:    ['log-hours','update-progress','assigned-bugs'].includes(view),
    resolution: ['resolution-notes','incident-resolution','assigned-bugs'].includes(view),
    rca:        ['rca','assigned-bugs'].includes(view),
    comments:   view === 'bug-details',
    quickClose: view === 'incident-resolution',
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">

      {/* Ticket header */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 dark:text-slate-500 text-xs font-mono mb-0.5">
              BUG-{bug.id?.slice(0,8).toUpperCase()}
            </p>
            <h2 className="text-gray-900 dark:text-white font-bold text-base leading-snug">{bug.title}</h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">{bug.description}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${priorityBadge(bug.priority)}`}>
            {bug.priority}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(bug.status)}`}>{bug.status}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
            {bug.category?.category_name || 'General'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
            Reporter: {bug.client?.full_name || '—'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
            Created: {fmt(bug.created_at)}
          </span>
          {bug.slaPolicy && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
              SLA: {bug.slaPolicy.response_time}h resp / {bug.slaPolicy.resolution_time}h resolve
            </span>
          )}
        </div>
      </Card>

      {/* Telemetry */}
      <div className="bg-gray-900 dark:bg-slate-950 border border-gray-700 dark:border-slate-700 rounded-xl p-4 font-mono text-xs space-y-1">
        <p className="text-gray-500 dark:text-slate-500 font-bold mb-2">TELEMETRY &amp; STACK TRACE</p>
        <p className="text-emerald-400">Bug ID: BUG-{bug.id?.slice(0,8).toUpperCase()}</p>
        <p className="text-gray-400 dark:text-slate-500">Module: /{bug.category?.category_name || 'system'}/handler.js</p>
        <p className={['Resolved','Closed'].includes(bug.status) ? 'text-green-400' : 'text-red-400'}>
          Status: {['Resolved','Closed'].includes(bug.status) ? 'RESOLVED' : 'ACTIVE ERROR'}
        </p>
        <p className="text-gray-500 dark:text-slate-400">Priority: {bug.priority} · SLA response: {bug.slaPolicy?.response_time ?? 'N/A'}h</p>
      </div>

      {/* Status update */}
      {show.status && (
        <div>
          <SLabel>Update Status</SLabel>
          <div className="flex flex-wrap gap-2">
            {['Open','In Progress','Pending','Resolved','Closed'].map(s => (
              <button key={s} onClick={() => doStatus(s)} disabled={saving || bug.status === s}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                  bug.status === s
                    ? 'border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                style={bug.status === s ? { borderColor: primaryColor, color: primaryColor, background: `${primaryColor}15` } : {}}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick close (incident resolution) */}
      {show.quickClose && (
        <div>
          <SLabel>Quick Resolution</SLabel>
          {['Resolved','Closed'].includes(bug.status) ? (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-4 text-center">
              <FiCheck size={22} className="mx-auto text-green-600 dark:text-green-400 mb-1" />
              <p className="text-green-700 dark:text-green-400 text-sm font-semibold">Incident {bug.status}</p>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => doStatus('Resolved')} disabled={saving}
                className="flex-1 min-w-[140px] px-4 py-3 bg-green-50 dark:bg-green-700/20 border border-green-200 dark:border-green-500/30 rounded-xl text-green-700 dark:text-green-400 text-sm font-semibold hover:bg-green-100 dark:hover:bg-green-700/30 disabled:opacity-50 transition-all">
                Mark Resolved
              </button>
              <button onClick={() => doStatus('Closed')} disabled={saving}
                className="flex-1 min-w-[140px] px-4 py-3 bg-gray-50 dark:bg-slate-700/20 border border-gray-200 dark:border-slate-500/30 rounded-xl text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-700/30 disabled:opacity-50 transition-all">
                Close Incident
              </button>
            </div>
          )}
        </div>
      )}

      {/* Work log */}
      {show.worklog && (
        <div>
          <SLabel>Log Work Hours</SLabel>
          <div className="flex gap-2 mb-2">
            <TInput type="number" min="0.5" step="0.5" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} className="w-28" />
            <TInput placeholder="Description of work done…" value={wDesc} onChange={e => setWDesc(e.target.value)} className="flex-1" />
          </div>
          <Btn onClick={doWorkLog} disabled={saving} variant="primary" primaryColor={primaryColor}>Save Work Log</Btn>
          {workLogs.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {workLogs.map(c => (
                <div key={c.comment_id} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-2.5">
                  <p className="text-gray-700 dark:text-slate-300 text-xs">{c.comment.replace('[WORK LOG] ','')}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] mt-0.5">{fmtT(c.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Internal note */}
      {show.note && (
        <div>
          <SLabel>Internal Note</SLabel>
          <TArea rows={3} placeholder="Technical note or progress update…" value={note} onChange={e => setNote(e.target.value)} />
          <div className="mt-2"><Btn onClick={doNote} disabled={saving} variant="slate">Add Note</Btn></div>
        </div>
      )}

      {/* Resolution note */}
      {show.resolution && (
        <div>
          <SLabel>Resolution Note</SLabel>
          <p className="text-gray-500 dark:text-slate-500 text-xs mb-2">
            Describe the fix. Submitting sets ticket to <span className="text-green-600 dark:text-green-400 font-medium">Resolved</span>.
          </p>
          <TArea rows={4} placeholder="e.g. Fixed null pointer by adding guard clause on line 142…" value={resNote} onChange={e => setResNote(e.target.value)} />
          <div className="mt-2"><Btn onClick={() => doRes('note', resNote, () => setResNote(''))} disabled={saving} variant="green">Submit Resolution</Btn></div>
          {resoLogs.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {resoLogs.map(c => (
                <div key={c.comment_id} className="bg-gray-50 dark:bg-slate-900 border border-green-200 dark:border-green-500/20 rounded-lg p-2.5">
                  <p className="text-gray-700 dark:text-slate-300 text-xs">{c.comment.replace('[RESOLUTION NOTE] ','')}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] mt-0.5">{fmtT(c.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RCA */}
      {show.rca && (
        <div>
          <SLabel>Root Cause Analysis</SLabel>
          <div className="bg-gray-50 dark:bg-slate-900 border border-purple-200 dark:border-purple-500/20 rounded-lg p-3 mb-2 text-xs space-y-0.5">
            <p className="text-purple-600 dark:text-purple-400 font-semibold mb-1">RCA Template</p>
            {['1. What happened?','2. Why? (5 Whys)','3. Contributing factors','4. Prevention measures'].map(t => (
              <p key={t} className="text-gray-500 dark:text-slate-500">{t}</p>
            ))}
          </div>
          <TArea rows={5} placeholder="Root cause analysis…" value={rca} onChange={e => setRca(e.target.value)} />
          <div className="mt-2"><Btn onClick={() => doRes('rca', rca, () => setRca(''))} disabled={saving} variant="purple">Submit RCA</Btn></div>
          {rcaLogs.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {rcaLogs.map(c => (
                <div key={c.comment_id} className="bg-gray-50 dark:bg-slate-900 border border-purple-200 dark:border-purple-500/20 rounded-lg p-2.5">
                  <p className="text-gray-700 dark:text-slate-300 text-xs">{c.comment.replace('[ROOT CAUSE ANALYSIS] ','')}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] mt-0.5">{fmtT(c.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comments thread */}
      {show.comments && (
        <div>
          <SLabel>Comments &amp; Activity ({comments.length})</SLabel>
          {comments.length === 0
            ? <p className="text-gray-400 dark:text-slate-500 text-xs">No comments yet.</p>
            : <div className="space-y-2">
                {comments.map(c => (
                  <div key={c.comment_id} className={`rounded-lg p-3 border ${c.is_internal
                    ? 'bg-purple-50 dark:bg-slate-900 border-purple-200 dark:border-purple-500/20'
                    : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700'}`}>
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-gray-800 dark:text-slate-200 text-xs font-medium truncate">{c.author?.full_name || 'System'}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {c.is_internal && <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded">internal</span>}
                        <span className="text-gray-400 dark:text-slate-500 text-[10px]">{fmtT(c.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-xs leading-relaxed">{c.comment}</p>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      <Toast msg={msg} err={err} />
    </div>
  );
};

// ─── View metadata ────────────────────────────────────────────────────────────
const VIEWS = {
  'assigned-bugs':       { label:'Assigned Bugs',      fetch:'bugs' },
  'bug-details':         { label:'Bug Details',         fetch:'bugs' },
  'bug-status':          { label:'Bug Status',          fetch:'bugs' },
  'open-incidents':      { label:'Open Incidents',      fetch:'open' },
  'critical-incidents':  { label:'Critical Incidents',  fetch:'critical' },
  'incident-resolution': { label:'Incident Resolution', fetch:'open' },
  'log-hours':           { label:'Log Work Hours',      fetch:'bugs' },
  'update-progress':     { label:'Update Progress',     fetch:'bugs' },
  'resolution-notes':    { label:'Resolution Notes',    fetch:'bugs' },
  'rca':                 { label:'Root Cause Analysis', fetch:'bugs' },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const EngineeringBacklog = ({ activeView: propView, setActiveView: propSet }) => {
  const { user }     = useAuth();
  const { settings } = useSystemSettings();

  const [localView, setLocalView] = useState('assigned-bugs');
  const activeView    = propView  ?? localView;
  const setActiveView = propSet   ?? setLocalView;

  const [kpis,       setKpis]       = useState(null);
  const [perf,       setPerf]       = useState(null);
  const [tickets,    setTickets]    = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail,     setDetail]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    fetchDevKPIs().then(setKpis).catch(() => {});
    fetchDevPerformance().then(setPerf).catch(() => {});
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true); setError(''); setSelectedId(null); setDetail(null);
    try {
      const type = VIEWS[activeView]?.fetch || 'bugs';
      let data = [];
      if (type === 'bugs')     { const r = await fetchBugs();      data = r.bugs || []; }
      if (type === 'open')     { data = await fetchOpenIncidents(); }
      if (type === 'critical') { data = await fetchCriticalIncidents(); }
      setTickets(data);
    } catch {
      setError('Could not load tickets. Is the backend running?');
    }
    setLoading(false);
  }, [activeView]);

  useEffect(() => { loadList(); }, [loadList]);

  const handleSelect = async t => {
    setSelectedId(t.id);
    try { setDetail(await fetchBugById(t.id)); }
    catch { setDetail(t); }
  };

  const refresh = async id => {
    try { setDetail(await fetchBugById(id)); } catch {}
    fetchDevKPIs().then(setKpis).catch(() => {});
    fetchDevPerformance().then(setPerf).catch(() => {});
    await loadList();
  };

  const handleStatusChange = async (id, status) => { await updateBugStatus(id, status); await refresh(id); };
  const handleAction = async (type, id, payload) => {
    if (type === 'note')       await addBugNote(id, payload.comment);
    if (type === 'worklog')    await logWorkHours(id, payload.hours, payload.description);
    if (type === 'resolution') await submitResolution(id, payload.type, payload.content);
    await refresh(id);
  };

  const filtered = tickets.filter(t =>
    !search.trim() ||
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.id?.toLowerCase().includes(search.toLowerCase())
  );

  const viewLabel    = VIEWS[activeView]?.label || 'Tickets';
  const primaryColor = settings.primaryColor || '#2563EB';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-900">

      {/* Top terminal bar */}
      <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2">
          <FiZap size={15} style={{ color: primaryColor }} />
          <span className="text-gray-800 dark:text-slate-100 font-bold text-sm">JavaPA Developer Terminal</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
          <FiSearch size={13} className="text-gray-400 dark:text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
            className="bg-transparent text-gray-800 dark:text-slate-100 text-xs placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none w-40 md:w-48" />
        </div>
      </div>

      {/* KPI strip */}
      <div className="px-5 py-3 grid grid-cols-2 xl:grid-cols-4 gap-3 border-b border-gray-200 dark:border-slate-700 shrink-0">
        <KpiCard label="Assigned Bugs"   value={kpis?.assigned} icon={FiTool}          accent="bg-blue-500" />
        <KpiCard label="Critical Issues" value={kpis?.critical} icon={FiAlertTriangle} accent="bg-red-500" />
        <KpiCard label="Open Incidents"  value={kpis?.open}     icon={FiActivity}      accent="bg-orange-500" />
        <KpiCard label="Resolved Issues" value={kpis?.resolved} icon={FiCheckSquare}   accent="bg-green-500" />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Ticket list */}
        <div className="w-72 xl:w-80 shrink-0 border-r border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden bg-white dark:bg-slate-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-gray-800 dark:text-slate-100 text-xs font-semibold uppercase tracking-wide">{viewLabel}</p>
            <button onClick={loadList} title="Refresh"
              className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white transition-colors">
              <FiRefreshCw size={13} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {loading && <Spin />}
            {!loading && error && <p className="text-red-600 dark:text-red-400 text-xs p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">{error}</p>}
            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-12">
                <FiTool size={24} className="mx-auto text-gray-300 dark:text-slate-600 mb-2" />
                <p className="text-gray-400 dark:text-slate-500 text-xs">No tickets found</p>
              </div>
            )}
            {!loading && filtered.map(t => (
              <TicketCard key={t.id} t={t} selected={selectedId === t.id} onClick={handleSelect} primaryColor={primaryColor} />
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-gray-50 dark:bg-slate-900">
          <div className="px-5 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex items-center gap-2">
            <span className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-wider">Active Workspace:</span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>{viewLabel}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <DetailView bug={detail} view={activeView} onStatusChange={handleStatusChange} onAction={handleAction} primaryColor={primaryColor} />
          </div>
        </div>
      </div>

      {/* Footer: performance */}
      <div className="px-5 py-2.5 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-wrap items-center gap-5 shrink-0">
        <div className="flex items-center gap-1.5 text-xs">
          <FiUser size={11} className="text-gray-400 dark:text-slate-500" />
          <span className="text-gray-800 dark:text-slate-100 font-medium">{user?.full_name || 'Developer'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 dark:text-slate-500">Branch:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">hotfix/auth-leak</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 dark:text-slate-500">Pipeline:</span>
          <span className="text-emerald-600 dark:text-emerald-400">Build Success ✓</span>
        </div>
        <div className="ml-auto flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-slate-500">Fixed Bugs:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all bg-green-500"
                  style={{ width: `${Math.min(perf?.fixedRatio ?? 0, 100)}%` }} />
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{perf?.fixedRatio ?? 0}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 dark:text-slate-500">Avg Fix Time:</span>
            <span className="text-gray-800 dark:text-slate-100 font-mono">{perf?.mttr ?? '—'}h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringBacklog;
