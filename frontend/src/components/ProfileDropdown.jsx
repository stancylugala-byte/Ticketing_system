import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

export default function ProfileDropdown({ accentColor = 'bg-blue-600' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
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

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all cursor-pointer select-none"
      >
        {/* Avatar circle */}
        <div className={`w-7 h-7 ${accentColor} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>
          {getInitials(user?.full_name)}
        </div>
        <span className="text-sm font-semibold text-gray-800">Hi, {firstName}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[200] overflow-hidden">

          {/* Account header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Dashboard link */}
          <div className="px-2 py-1.5 border-b border-gray-100">
            <button
              onClick={handleDashboard}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {ROLE_LABELS[user?.role] || 'Dashboard'}
            </button>
          </div>

          {/* Profile link */}
          <div className="border-b border-gray-100">
            <button
              onClick={handleProfile}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
            >
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
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
