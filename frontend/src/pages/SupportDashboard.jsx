import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTickets } from '../api/tickets';
import { getUnreadCount } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { useSystemSettings } from '../context/SystemSettingsContext';
import ProfileDropdown from '../components/ProfileDropdown';
import DarkModeToggle  from '../components/DarkModeToggle';

import TicketQueueView         from '../views/TicketQueueView';
import TicketProcessingView    from '../views/TicketProcessingView';
import ClientCommunicationView from '../views/ClientCommunicationView';
import KnowledgeBaseView       from '../views/KnowledgeBaseView';
import PersonalPerformanceView from '../views/PersonalPerformanceView';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const VIEW_LABELS = {
  'ticket-queue':          'Ticket Queue',
  'ticket-processing':     'Ticket Processing',
  'client-communication':  'Client Communication',
  'knowledge-base':        'Knowledge Base',
  'personal-performance':  'Personal Performance',
};

export default function SupportDashboard({ activeModule }) {
  const { user, logout } = useAuth();
  const { settings }     = useSystemSettings();
  const navigate = useNavigate();
  const [query, setQuery]             = useState('');
  const [results, setResults]         = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [unread, setUnread]           = useState(0);
  const [openedTicket, setOpenedTicket] = useState(null);

  const initials    = getInitials(user?.full_name);
  const displayName = user?.full_name || 'Support Officer';

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    getUnreadCount().then(r => setUnread(r.data.data?.count || 0)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); setShowResults(false); return; }
    const t = setTimeout(() => {
      searchTickets(query).then(r => { setResults(r.data.data || []); setShowResults(true); }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleTicketSelect = (ticket) => {
    setOpenedTicket(ticket);
    setQuery('');
    setShowResults(false);
  };

  const renderView = () => {
    switch (activeModule) {
      case 'ticket-queue':         return <TicketQueueView onOpenTicket={handleTicketSelect} />;
      case 'ticket-processing':    return <TicketProcessingView initialTicket={openedTicket} />;
      case 'client-communication': return <ClientCommunicationView />;
      case 'knowledge-base':       return <KnowledgeBaseView />;
      case 'personal-performance': return <PersonalPerformanceView />;
      default:                     return <TicketQueueView onOpenTicket={handleTicketSelect} />;
    }
  };

  return (
    <div className="ml-[240px] h-screen flex flex-col bg-gray-50 dark:bg-slate-900 overflow-hidden">

      {/* Top bar */}
      <header className="h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center px-6 gap-4 shrink-0 shadow-sm">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 dark:text-slate-500">Support Officer</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">{VIEW_LABELS[activeModule] || 'Dashboard'}</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none">??</span>
          <input
            className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white dark:bg-slate-800 transition-all"
            placeholder="Search tickets..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {showResults && results.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
              {results.map(t => (
                <li
                  key={t.id}
                  onMouseDown={() => handleTicketSelect(t)}
                  className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-blue-50 border-b border-gray-100 dark:border-slate-700 last:border-none"
                >
                  <span className="text-[10px] font-bold text-blue-600 w-20 shrink-0">#{t.id.slice(0,8).toUpperCase()}</span>
                  <span className="flex-1 text-sm text-gray-800 truncate">{t.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0
                    ${t.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      t.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      t.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <DarkModeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-600" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-500 dark:text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
            )}
          </button>
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-600" />
          <ProfileDropdown />
        </div>
      </header>

      {/* Main workspace */}
      <main className="flex-1 overflow-y-auto p-6 min-h-0">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="h-10 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            {displayName} · Online
          </span>
          <span className="text-gray-200">|</span>
          <span>© 2026 JavaPA Software Limited.</span>
        </div>
        <div className="flex gap-4">
          <a href={settings.termsUrl} className="text-xs text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors">Terms</a>
          <a href={settings.privacyPolicyUrl} className="text-xs text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors">Privacy</a>
          <a href={settings.slaPolicyUrl} className="text-xs text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors">SLA Policy</a>
        </div>
      </footer>
    </div>
  );
}
