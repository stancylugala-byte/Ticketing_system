import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';

import AdminKPIs              from '../components/admin/AdminKPIs';
import UsersView              from '../components/admin/UsersView';
import RolesView              from '../components/admin/RolesView';
import OrganizationView       from '../components/admin/OrganizationView';
import CategoriesView         from '../components/admin/CategoriesView';
import SlaSettingsView        from '../components/admin/SlaSettingsView';
import BackupSecurityView     from '../components/admin/BackupSecurityView';
import UserActivityView       from '../components/admin/UserActivityView';
import LoginHistoryView       from '../components/admin/LoginHistoryView';
import TicketHistoryView      from '../components/admin/TicketHistoryView';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const NAV = [
  {
    section: 'User Management',
    items: [
      { key: 'clients',         label: 'Clients',          icon: '👥' },
      { key: 'officers',        label: 'Support Officers',  icon: '🎧' },
      { key: 'developers',      label: 'Developers',        icon: '💻' },
      { key: 'managers',        label: 'Managers',          icon: '📊' },
    ],
  },
  {
    section: 'Role & Permissions',
    items: [
      { key: 'roles',           label: 'Create Roles',      icon: '🔑' },
      { key: 'permissions',     label: 'Assign Permissions', icon: '🛡' },
    ],
  },
  {
    section: 'Organization',
    items: [
      { key: 'companies',       label: 'Companies',         icon: '🏢' },
      { key: 'departments',     label: 'Departments',       icon: '🗂' },
    ],
  },
  {
    section: 'System Configuration',
    items: [
      { key: 'categories',      label: 'Ticket Categories', icon: '🏷' },
      { key: 'sla-settings',    label: 'SLA Settings',      icon: '⏱' },
      { key: 'backup-security', label: 'Backup & Security', icon: '🔒' },
    ],
  },
  {
    section: 'Audit Logs',
    items: [
      { key: 'user-activity',   label: 'User Activities',   icon: '📋' },
      { key: 'login-history',   label: 'Login History',     icon: '🕐' },
      { key: 'ticket-history',  label: 'Ticket History',    icon: '🎫' },
    ],
  },
];

const VIEW_LABELS = {
  clients: 'Clients', officers: 'Support Officers', developers: 'Developers', managers: 'Managers',
  roles: 'Create Roles', permissions: 'Assign Permissions',
  companies: 'Companies', departments: 'Departments',
  categories: 'Ticket Categories', 'sla-settings': 'SLA Settings', 'backup-security': 'Backup & Security',
  'user-activity': 'User Activities', 'login-history': 'Login History', 'ticket-history': 'Ticket History',
};

const ROLE_MAP = {
  clients: 'Client', officers: 'SupportOfficer', developers: 'Developer', managers: 'Admin',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('clients');
  const [collapsed, setCollapsed] = useState({});
  const [search, setSearch] = useState('');

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleSection = (s) => setCollapsed(c => ({ ...c, [s]: !c[s] }));

  const renderView = () => {
    // User management views share UsersView with a role filter
    if (['clients', 'officers', 'developers', 'managers'].includes(activeView)) {
      return <UsersView roleFilter={ROLE_MAP[activeView]} label={VIEW_LABELS[activeView]} />;
    }
    switch (activeView) {
      case 'roles':           return <RolesView />;
      case 'permissions':     return <RolesView showPermissions />;
      case 'companies':       return <OrganizationView type="companies" />;
      case 'departments':     return <OrganizationView type="departments" />;
      case 'categories':      return <CategoriesView />;
      case 'sla-settings':    return <SlaSettingsView />;
      case 'backup-security': return <BackupSecurityView />;
      case 'user-activity':   return <UserActivityView />;
      case 'login-history':   return <LoginHistoryView />;
      case 'ticket-history':  return <TicketHistoryView />;
      default:                return <UsersView roleFilter="Client" label="Clients" />;
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">JavaPA</p>
            <p className="text-white/40 text-[10px]">Admin Control Panel</p>
          </div>
        </div>

        {/* Admin card */}
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(user?.full_name)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'Admin'}</p>
            <p className="text-white/40 text-[10px]">System Administrator</p>
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
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400">Admin Panel</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800">{VIEW_LABELS[activeView]}</span>
          </div>
          <div className="relative flex-1 max-w-sm mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">🔍</span>
            <input
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="Search platform..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <ProfileDropdown accentColor="bg-red-600" />
          </div>
        </header>

        {/* KPI strip */}
        <div className="px-5 pt-4 pb-0 shrink-0">
          <AdminKPIs />
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
              System Root Admin Session
            </span>
            <span className="text-gray-200">|</span>
            <span>Environment: Production (sts)</span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Security Status: Monitored</span>
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
