import { useEffect, useState } from 'react';
import { getTicketTrends } from '../../api/managerApi';

export default function TicketTrendsView() {
  const [data,    setData]    = useState([]);
  const [days,    setDays]    = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTicketTrends(days)
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const maxCount = Math.max(1, ...data.map(d => parseInt(d.count)));
  const total    = data.reduce((s, d) => s + parseInt(d.count), 0);
  const avgDaily = data.length > 0 ? (total / data.length).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ticket Trends</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Daily incoming ticket volume over time</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 60].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
                ${days === d ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total in Period', value: total, icon: '🎫', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Daily Average',   value: avgDaily, icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Peak Day',        value: maxCount, icon: '📈', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-lg shrink-0`}>{c.icon}</div>
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{c.label}</p>
              <p className={`text-xl font-bold ${c.color}`}>{loading ? '—' : value(c.value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-4">Daily Ticket Volume</h3>
        {loading ? (
          <div className="h-48 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2">
            <span className="text-3xl">📭</span>
            <p className="text-sm">No ticket data for this period</p>
          </div>
        ) : (
          <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
            {data.map((d, i) => {
              const pct   = (parseInt(d.count) / maxCount) * 100;
              const label = d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group">
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{d.count}</span>
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all cursor-pointer"
                    style={{ height: `${Math.max(4, pct)}%` }}
                    title={`${label}: ${d.count} tickets`}
                  />
                  <span className="text-[9px] text-gray-400 dark:text-slate-500 rotate-45 origin-left mt-1 hidden sm:block">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// helper to avoid inline expression issue
function value(v) { return v; }
