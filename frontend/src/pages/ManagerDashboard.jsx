import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';

import ManagerKPIs             from '../components/manager/ManagerKPIs';
import AllTicketsView          from '../components/manager/AllTicketsView';
import TicketDistributionView  from '../components/manager/TicketDistributionView';
import EscalatedTicketsView    from '../components/manager/EscalatedTicketsView';
import StaffPerformanceView    from '../components/manager/StaffPerformanceView';
import WorkloadDistView        from '../components/manager/WorkloadDistView';
import SlaRulesView            from '../components/manager/SlaRulesView';
import SlaViolationsView       from '../components/manager/SlaViolationsView';
import ResolutionTimeView      from '../components/manager/ResolutionTimeView';
import TicketReportView        from '../components/manager/TicketReportView';
import EmployeeReportView      from '../components/manager/EmployeeReportView';
import ClientReportView        from '../components/manager/ClientReportView';
import TicketTrendsView        from '../components/manager/TicketTrendsView';
import CommonIssuesView        from '../components/manager/CommonIssuesView';
import ResolutionStatsView     from '../components/manager/ResolutionStatsView';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const NAV = [
  {
    section: 'Ticket Oversight',
    items: [
      { key: 'all-tickets',         label: 'All Tickets',          icon: '🗂' },
      { key: 'ticket-distribution', label: 'Ticket Distribution',  icon: '📊' },
      { key: 'escalated-tickets',   label: 'Escalated Tickets',    icon: '⬆' },
    ],
  },
  {
    section: 'Team Management',
    items: [
      { key: 'staff-performance',   label: 'Staff Performance',    icon: '👥' },
      { key: 'workload-dist',       label: 'Workload Distribution', icon: '⚖' },
    ],
  },
  {
    section: 'SLA Management',
    items: [
      { key: 'sla-rules',           label: 'SLA Rules',            icon: '📋' },
      { key: 'sla-violations',      label: 'SLA Violations',       icon: '⚠' },
      { key: 'resolution-time',     label: 'Resolution Time',      icon: '⏱' },
    ],
  },
  {
    section: 'Reports',
    items: [
      { key: 'ticket-report',       label: 'Ticket Reports',       icon: '📄' },
      { key: 'employee-report',     label: 'Employee Reports',     icon: '👤' },
      { key: 'client-report',       label: 'Client Reports',       icon: '🏢' },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { key: 'ticket-trends',       label: 'Ticket Trends',        icon: '📈' },
      { key: 'common-issues',       label: 'Common Issues',        icon: '🔍' },
      { key: 'resolution-stats',    label: 'Resolution Statistics', icon: '✅' },
    ],
  },
];

const VIEW_LABELS = {
  'all-tickets':         'All Tickets',
  'ticket-distribution': 'Ticket Distribution',
  'escalated-tickets':   'Escalated Tickets',
  'staff-performance':   'Staff Performance',
  'workload-dist':       'Workload Distribution',
  'sla-rules':           'SLA Rules',
  'sla-violations':      'SLA Violations',
  'resolution-time':     'Resolution Time Tracking',
  'ticket-report':       'Ticket Reports',
  'employee-report':     'Employee Reports',
  'client-report':       'Client Reports',
  'ticket-trends':       'Ticket Trends',
  'common-issues':       'Common Issues',
  'resolution-stats':    'Resolution Statistics',
};

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('all-tickets');
  const [collapsed, setCollapsed] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => { logout(); navigate('/login'); };

  const toggleSection = (section) =>
    setCollapsed(c => ({ ...c, [section]: !c[section] }));

  const renderView = () => {
    switch (activeView) {
      case 'all-tickets':         return <AllTicketsView />;
      case 'ticket-distribution': return <TicketDistributionView />;
      case 'escalated-tickets':   return <EscalatedTicketsView />;
      case 'staff-performance':   return <StaffPerformanceView />;
      case 'workload-dist':       return <WorkloadDistView />;
      case 'sla-rules':           return <SlaRulesView />;
      case 'sla-violations':      return <SlaViolationsView />;
      case 'resolution-time':     return <ResolutionTimeView />;
      case 'ticket-report':       return <TicketReportView />;
      case 'employee-report':     return <EmployeeReportView />;
      case 'client-report':       return <ClientReportView />;
      case 'ticket-trends':       return <TicketTrendsView />;
      case 'common-issues':       return <CommonIssuesView />;
      case 'resolution-stats':    return <ResolutionStatsView />;
      default:                    return <AllTicketsView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f3f8] overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-[#0f1623] flex flex-col shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">JavaPA</p>
            <p className="text-white/40 text-[10px]">Management Portal</p>
          </div>
        </div>

        {/* User card */}
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(user?.full_name)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'Manager'}</p>
            <p className="text-white/40 text-[10px]">Global Manager</p>
          </div>
          <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5">
          {NAV.map(group => (
            <div key={group.section}>
              <button
                onClick={() => toggleSection(group.section)}
                className="w-full flex items-center justify-between px-2 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest hover:text-white/50 transition-colors"
              >
                <span>{group.section}</span>
                <span className="text-[8px]">{collapsed[group.section] ? '▶' : '▼'}</span>
              </button>
              {!collapsed[group.section] && group.items.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${activeView === item.key
                      ? 'bg-blue-600 text-white'
                      : 'text-white/55 hover:bg-white/8 hover:text-white'
                    }`}
                >
                  <span className="shrink-0 text-sm">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {activeView === item.key && <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 pt-2 border-t border-white/10 flex flex-col gap-0.5 shrink-0">
          <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium text-white/50 hover:bg-white/8 hover:text-white transition-all">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0 shadow-sm relative z-40">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400">Management Portal</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800">{VIEW_LABELS[activeView]}</span>
          </div>
          <div className="relative flex-1 max-w-sm mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">🔍</span>
            <input
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="Search platform..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <ProfileDropdown />
          </div>
        </header>

        {/* KPI strip — always visible */}
        <div className="px-5 pt-4 pb-0 shrink-0">
          <ManagerKPIs />
        </div>

        {/* Active view */}
        <main className="flex-1 overflow-y-auto px-5 py-4">
          {renderView()}
        </main>

        {/* Footer */}
        <footer className="h-9 bg-white border-t border-gray-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              {user?.full_name}
            </span>
            <span className="text-gray-200">|</span>
            <span>Database: Connected (sts)</span>
            <span className="text-gray-200">|</span>
            <span>Uptime: 99.98%</span>
          </div>
          <div className="flex gap-4">
            {['Terms', 'Privacy', 'SLA Policy'].map(l => (
              <a key={l} href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
