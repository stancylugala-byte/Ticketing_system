import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

export default function AuthNavbar({ showLogin = true, showSignUp = true, showOnlySignUp = false }) {
  return (
    <nav className="h-14 bg-gray-900 dark:bg-slate-900 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-white font-bold text-[15px] group-hover:text-blue-300 transition-colors">JavaPA</span>
      </Link>

      <div className="flex items-center gap-3">
        <DarkModeToggle />
        {!showOnlySignUp && showLogin && (
          <Link to="/login" className="text-white/80 text-sm font-medium hover:text-white transition-colors px-2 py-1">
            Login
          </Link>
        )}
        {showSignUp && (
          <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
