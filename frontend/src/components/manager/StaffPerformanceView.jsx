import { useEffect, useState } from 'react';
import { getStaffPerformance } from '../../api/managerApi';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function ScoreBar({ value, max = 100, color = 'bg-blue-500' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value}</span>
    </div>
  );
}

export default function StaffPerformanceView() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaffPerformance()
      .then(r => setStaff(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxResolved = Math.max(1, ...staff.map(s => s.resolved));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Staff Performance</h2>
        <p className="text-sm text-gray-500">Individual resolution throughput and quality metrics</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[200px_80px_100px_180px_100px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
          <span>Officer</span><span>Role</span><span>Assigned</span><span>Resolved</span><span>Avg. Time</span><span>CSAT</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 gap-2"><span className="text-3xl">👥</span><p className="text-sm">No staff data found</p></div>
        ) : (
          staff.map(s => (
            <div key={s.id} className="grid grid-cols-[200px_80px_100px_180px_100px_120px] items-center px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {getInitials(s.full_name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.full_name}</p>
                  <p className="text-[10px] text-gray-400">{s.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 w-fit">{s.role === 'SupportOfficer' ? 'Officer' : 'Dev'}</span>
              <span className="text-sm font-bold text-gray-800">{s.assigned}</span>
              <ScoreBar value={s.resolved} max={maxResolved} color="bg-blue-500" />
              <span className="text-sm text-gray-600">{s.avgResolutionHours > 0 ? `${s.avgResolutionHours}h` : '—'}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-bold text-gray-800">{s.csat != null ? `${s.csat}/5` : '—'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
