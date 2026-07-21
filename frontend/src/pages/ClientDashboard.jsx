import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSystemSettings } from '../context/SystemSettingsContext';
import ClientSidebar        from '../components/client/ClientSidebar';
import DarkModeToggle       from '../components/DarkModeToggle';
import ProfileDropdown      from '../components/ProfileDropdown';
import NewTicketModal       from '../components/client/NewTicketModal';

// Views
import TicketListView       from '../components/client/views/TicketListView';
import CreateTicketView     from '../components/client/views/CreateTicketView';
import UpdateTicketView     from '../components/client/views/UpdateTicketView';
import ReopenTicketView     from '../components/client/views/ReopenTicketView';
import CloseTicketView      from '../components/client/views/CloseTicketView';
import TrackStatusView      from '../components/client/views/TrackStatusView';
import AssignedStaffView    from '../components/client/views/AssignedStaffView';
import TimelineView         from '../components/client/views/TimelineView';
import CommentsView         from '../components/client/views/CommentsView';
import ChatView             from '../components/client/views/ChatView';
import NotificationsView    from '../components/client/views/NotificationsView';
import KnowledgeView        from '../components/client/views/KnowledgeView';

import {
  getDashboardStats, getMyTickets, getNotifications
} from '../api/clientApi';

const VIEW_LABELS = {
  'dashboard':           'Dashboard Overview',
  'create-ticket':       'Create Ticket',
  'view-tickets':        'View Tickets',
  'update-ticket':       'Update Ticket',
  'reopen-ticket':       'Reopen Ticket',
  'close-ticket':        'Close Ticket Confirmation',
  'track-status':        'Track Status',
  'assigned-staff':      'View Assigned Staff',
  'resolution-timeline': 'View Resolution Timeline',
  'ticket-comments':     'Ticket Comments',
  'chat-support':        'Chat with Support',
  'notifications':       'Notifications',
  'faqs':                'FAQs',
  'user-manuals':        'User Manuals',
  'troubleshooting':     'Troubleshooting Guides',
};

function KpiCard({ label, value, icon, color, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl border ${color} px-5 py-4 shadow-sm flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all' : ''}`}
    >
      <div className="text-2xl shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        {value === null
          ? <div className="h-7 w-12 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
          : <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 leading-none">{value}</p>
        }
        {sub && <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {onClick && <span className="ml-auto text-gray-300 dark:text-slate-600 text-lg">→</span>}
    </div>
  );
}

