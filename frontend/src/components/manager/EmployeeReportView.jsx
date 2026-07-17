import { useEffect, useState } from 'react';
import { getEmployeeReport } from '../../api/managerApi';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function EmployeeReportView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployeeReport().then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Employee Reports</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Performance logs for monthly evaluation and capacity reviews</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px_80px_80px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>Employee</span><span>Role</span><span>Assigned</span><span>Resolved</span><span>Open</span><span>Resolution Rate</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(5)].map((_,i) => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2"><span className="text-3xl">??</span><p className="text-sm">No employee data</p></div>
        ) : (
          data.map(e => {
            const rate = e.assigned > 0 ? ((e.resolved / e.assigned) * 100).toFixed(1) : '0.0';
            const rateColor = parseFloat(rate) >= 80 ? 'text-emerald-600' : parseFloat(rate) >= 50 ? 'text-yellow-600' : 'text-red-600';
            return (
              <div key={e.id} className="grid grid-cols-[1fr_80px_80px_80px_80px_120px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{getInitials(e.full_name)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{e.full_name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">{e.email}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{e.role === 'SupportOfficer' ? 'Officer' : 'Dev'}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-slate-100">{e.assigned}</span>
                <span className="text-sm font-bold text-emerald-600">{e.resolved}</span>
                <span className="text-sm font-bold text-orange-600">{e.open}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rate}%` }} />
                  </div>
                  <span className={`text-xs font-bold ${rateColor} w-10 text-right`}>{rate}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
