import { useEffect, useState } from 'react';
import { getTicketReport } from '../../api/managerApi';

export default function TicketReportView() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [range,   setRange]   = useState({ from: '', to: '' });

  const load = () => {
    setLoading(true);
    getTicketReport(range.from || range.to ? range : {})
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const STATUS_COLORS  = { Open:'text-blue-600', 'In Progress':'text-yellow-600', Pending:'text-purple-600', Resolved:'text-emerald-600', Closed:'text-gray-500' };
  const PRIORITY_COLORS = { Critical:'text-red-600', High:'text-orange-600', Medium:'text-yellow-600', Low:'text-green-600' };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Ticket Reports</h2>
          <p className="text-sm text-gray-500">Daily, weekly, and monthly ticket volume summaries</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="date" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
          <button onClick={load} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Apply</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* By Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">By Status</h3>
              <span className="text-2xl font-extrabold text-blue-600">{data?.total ?? '—'}</span>
            </div>
            <div className="flex flex-col gap-3">
              {(data?.byStatus || []).map(row => (
                <div key={row.status} className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${STATUS_COLORS[row.status] || 'text-gray-600'}`}>{row.status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data?.total > 0 ? (row.count / data.total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-800 w-8 text-right">{row.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Priority */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">By Priority</h3>
            <div className="flex flex-col gap-3">
              {(data?.byPriority || []).map(row => (
                <div key={row.priority} className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${PRIORITY_COLORS[row.priority] || 'text-gray-600'}`}>{row.priority}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data?.total > 0 ? (row.count / data.total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-800 w-8 text-right">{row.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