function DashboardOverview({ stats, tickets, onNavigate, onNewTicket, primaryColor }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Total Tickets"    value={stats?.totalTickets ?? null}    icon="🎫" color="border-blue-200"    sub="Lifetime requests"    onClick={() => onNavigate('view-tickets')} />
        <KpiCard label="Open Tickets"     value={stats?.openTickets ?? null}     icon="🔧" color="border-orange-200"  sub="Currently active"     onClick={() => onNavigate('view-tickets')} />
        <KpiCard label="Pending Tickets"  value={stats?.pendingTickets ?? null}  icon="⏳" color="border-yellow-200"  sub="Awaiting response"    onClick={() => onNavigate('track-status')} />
        <KpiCard label="Resolved Tickets" value={stats?.resolvedTickets ?? null} icon="✅" color="border-emerald-200" sub="Successfully closed"   onClick={() => onNavigate('track-status')} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Create Ticket',   key: 'create-ticket',   icon: '➕', primary: true },
          { label: 'View Tickets',    key: 'view-tickets',    icon: '🎫', primary: false },
          { label: 'Track Status',    key: 'track-status',    icon: '📊', primary: false },
          { label: 'Notifications',   key: 'notifications',   icon: '🔔', primary: false },
        ].map(a => (
          <button key={a.key} onClick={() => onNavigate(a.key)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              a.primary
                ? 'text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200'
            }`}
            style={a.primary ? { background: primaryColor || '#2563eb' } : {}}>
            <span>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100">Recent Tickets</h3>
          <button onClick={() => onNavigate('view-tickets')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All →</button>
        </div>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 dark:text-slate-500 gap-2">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-medium">No tickets yet</p>
            <button onClick={onNewTicket}
              className="mt-2 px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors"
              style={{ background: primaryColor || '#2563eb' }}>
              Create your first ticket
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {tickets.slice(0, 6).map(t => (
              <div key={t.id} onClick={() => onNavigate('view-tickets')}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-blue-600">#{t.id.slice(0,8).toUpperCase()}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{t.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                    ${t.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      t.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      t.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {t.priority}
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full
                    ${t.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                      t.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      t.status === 'Pending' ? 'bg-purple-100 text-purple-700' :
                      t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const { settings } = useSystemSettings();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats]                 = useState(null);
  const [tickets, setTickets]             = useState([]);
  const [unread, setUnread]               = useState(0);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [search, setSearch]               = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sRes, tRes, nRes] = await Promise.all([
        getDashboardStats(),
        getMyTickets({ page: 1, limit: 10 }),
        getNotifications(),
      ]);
      setStats(sRes.data.data);
      setTickets(tRes.data.data?.tickets || []);
      setUnread(nRes.data.data?.unreadCount || 0);
    } catch (e) { console.error(e); }
  };

  const handleNavigate = (section) => {
    if (section === 'create-ticket') { setShowNewTicket(true); return; }
    setActiveSection(section);
    setMobileSidebarOpen(false);
  };

  const renderView = () => {
    switch (activeSection) {
      case 'dashboard':           return <DashboardOverview stats={stats} tickets={tickets} onNavigate={handleNavigate} onNewTicket={() => setShowNewTicket(true)} primaryColor={settings.primaryColor} />;
      case 'view-tickets':        return <TicketListView onRefresh={loadData} globalSearch={search} />;
      case 'update-ticket':       return <UpdateTicketView onRefresh={loadData} onNavigate={handleNavigate} />;
      case 'reopen-ticket':       return <ReopenTicketView onRefresh={loadData} />;
      case 'close-ticket':        return <CloseTicketView onRefresh={loadData} />;
      case 'track-status':        return <TrackStatusView />;
      case 'assigned-staff':      return <AssignedStaffView />;
      case 'resolution-timeline': return <TimelineView />;
      case 'ticket-comments':     return <CommentsView />;
      case 'chat-support':        return <ChatView />;
      case 'notifications':       return <NotificationsView onRefresh={loadData} />;
      case 'faqs':                return <KnowledgeView type="faqs" />;
      case 'user-manuals':        return <KnowledgeView type="manuals" />;
      case 'troubleshooting':     return <KnowledgeView type="troubleshooting" />;
      default:                    return <DashboardOverview stats={stats} tickets={tickets} onNavigate={handleNavigate} onNewTicket={() => setShowNewTicket(true)} primaryColor={settings.primaryColor} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar — always visible on md+, drawer on mobile */}
      <div className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 h-screen transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <ClientSidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(v => !v)}
          unreadNotifs={unread}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300">
        {/* Topbar */}
        <header className="h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 gap-3 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            {/* Hamburger — mobile only */}
            <button onClick={() => setMobileSidebarOpen(v => !v)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="hidden sm:block text-xs text-gray-400 dark:text-slate-500">Client Portal</span>
            <span className="hidden sm:block text-gray-300 dark:text-slate-600">/</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate max-w-[140px] sm:max-w-none">{VIEW_LABELS[activeSection]}</span>
          </div>
          <div className="relative flex-1 max-w-xs mx-2 sm:mx-auto sm:max-w-sm hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none">🔍</span>
            <input
              className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm placeholder-gray-400 dark:text-slate-200 outline-none focus:border-blue-500 transition-all"
              placeholder="Search tickets, articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={() => setShowNewTicket(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              style={{ background: settings.primaryColor || '#2563eb' }}>
              <span>+</span> <span className="hidden sm:inline">New Ticket</span>
            </button>
            <DarkModeToggle />
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-600 hidden sm:block" />
            <ProfileDropdown />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 dark:bg-slate-900">
          {renderView()}
        </main>

        {/* Footer */}
        <footer className="h-9 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
            <span className="truncate">{user?.full_name} · Client Account</span>
          </span>
          <div className="flex gap-3 sm:gap-4 shrink-0">
            <a href={settings.termsUrl} className="text-xs text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors">Terms</a>
            <a href={settings.privacyPolicyUrl} className="text-xs text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors">Privacy</a>
            <a href={settings.slaPolicyUrl} className="text-xs text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors hidden sm:block">SLA Policy</a>
          </div>
        </footer>
      </div>

      <NewTicketModal
        isOpen={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        onSuccess={() => { setShowNewTicket(false); loadData(); setActiveSection('view-tickets'); }}
      />
    </div>
  );
}
