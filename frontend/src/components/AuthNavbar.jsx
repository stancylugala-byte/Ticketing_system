import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useSystemSettings } from '../context/SystemSettingsContext';

export default function AuthNavbar({ showLogin = true, showSignUp = true, showOnlySignUp = false }) {
  const { settings } = useSystemSettings();

  return (
    <nav className="h-14 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 shrink-0"
      style={{ background: settings.sidebarBg || '#0f1623' }}>

      {/* Logo — clicking takes you to home */}
      <Link to="/" className="flex items-center gap-2.5 group">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt={settings.companyName} className="w-8 h-8 object-contain rounded-lg shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: settings.primaryColor || '#2563eb' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
        <span className="text-white font-bold text-[15px] group-hover:text-blue-300 transition-colors">
          {settings.companyName || 'JavaPA'}
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <DarkModeToggle />
        {!showOnlySignUp && showLogin && (
          <Link to="/login" className="text-white/80 text-sm font-medium hover:text-white transition-colors px-2 py-1">
            Login
          </Link>
        )}
        {showSignUp && (
          <Link to="/signup"
            className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all border border-white/30 hover:brightness-110 active:scale-95"
            style={{ background: settings.primaryColor || '#2563eb' }}>
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
