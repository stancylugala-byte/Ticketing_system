import { useEffect, useState } from 'react';
import { getLoginHistory } from '../../api/adminApi';

const ROLE_BADGE = {
  Client: 'bg-blue-100 text-blue-700', SupportOfficer: 'bg-yellow-100 text-yellow-700',
  Developer: 'bg-purple-100 text-purple-700', Admin: 'bg-red-100 text-red-700',
};

function getInitials(name = '') { return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(); }

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

export default function LoginHistoryView() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoginHistory().then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Login History</h2>
        <p className="text-sm text-gray-500">Recent session activity — ordered by last seen time</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-700">
        <span className="shrink-0">💡</span>
        <span>Login history is approximated from last-updated timestamps. For full IP-based session logging, integrate a dedicated session audit table.</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[180px_1fr_120px_180px] px-5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
          <span>User</span><span>Email</span><span>Role</span><span>Last Seen</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(5)].map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 gap-2"><span className="text-3xl">🕐</span><p className="text-sm">No login records</p></div>
        ) : (
          data.map((u, i) => (
            <div key={u.user_id} className="grid grid-cols-[180px_1fr_120px_180px] items-center px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{getInitials(u.full_name)}</div>
                <span className="text-sm font-semibold text-gray-800 truncate">{u.full_name}</span>
              </div>
              <span className="text-xs text-gray-500 truncate pr-3">{u.email}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${ROLE_BADGE[u.role] || 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
                <span className="text-xs text-gray-700 font-medium">{fmtDate(u.last_seen)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
