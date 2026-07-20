import { useEffect, useState } from 'react';
import { getResolutionStats } from '../../api/managerApi';

export default function ResolutionStatsView() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResolutionStats().then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const resRate = data ? parseFloat(data.resolutionRate) : 0;
  const fcrRate = data ? parseFloat(data.firstContactRate) : 0;

  const kpiCards = [
    { label: 'Total Tickets',      value: data?.total ?? '—',    icon: '🎫', color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Resolved',           value: data?.resolved ?? '—', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Resolution Rate',    value: loading ? '—' : `${resRate}%`, icon: '📊', color: resRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400', bg: resRate >= 80 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'First-Contact Rate', value: loading ? '—' : `${fcrRate}%`, icon: '⚡', color: fcrRate >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',    bg: fcrRate >= 70 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resolution Statistics</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">First-contact resolution rates and overall performance trends</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map(c => (
          <div key={c.label} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{c.label}</p>
              {loading
                ? <div className="h-6 w-14 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                : <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Progress gauges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-5">Overall Resolution Rate</h3>
          <div className="flex items-end gap-4 mb-4">
            <p className={`text-5xl font-extrabold ${resRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {loading ? '—' : `${resRate}%`}
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-500 pb-2">of all tickets resolved</p>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${resRate >= 80 ? 'bg-emerald-500' : resRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: loading ? '0%' : `${resRate}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1.5">
            <span>0%</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Target: 85%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-5">First-Contact Resolution Rate</h3>
          <div className="flex items-end gap-4 mb-4">
            <p className={`text-5xl font-extrabold ${fcrRate >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {loading ? '—' : `${fcrRate}%`}
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-500 pb-2">resolved in one interaction</p>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${fcrRate >= 70 ? 'bg-emerald-500' : fcrRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: loading ? '0%' : `${fcrRate}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1.5">
            <span>0%</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Target: 70%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Insight box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-5 flex gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Performance Insights</p>
          {!loading && data && (
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 leading-relaxed list-disc list-inside">
              {resRate >= 85 && <li>Resolution rate is above target — excellent team performance.</li>}
              {resRate < 85  && <li>Resolution rate is below the 85% target. Consider redistributing workload or adding capacity.</li>}
              {fcrRate >= 70 && <li>First-contact resolution is strong — clients are getting fast answers.</li>}
              {fcrRate < 70  && <li>First-contact resolution below 70% target. Focus on knowledge base articles and officer training.</li>}
              {data.total - data.resolved > 0 && <li>{data.total - data.resolved} tickets are still unresolved and need attention.</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
