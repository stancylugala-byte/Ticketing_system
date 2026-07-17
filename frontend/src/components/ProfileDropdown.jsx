import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSystemSettings } from '../context/SystemSettingsContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const ROLE_DASHBOARDS = {
  Client:         '/dashboard/client',
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Manager:        '/dashboard/manager',
  Admin:          '/dashboard/admin',
};

const ROLE_LABELS = {
  Client:         'Client Dashboard',
  SupportOfficer: 'Support Dashboard',
  Developer:      'Dev Dashboard',
  Manager:        'Manager Dashboard',
  Admin:          'Admin Dashboard',
};

export default function ProfileDropdown({ accentColor }) {
  const { user, logout }  = useAuth();
  const { settings }      = useSystemSettings();
  const navigate          = useNavigate();
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  // Resolve accent: prop wins, fallback to system primary colour
  const accent = accentColor || settings.primaryColor || '#2563eb';
  // Check if accent is a CSS class (starts with "bg-") or a hex color
  const avatarStyle = accent.startsWith('#') || accent.startsWith('rgb')
    ? { background: accent }
    : {};
  const avatarClass = accent.startsWith('#') || accent.startsWith('rgb')
    ? ''
    : accent; // e.g. "bg-blue-600"

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout    = () => { setOpen(false); logout(); navigate('/login'); };
  const handleProfile   = () => { setOpen(false); navigate('/profile'); };
  const handleDashboard = () => { setOpen(false); navigate(ROLE_DASHBOARDS[user?.role] || '/'); };

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="relative" ref={ref}>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-full border
          border-gray-200 dark:border-slate-600
          bg-white dark:bg-slate-700
          hover:bg-gray-50 dark:hover:bg-slate-600
          hover:border-gray-300 dark:hover:border-slate-500
          shadow-sm transition-all cursor-pointer select-none"
      >
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white ${avatarClass}`}
          style={avatarStyle}
        >
          {getInitials(user?.full_name)}
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
          Hi, {firstName}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 dark:text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl z-[200] overflow-hidden
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700">

          {/* Account header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Account
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">
              {user?.email}
            </p>
          </div>

          {/* Dashboard link */}
          <div className="px-2 py-1.5 border-b border-gray-100 dark:border-slate-700">
            <button
              onClick={handleDashboard}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors
                text-gray-800 dark:text-slate-100
                bg-gray-50 dark:bg-slate-700/60
                hover:bg-blue-50 dark:hover:bg-blue-500/15
                hover:text-blue-700 dark:hover:text-blue-400"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {ROLE_LABELS[user?.role] || 'Dashboard'}
            </button>
          </div>

          {/* Profile link */}
          <div className="border-b border-gray-100 dark:border-slate-700">
            <button
              onClick={handleProfile}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-left transition-colors
                text-gray-700 dark:text-slate-200
                hover:bg-gray-50 dark:hover:bg-slate-700/60"
            >
              <svg className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-left transition-colors
              text-red-500 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>

        </div>
      )}
    </div>
  );
}
