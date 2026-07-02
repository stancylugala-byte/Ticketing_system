import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/tickets';

const cards = (stats) => [
  {
    label: 'Assigned Tickets',
    value: stats?.assigned ?? '—',
    icon: '🎫',
    iconBg: 'bg-blue-50',
    sub: 'Active in your queue',
    urgent: false,
  },
  {
    label: 'Pending Tickets',
    value: stats?.pending ?? '—',
    icon: '⏳',
    iconBg: 'bg-orange-50',
    sub: 'Awaiting response',
    urgent: false,
  },
  {
    label: 'Resolved Today',
    value: stats?.resolvedToday ?? '—',
    icon: '✅',
    iconBg: 'bg-green-50',
    sub: 'Closed today',
    urgent: false,
  },
  {
    label: 'SLA Breaches',
    value: stats?.slaBreaches ?? '—',
    icon: '🛡',
    iconBg: 'bg-red-50',
    sub: 'Requires immediate action',
    urgent: (stats?.slaBreaches ?? 0) > 0,
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="h-3 w-28 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="w-11 h-11 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-3 w-36 bg-gray-200 rounded" />
    </div>
  );
}

export default function StatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-5 max-xl:grid-cols-2 max-sm:grid-cols-1">
      {cards(stats).map(card => (
        <div
          key={card.label}
          className={`rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md
            ${card.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 leading-none">{card.value}</p>
            </div>
            <span className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center text-xl shrink-0`}>
              {card.icon}
            </span>
          </div>
          <p className="text-xs text-gray-400">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
