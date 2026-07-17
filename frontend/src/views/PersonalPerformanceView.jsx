import { useEffect, useState } from 'react';
import { getPerformanceStats, getDashboardStats } from '../api/tickets';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function PersonalPerformanceView() {
  const { user } = useAuth();
  const [perf, setPerf]   = useState(null);
  const [stats, setStats] = useState(null);
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

  const avgHours    = perf?.avgResolutionTime > 0 ? (perf.avgResolutionTime / 60).toFixed(1) : null;
  const avgMinutes  = perf?.avgResolutionTime > 0 ? perf.avgResolutionTime : null;

  const kpis = [
    {
      label: 'Tickets Closed',
      value: loading ? '—' : (perf?.totalClosed ?? 0),
      sub: 'All time',
      icon: '??',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    {
      label: 'Closed This Month',
      value: loading ? '—' : (perf?.ticketsLast30Days ?? 0),
      sub: 'Last 30 days',
      icon: '??',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
    },
    {
      label: 'Avg Resolution Time',
      value: loading ? '—' : (avgHours ? `${avgHours}h` : '—'),
      sub: avgMinutes ? `${avgMinutes} minutes average` : 'No resolved tickets yet',
      icon: '?',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
    },
    {
      label: 'Currently Assigned',
      value: loading ? '—' : (stats?.assigned ?? 0),
      sub: 'Active in queue',
      icon: '??',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    {
      label: 'Pending',
      value: loading ? '—' : (stats?.pending ?? 0),
      sub: 'Awaiting response',
      icon: '?',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
    },
    {
      label: 'SLA Breaches',
      value: loading ? '—' : (stats?.slaBreaches ?? 0),
      sub: 'Requires immediate action',
      icon: '??',
      bg: (stats?.slaBreaches ?? 0) > 0 ? 'bg-red-50' : 'bg-gray-50 dark:bg-slate-900',
      border: (stats?.slaBreaches ?? 0) > 0 ? 'border-red-300' : 'border-gray-200 dark:border-slate-700',
      text: (stats?.slaBreaches ?? 0) > 0 ? 'text-red-700' : 'text-gray-700 dark:text-slate-200',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Personal Performance</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Track your productivity and resolution metrics</p>
      </div>

      {/* Officer banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 bg-white dark:bg-slate-800/20 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
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
            <div className="text-3xl shrink-0">{k.icon}</div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">{k.label}</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
              ) : (
                <p className={`text-3xl font-bold leading-none mb-1 ${k.text}`}>{k.value}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-slate-500">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tickets closed vs target */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Daily Target Progress</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1.5">
              <span>Tickets Closed Today</span>
              <span className="font-semibold text-gray-700 dark:text-slate-200">{perf?.ticketsLast30Days ?? 0} / 20 target</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, ((perf?.ticketsLast30Days ?? 0) / 20) * 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1.5">
              <span>Avg Resolution Time</span>
              <span className="font-semibold text-gray-700 dark:text-slate-200">{avgHours ? `${avgHours}h` : '—'} / 2h target</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${(avgMinutes ?? 0) <= 120 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, ((avgMinutes ?? 0) / 120) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <span className="text-xl shrink-0">??</span>
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-1">Performance Tips</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Aim to resolve tickets within SLA timeframes. Use the Knowledge Base to find quick solutions.
            Add internal notes for complex tickets to maintain context. Prioritise Critical and High tickets first.
          </p>
        </div>
      </div>
    </div>
  );
}
