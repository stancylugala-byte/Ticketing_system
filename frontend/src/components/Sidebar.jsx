import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiList, FiSettings, FiBook, FiLogOut, FiMessageSquare, FiBarChart2, FiInbox } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSystemSettings } from '../context/SystemSettingsContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const NAV = [
  { id: 'ticket-queue',         label: 'Ticket Queue',        icon: FiInbox },
  { id: 'ticket-processing',    label: 'Ticket Processing',   icon: FiList },
  { id: 'client-communication', label: 'Client Communication',icon: FiMessageSquare },
  { id: 'knowledge-base',       label: 'Knowledge Base',      icon: FiBook },
  { id: 'personal-performance', label: 'Performance',         icon: FiBarChart2 },
];

// This sidebar is for SupportDashboard — receives activePage + onNavigate from SupportLayout in App.jsx
const Sidebar = ({ activePage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { settings }     = useSystemSettings();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-60 flex flex-col z-40 border-r border-white/10"
      style={{ background: settings.sidebarBg }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 shrink-0">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt="logo" className="h-8 object-contain" />
        ) : (
          <h1 className="text-xl font-bold text-white">
            {settings.companyName || 'JavaPA'}
          </h1>
        )}
        <p className="text-white/40 text-xs mt-0.5">{settings.tagline || 'Support Hub'}</p>
      </div>

      {/* User card */}
      <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800/5 border border-white/10 flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ background: settings.primaryColor }}>
          {getInitials(user?.full_name)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'Officer'}</p>
          <p className="text-white/40 text-[10px]">Support Officer</p>
        </div>
        <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 pb-2">Navigation</p>
        {NAV.map(item => {
          const isActive = activePage === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate?.(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white dark:bg-slate-800/8'
              }`}
              style={isActive ? { background: `${settings.primaryColor}30` } : {}}
            >
              <item.icon size={16} className="shrink-0"
                style={isActive ? { color: settings.primaryColor } : {}} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 pt-2 border-t border-white/10 space-y-0.5 shrink-0">
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 pb-1">Account</p>
        <button onClick={() => navigate('/profile')}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white dark:bg-slate-800/8 transition-all">
          <FiSettings size={14} /> Profile &amp; Settings
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all">
          <FiLogOut size={14} /> Logout
        </button>
        <p className="text-[10px] text-white/20 px-3 pt-2">{settings.footerText || '© 2026 JavaPA'}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
