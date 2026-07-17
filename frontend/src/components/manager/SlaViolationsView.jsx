import { useEffect, useState } from 'react';
import { getSlaViolations } from '../../api/managerApi';

const priorityBadge = { Critical:'bg-red-100 text-red-700', High:'bg-orange-100 text-orange-700', Medium:'bg-yellow-100 text-yellow-700', Low:'bg-green-100 text-green-700' };

export default function SlaViolationsView() {
  const [violations, setViolations] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    getSlaViolations()
      .then(r => setViolations(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">SLA Violations</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Active tickets that have exceeded their resolution time threshold</p>
        </div>
        {violations.length > 0 && (
          <span className="px-3 py-1.5 bg-red-100 border border-red-300 text-red-700 text-xs font-bold rounded-lg animate-pulse">
            ?? {violations.length} Violation{violations.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {violations.length === 0 && !loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-12 flex flex-col items-center text-gray-400 dark:text-slate-500 gap-3">
          <span className="text-4xl">?</span>
          <p className="text-base font-semibold text-gray-600 dark:text-slate-300">No SLA Violations</p>
          <p className="text-sm">All active tickets are within their resolution time targets.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_90px_110px_100px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <span>Ticket</span><span>Client</span><span>Priority</span><span>Status</span><span>Assignee</span><span>Overdue By</span>
          </div>
          {loading ? (
            <div className="p-4 flex flex-col gap-2">{[...Array(3)].map((_,i) => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
          ) : (
            violations.map(v => (
              <div key={v.id} className="grid grid-cols-[1fr_120px_90px_110px_100px_120px] items-center px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-red-50/20 hover:bg-red-50/40 transition-colors">
                <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                  <span className="text-[11px] font-bold text-blue-600">#{v.id.slice(0,8).toUpperCase()}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{v.title}</span>
                </div>
                <span className="text-xs text-gray-600 dark:text-slate-300 truncate">{v.client?.full_name || '—'}</span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${priorityBadge[v.priority] || 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>{v.priority}</span>
                <span className="text-xs text-gray-600 dark:text-slate-300">{v.status}</span>
                <span className="text-xs text-gray-600 dark:text-slate-300 truncate">{v.assignee?.full_name || <em className="text-gray-400 dark:text-slate-500">None</em>}</span>
                <span className="text-xs font-bold text-red-600">+{v.overdueSince}h overdue</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
