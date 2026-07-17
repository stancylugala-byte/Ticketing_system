import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import ProfileDropdown from '../ProfileDropdown';
import DarkModeToggle  from '../DarkModeToggle';
import {
  FiTool, FiAlertTriangle, FiClock, FiCheckSquare,
  FiUser, FiLogOut, FiZap, FiChevronDown, FiChevronRight
} from 'react-icons/fi';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const LABEL_TO_ID = {
  'Assigned Bugs':       'assigned-bugs',
  'Bug Details':         'bug-details',
  'Bug Status':          'bug-status',
  'Open Incidents':      'open-incidents',
  'Critical Incidents':  'critical-incidents',
  'Incident Resolution': 'incident-resolution',
  'Log Work Hours':      'log-hours',
  'Update Progress':     'update-progress',
  'Resolution Notes':    'resolution-notes',
  'Root Cause Analysis': 'rca',
};

const DEV_NAV = [
  { label: 'Bug Management',      icon: FiTool,          items: ['Assigned Bugs','Bug Details','Bug Status'] },
  { label: 'Incident Management', icon: FiAlertTriangle, items: ['Open Incidents','Critical Incidents','Incident Resolution'] },
  { label: 'Work Logs',           icon: FiClock,         items: ['Log Work Hours','Update Progress'] },
  { label: 'Resolution Center',   icon: FiCheckSquare,   items: ['Resolution Notes','Root Cause Analysis'] },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function DevSidebar({ activeView, onSelect, settings }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState({ 0:true, 1:true, 2:true, 3:true });

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-56 flex flex-col z-50 border-r border-gray-200 dark:border-slate-700/50"
      style={{ background: settings.sidebarBg }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10 shrink-0">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt="logo" className="w-7 h-7 rounded-lg object-contain" />
        ) : (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: settings.primaryColor }}>
            <FiZap size={14} className="text-white" />
          </div>
        )}
        <div>
          <p className="text-white font-bold text-sm">{settings.companyName}</p>
          <p className="text-white/40 text-[10px]">Engineering Portal</p>
        </div>
      </div>

      {/* Dev user card */}
      <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800/5 border border-white/10 flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ background: settings.primaryColor }}>
          {getInitials(user?.full_name)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'Developer'}</p>
          <p className="text-white/40 text-[10px]">Developer</p>
        </div>
        <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-2 py-2">
          Engineering Directory
        </p>
        {DEV_NAV.map((section, si) => (
          <div key={si}>
            <button
              onClick={() => setOpen(p => ({ ...p, [si]: !p[si] }))}
              className="flex items-center gap-2 w-full px-2 py-2 text-white/50 hover:text-white transition-colors rounded-lg"
            >
              {open[si] ? <FiChevronDown size={11} className="shrink-0" /> : <FiChevronRight size={11} className="shrink-0" />}
              <section.icon size={12} className="shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wide truncate">{section.label}</span>
            </button>
            {open[si] && (
              <div className="ml-4 space-y-0.5 mb-1">
                {section.items.map(item => {
                  const viewId   = LABEL_TO_ID[item];
                  const isActive = activeView === viewId;
                  return (
                    <button key={item} onClick={() => onSelect(viewId)}
                      className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs transition-all ${
                        isActive ? 'text-white font-semibold bg-white dark:bg-slate-800/15' : 'text-white/50 hover:text-white hover:bg-white dark:bg-slate-800/8'
                      }`}
                      style={isActive ? { background: `${settings.primaryColor}30` } : {}}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: isActive ? settings.primaryColor : 'rgba(255,255,255,0.2)' }} />
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 pt-2 border-t border-white/10 space-y-0.5 shrink-0">
        <button onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white dark:bg-slate-800/8 transition-all">
          <FiUser size={13} /> Profile
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all">
          <FiLogOut size={13} /> Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const { settings }      = useSystemSettings();
  const navigate          = useNavigate();
  const [activeView, setActiveView] = useState('assigned-bugs');

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${settings.primaryColor} transparent transparent transparent` }} />
    </div>
  );

  if (!user) { navigate('/login', { replace: true }); return null; }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <DevSidebar activeView={activeView} onSelect={setActiveView} settings={settings} />

      <div className="flex-1 ml-56 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-5 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-slate-500">Developer Portal</span>
            <span className="text-gray-300 dark:text-slate-600 mx-1">/</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">Engineering Backlog</span>
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" />
            <ProfileDropdown accentColor={settings.primaryColor} />
          </div>
        </header>

        {/* Content — pass activeView to child */}
        <main className="flex-1 overflow-hidden">
          {React.isValidElement(children)
            ? React.cloneElement(children, { activeView, setActiveView })
            : children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
