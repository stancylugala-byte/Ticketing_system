import { useEffect, useState } from 'react';
import { getTicketDistribution } from '../../api/managerApi';

const STATUS_COLORS = {
  'Open':        { bar: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50' },
  'In Progress': { bar: 'bg-yellow-500',  text: 'text-yellow-700',  bg: 'bg-yellow-50' },
  'Pending':     { bar: 'bg-purple-500',  text: 'text-purple-700',  bg: 'bg-purple-50' },
  'Resolved':    { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  'Closed':      { bar: 'bg-gray-400',    text: 'text-gray-600',    bg: 'bg-gray-100' },
};

export default function TicketDistributionView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTicketDistribution()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((s, d) => s + parseInt(d.count), 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Ticket Distribution</h2>
        <p className="text-sm text-gray-500">Breakdown of tickets by current lifecycle status</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-5">Status Breakdown</h3>
          {loading ? (
            <div className="flex flex-col gap-3">{[...Array(5)].map((_,i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.map(d => {
                const pct = total > 0 ? (parseInt(d.count) / total) * 100 : 0;
                const c   = STATUS_COLORS[d.status] || { bar: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' };
                return (
                  <div key={d.status}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>{d.status}</span>
                      <span className="text-sm font-bold text-gray-800">{d.count} <span className="text-xs font-normal text-gray-400">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div className="flex flex-col gap-3">
          {data.map(d => {
            const pct = total > 0 ? ((parseInt(d.count) / total) * 100).toFixed(1) : 0;
            const c   = STATUS_COLORS[d.status] || { bar: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' };
            return (
              <div key={d.status} className={`bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${c.bar}`} />
                  <span className="text-sm font-semibold text-gray-700">{d.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{d.count}</p>
                  <p className="text-xs text-gray-400">{pct}% of total</p>
                </div>
              </div>
            );
          })}
          <div className="bg-blue-600 rounded-xl px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Total Tickets</span>
            <span className="text-2xl font-extrabold text-white">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
