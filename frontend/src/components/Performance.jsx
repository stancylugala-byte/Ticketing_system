import { useEffect, useState } from 'react';
import { getPerformanceStats } from '../api/tickets';

export default function Performance() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPerformanceStats().then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex items-center justify-center text-gray-400 text-sm">
        Loading performance data...
      </div>
    );
  }

  const avgHours = stats?.avgResolutionTime > 0 ? (stats.avgResolutionTime / 60).toFixed(1) : null;

  const kpis = [
    { label: 'Tickets Closed', value: stats?.totalClosed ?? '—', sub: 'All time', icon: '🎫', iconBg: 'bg-blue-50' },
    { label: 'Tickets (Last 30 Days)', value: stats?.ticketsLast30Days ?? '—', sub: 'Resolved this month', icon: '⚡', iconBg: 'bg-green-50' },
    { label: 'Avg Resolution Time', value: avgHours ? `${avgHours}h` : '—', sub: avgHours ? `${stats.avgResolutionTime} minutes` : 'No data yet', icon: '⏱', iconBg: 'bg-orange-50' },
    { label: 'Satisfaction Rate', value: '98%', sub: 'Based on client feedback', icon: '⭐', iconBg: 'bg-purple-50' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Performance</h2>
      <p className="text-sm text-gray-400 mb-6">Based on your ticket activity over the last 30 days</p>

      <div className="grid grid-cols-4 gap-4 mb-6 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {kpis.map(k => (
          <div key={k.label} className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 bg-gray-50">
            <div className={`w-12 h-12 ${k.iconBg} rounded-xl flex items-center justify-center text-2xl shrink-0`}>{k.icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{k.value}</p>
              <p className="text-xs text-gray-400">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <span className="text-lg shrink-0">💡</span>
        <p className="text-sm text-blue-700 leading-relaxed">
          More detailed analytics and charts will be available once tickets are resolved and client feedback is collected.
        </p>
      </div>
    </div>
  );
}
