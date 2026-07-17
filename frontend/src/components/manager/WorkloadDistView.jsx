import { useEffect, useState } from 'react';
import { getWorkloadDist } from '../../api/managerApi';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function LoadIndicator({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-slate-200 w-5 text-right">{value}</span>
    </div>
  );
}

export default function WorkloadDistView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkloadDist()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxOpen = Math.max(1, ...data.map(d => d.open));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workload Distribution</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Active ticket load per support officer — prevents burnout</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 grid grid-cols-[1fr_60px_100px_80px] text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Officer</span><span>Role</span><span>Open Load</span><span>Pending</span>
          </div>
          {loading ? (
            <div className="p-4 flex flex-col gap-2">{[...Array(4)].map((_,i) => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
          ) : (
            data.map(d => (
              <div key={d.id} className="grid grid-cols-[1fr_60px_100px_80px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{getInitials(d.full_name)}</div>
                  <span className="text-sm font-medium text-gray-800 truncate">{d.full_name}</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400">{d.role === 'SupportOfficer' ? 'Officer' : 'Dev'}</span>
                <LoadIndicator value={d.open} max={maxOpen} />
                <span className="text-sm text-gray-600 dark:text-slate-300">{d.pending}</span>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-4">Load Summary</h3>
            <div className="flex flex-col gap-3">
              {data.map(d => {
                const color = d.open > maxOpen * 0.8 ? 'text-red-600' : d.open > maxOpen * 0.5 ? 'text-yellow-600' : 'text-emerald-600';
                const label = d.open > maxOpen * 0.8 ? 'Overloaded' : d.open > maxOpen * 0.5 ? 'Busy' : 'Available';
                const dotColor = d.open > maxOpen * 0.8 ? 'bg-red-500' : d.open > maxOpen * 0.5 ? 'bg-yellow-500' : 'bg-emerald-500';
                return (
                  <div key={d.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span className="text-sm text-gray-700 dark:text-slate-200">{d.full_name}</span>
                    </div>
                    <span className={`text-xs font-bold ${color}`}>{label} ({d.open} open)</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Recommendation:</strong> Officers with more than 80% of the max load should have new tickets redistributed to prevent burnout and SLA breaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
