import { useEffect, useState } from 'react';
import { getClientReport } from '../../api/managerApi';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ClientReportView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientReport().then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Client Reports</h2>
        <p className="text-sm text-gray-500">Support metrics per client for SLA review meetings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px_80px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
          <span>Client</span><span>Total</span><span>Resolved</span><span>Open</span><span>Resolution Rate</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(5)].map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 gap-2"><span className="text-3xl">🏢</span><p className="text-sm">No client data</p></div>
        ) : (
          data.filter(c => c.total > 0).map(c => {
            const rate = c.total > 0 ? ((c.resolved / c.total) * 100).toFixed(1) : '0.0';
            return (
              <div key={c.id} className="grid grid-cols-[1fr_80px_80px_80px_120px] items-center px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-7 h-7 bg-slate-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{getInitials(c.full_name)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.full_name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{c.email}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-800">{c.total}</span>
                <span className="text-sm font-bold text-emerald-600">{c.resolved}</span>
                <span className="text-sm font-bold text-orange-600">{c.open}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rate}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-10 text-right">{rate}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
