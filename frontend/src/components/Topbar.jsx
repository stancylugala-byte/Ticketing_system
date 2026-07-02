import { useState, useEffect } from 'react';
import { searchTickets } from '../api/tickets';
import { getUnreadCount } from '../api/notifications';

const priorityColors = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

export default function Topbar({ onTicketSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    getUnreadCount().then(r => setUnread(r.data.data?.count || 0)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); setShowResults(false); return; }
    const t = setTimeout(() => {
      searchTickets(query)
        .then(r => { setResults(r.data.data || []); setShowResults(true); })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (ticket) => {
    onTicketSelect(ticket);
    setQuery('');
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-40 h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
        <input
          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
          placeholder="Search tickets, knowledge base, or users..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {showResults && results.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
            {results.map(t => (
              <li
                key={t.id}
                onMouseDown={() => handleSelect(t)}
                className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-none"
              >
                <span className="text-[11px] font-bold text-blue-600 w-20 shrink-0">#{t.id.slice(0,8).toUpperCase()}</span>
                <span className="flex-1 text-sm text-gray-800 truncate">{t.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityColors[t.priority] || ''}`}>{t.priority}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg">
          🔔
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
              {unread}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">SM</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 leading-tight">Sarah Miller</span>
            <span className="text-xs text-gray-500">Support Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
