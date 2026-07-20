import { useEffect, useState } from 'react';
import { getPerformanceStats, getDashboardStats } from '../api/tickets';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// SVG icons replacing broken emoji
const IconClosed   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconMonth    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const IconClock    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconAssigned = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>;
const IconPending  = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconAlert    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
const IconTip      = () => <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>;

export default function PersonalPerformanceView() {
  const { user } = useAuth();
  const [perf,    setPerf]    = useState(null);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPerformanceStats().then(r => r.data.data),
      getDashboardStats().then(r => r.data.data),
    ])
      .then(([p, s]) => { setPerf(p); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgHours   = perf?.avgResolutionTime > 0 ? (perf.avgResolutionTime / 60).toFixed(1) : null;
  const avgMinutes = perf?.avgResolutionTime > 0 ? perf.avgResolutionTime : 0;

  const kpis = [
    {
      label: 'Tickets Closed',
      value: loading ? '—' : (perf?.totalClosed ?? 0),
      sub:   'All time',
      icon:  <IconClosed />,
      bg:    'bg-blue-50 dark:bg-blue-500/10',
      border:'border-blue-200 dark:border-blue-500/30',
      text:  'text-blue-700 dark:text-blue-400',
    },
    {
      label: 'Closed This Month',
      value: loading ? '—' : (perf?.ticketsLast30Days ?? 0),
      sub:   'Last 30 days',
      icon:  <IconMonth />,
      bg:    'bg-emerald-50 dark:bg-emerald-500/10',
      border:'border-emerald-200 dark:border-emerald-500/30',
      text:  'text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Avg Resolution Time',
      value: loading ? '—' : (avgHours ? `${avgHours}h` : '—'),
      sub:   avgMinutes > 0 ? `${avgMinutes} minutes average` : 'No resolved tickets yet',
      icon:  <IconClock />,
      bg:    'bg-orange-50 dark:bg-orange-500/10',
      border:'border-orange-200 dark:border-orange-500/30',
      text:  'text-orange-700 dark:text-orange-400',
    },
    {
      label: 'Currently Assigned',
      value: loading ? '—' : (stats?.assigned ?? 0),
      sub:   'Active in queue',
      icon:  <IconAssigned />,
      bg:    'bg-purple-50 dark:bg-purple-500/10',
      border:'border-purple-200 dark:border-purple-500/30',
      text:  'text-purple-700 dark:text-purple-400',
    },
    {
      label: 'Pending',
      value: loading ? '—' : (stats?.pending ?? 0),
      sub:   'Awaiting response',
      icon:  <IconPending />,
      bg:    'bg-yellow-50 dark:bg-yellow-500/10',
      border:'border-yellow-200 dark:border-yellow-500/30',
      text:  'text-yellow-700 dark:text-yellow-400',
    },
    {
      label: 'SLA Breaches',
      value: loading ? '—' : (stats?.slaBreaches ?? 0),
      sub:   'Requires immediate action',
      icon:  <IconAlert />,
      bg:    (stats?.slaBreaches ?? 0) > 0 ? 'bg-red-50 dark:bg-red-500/10'  : 'bg-gray-50 dark:bg-slate-800',
      border:(stats?.slaBreaches ?? 0) > 0 ? 'border-red-300 dark:border-red-500/30' : 'border-gray-200 dark:border-slate-700',
      text:  (stats?.slaBreaches ?? 0) > 0 ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-slate-200',
    },
  ];

  const closedThisMonth = perf?.ticketsLast30Days ?? 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Personal Performance</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Track your productivity and resolution metrics</p>
      </div>

      {/* Officer banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
          {getInitials(user?.full_name)}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{user?.full_name || 'Support Officer'}</p>
          <p className="text-blue-200 text-sm">{user?.role} · Active</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          <span className="text-white/80 text-sm font-medium">Online</span>
        </div>
      </div>

      {/* KPI grid — 3 × 2 */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-xl border ${k.border} ${k.bg} p-5 flex items-center gap-4`}>
            <div className={`shrink-0 ${k.text}`}>{k.icon}</div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">{k.label}</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
              ) : (
                <p className={`text-3xl font-bold leading-none mb-1 ${k.text}`}>{k.value}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-slate-500">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 mb-4">Daily Target Progress</h3>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1.5">
              <span>Tickets Closed (30 days)</span>
              <span className="font-semibold text-gray-700 dark:text-slate-200">{closedThisMonth} / 20 target</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (closedThisMonth / 20) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1.5">
              <span>Avg Resolution Time</span>
              <span className="font-semibold text-gray-700 dark:text-slate-200">
                {avgHours ? `${avgHours}h` : '—'} / 2h target
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${avgMinutes <= 120 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (avgMinutes / 120) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4">
        <span className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"><IconTip /></span>
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Performance Tips</p>
          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
            Aim to resolve tickets within SLA timeframes. Use the Knowledge Base to find quick solutions.
            Add internal notes for complex tickets to maintain context. Prioritise Critical and High tickets first.
          </p>
        </div>
      </div>
    </div>
  );
}
