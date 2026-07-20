import { useEffect, useState } from 'react';
import { getUserAuditLog } from '../../api/adminApi';

const ROLE_BADGE = {
  Client:         'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  SupportOfficer: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  Developer:      'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  Manager:        'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  Admin:          'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

export default function UserActivityView() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserAuditLog().then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Activities</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Recent account modifications and profile updates across all users</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[180px_1fr_120px_150px_150px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Last Updated</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(5)].map((_,i) => <div key={i} className="h-12 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2">
            <span className="text-3xl">📋</span>
            <p className="text-sm">No activity records</p>
          </div>
        ) : (
          data.map(u => (
            <div key={u.id} className="grid grid-cols-[180px_1fr_120px_150px_150px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  {getInitials(u.full_name)}
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{u.full_name}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 truncate pr-3">{u.email}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${ROLE_BADGE[u.role] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
                {u.role}
              </span>
              <span className="text-xs text-gray-400 dark:text-slate-500">{fmtDate(u.created_at)}</span>
              <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">{fmtDate(u.updated_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
