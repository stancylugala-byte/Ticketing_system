import { useEffect, useState } from 'react';
import { getAdminKPIs } from '../../api/adminApi';

export default function AdminKPIs() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminKPIs().then(r => setData(r.data.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Clients',  value: data?.totalClients  ?? '—', icon: '👥', color: 'text-blue-600',    border: 'border-blue-200 dark:border-blue-500/30',    bg: 'bg-blue-50 dark:bg-blue-500/10'    },
    { label: 'Total Users',    value: data?.totalUsers    ?? '—', icon: '👤', color: 'text-purple-600',  border: 'border-purple-200 dark:border-purple-500/30',  bg: 'bg-purple-50 dark:bg-purple-500/10'  },
    { label: 'Active Tickets', value: data?.activeTickets ?? '—', icon: '🎫', color: 'text-orange-600',  border: 'border-orange-200 dark:border-orange-500/30',  bg: 'bg-orange-50 dark:bg-orange-500/10'  },
    { label: 'System Health',  value: data?.systemHealth  ?? '—', icon: '✅', color: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-500/30', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-1">
      {cards.map(c => (
        <div key={c.label} className={`bg-white dark:bg-slate-800 rounded-xl border ${c.border} px-5 py-4 shadow-sm flex items-center gap-4`}>
          <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
            {!data
              ? <div className="h-7 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
              : <p className={`text-2xl font-bold leading-none ${c.color}`}>{c.value}</p>
            }
          </div>
        </div>
      ))}
    </div>
  );
}
