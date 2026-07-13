import { useEffect, useState } from 'react';
import { getTicketHistory } from '../../api/adminApi';

const priorityBadge = {
  Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700',
};
const statusDot = {
  'Open': 'bg-blue-500', 'In Progress': 'bg-yellow-500',
  'Pending': 'bg-purple-500', 'Resolved': 'bg-emerald-500', 'Closed': 'bg-gray-400',
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

export default function TicketHistoryView() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    getTicketHistory().then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? data.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search.toLowerCase()))
    : data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Ticket History</h2>
          <p className="text-sm text-gray-500">Immutable log of all ticket transitions — {data.length} records</p>
        </div>
        <input
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 bg-white w-52 placeholder-gray-400"
          placeholder="Search by title or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[140px_1fr_100px_100px_120px_120px_120px] px-5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
          <span>Ticket ID</span><span>Title</span><span>Priority</span><span>Status</span>
          <span>Client</span><span>Created</span><span>Last Update</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(6)].map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 gap-2"><span className="text-3xl">🎫</span><p className="text-sm">No ticket history found</p></div>
        ) : (
          filtered.slice(0, 50).map(t => (
            <div key={t.id} className="grid grid-cols-[140px_1fr_100px_100px_120px_120px_120px] items-center px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
              <span className="text-sm text-gray-800 truncate pr-3">{t.title}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${priorityBadge[t.priority] || 'bg-gray-100 text-gray-500'}`}>{t.priority}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusDot[t.status] || 'bg-gray-400'}`} />
                <span className="text-xs text-gray-600">{t.status}</span>
              </div>
              <span className="text-xs text-gray-500 truncate">{t.client?.full_name || '—'}</span>
              <span className="text-xs text-gray-400">{fmtDate(t.created_at)}</span>
              <span className="text-xs text-gray-600 font-medium">{fmtDate(t.updated_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
