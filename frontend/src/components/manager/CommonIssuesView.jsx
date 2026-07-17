import { useEffect, useState } from 'react';
import { getCommonIssues } from '../../api/managerApi';

const BAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500',
  'bg-red-500',  'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500',
];

export default function CommonIssuesView() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommonIssues()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((s, d) => s + d.count, 0);
  const max   = Math.max(1, ...data.map(d => d.count));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Common Issues</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Automated category clustering — top recurring support topics</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Horizontal bar chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-5">By Category</h3>
          {loading ? (
            <div className="flex flex-col gap-3">{[...Array(6)].map((_,i) => <div key={i} className="h-9 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-400 dark:text-slate-500 gap-2">
              <span className="text-3xl">📊</span>
              <p className="text-sm">No category data available</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {data.map((d, i) => {
                const pct   = (d.count / max) * 100;
                const color = BAR_COLORS[i % BAR_COLORS.length];
                return (
                  <div key={d.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">{d.category}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{d.count}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Percentage breakdown */}
        <div className="flex flex-col gap-3">
          {data.map((d, i) => {
            const pct   = total > 0 ? ((d.count / total) * 100).toFixed(1) : 0;
            const color = BAR_COLORS[i % BAR_COLORS.length];
            return (
              <div key={d.category} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm px-4 py-3.5 flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${color} shrink-0`} />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200 flex-1">{d.category}</span>
                <div className="text-right">
                  <span className="text-base font-bold text-gray-900 dark:text-white">{pct}%</span>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">{d.count} tickets</p>
                </div>
              </div>
            );
          })}
          {data.length === 0 && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex gap-2">
              <span>💡</span>
              <span>Ticket categories not configured. Assign categories when creating tickets to see distribution.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
