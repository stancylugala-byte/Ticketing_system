import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiList, FiSettings, FiBook, FiLogOut, FiMessageSquare, FiBarChart2, FiInbox, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSystemSettings } from '../context/SystemSettingsContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const NAV = [
  { id: 'ticket-queue',         label: 'Ticket Queue',         icon: FiInbox },
  { id: 'ticket-processing',    label: 'Ticket Processing',    icon: FiList },
  { id: 'client-communication', label: 'Client Communication', icon: FiMessageSquare },
  { id: 'knowledge-base',       label: 'Knowledge Base',       icon: FiBook },
  { id: 'personal-performance', label: 'Performance',          icon: FiBarChart2 },
];

const CollapseBtn = ({ collapsed, onToggle }) => (
  <button
    onClick={onToggle}
    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  >
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
    </svg>
  </button>
);

const Sidebar = ({ activePage, onNavigate, collapsed: collapsedProp, onToggle }) => {
  const { user, logout } = useAuth();
  const { settings }     = useSystemSettings();
  const navigate         = useNavigate();
  const [localCollapsed, setLocalCollapsed] = useState(false);

  // Use external prop if provided, otherwise internal state
  const collapsed = collapsedProp !== undefined ? collapsedProp : localCollapsed;
  const handleToggle = onToggle || (() => setLocalCollapsed(v => !v));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className={`relative h-full ${collapsed ? 'w-16' : 'w-60'} flex flex-col z-40 border-r border-white/10 transition-all duration-300`}
      style={{ background: settings.sidebarBg }}
    >
      {/* Logo + collapse toggle */}
      <div className="px-4 py-5 border-b border-white/10 shrink-0 relative flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="logo" className="w-8 h-8 object-contain rounded-lg shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm"
              style={{ background: settings.primaryColor }}>
              {(settings.companyName || 'J')[0]}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{settings.companyName || 'JavaPA'}</p>
              <p className="text-white/40 text-xs">{settings.tagline || 'Support Hub'}</p>
            </div>
          )}
        </Link>
        <CollapseBtn collapsed={collapsed} onToggle={handleToggle} />
      </div>

      {/* User card */}
      {!collapsed ? (
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 shrink-0">
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
      ) : (
        <div className="flex justify-center mt-3 mb-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: settings.primaryColor }}>
            {getInitials(user?.full_name)}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {!collapsed && (
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 pb-2">Navigation</p>
        )}
        {NAV.map(item => {
          const isActive = activePage === item.id;
          return (
            <button key={item.id}
              onClick={() => onNavigate?.(item.id)}
              title={item.label}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/8'}
                ${collapsed ? 'justify-center' : ''}`}
              style={isActive ? { background: `${settings.primaryColor}30` } : {}}
            >
              <item.icon size={16} className="shrink-0"
                style={isActive ? { color: settings.primaryColor } : {}} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 pt-2 border-t border-white/10 space-y-0.5 shrink-0">
        {!collapsed && (
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 pb-1">Account</p>
        )}
        <button onClick={() => navigate('/profile')} title="Profile"
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/8 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <FiUser size={14} />
          {!collapsed && <span>Profile &amp; Settings</span>}
        </button>
        <button onClick={handleLogout} title="Logout"
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <FiLogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-white/20 px-3 pt-2">{settings.footerText || '© 2026 JavaPA'}</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
