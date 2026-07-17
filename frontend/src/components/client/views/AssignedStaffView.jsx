import { useEffect, useState } from 'react';
import { getMyTickets } from '../../../api/clientApi';

function initials(name = '') { return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(); }

export default function AssignedStaffView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTickets({ limit: 50 })
      .then(r => setTickets(r.data.data.tickets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeTickets = tickets.filter(t => !['Closed'].includes(t.status));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">View Assigned Staff</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">See the support specialists assigned to your active tickets.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-36 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}</div>
      ) : activeTickets.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400 dark:text-slate-500 gap-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <span className="text-3xl">👤</span><p className="text-sm">No active tickets with assigned staff</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {activeTickets.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                  ${t.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                    t.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                    t.status === 'Pending' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4 line-clamp-2">{t.title}</p>

              {t.assignee ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {initials(t.assignee.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{t.assignee.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t.assignee.role || 'Support Officer'}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <span className="text-[10px] text-emerald-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-slate-400">Unassigned</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Awaiting assignment</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

