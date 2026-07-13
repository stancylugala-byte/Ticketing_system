import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from '../ProfileDropdown';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// Minimal dark sidebar for the Developer dashboard
function DevSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0A1628] border-r border-[#1E293B] flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1E293B]">
        <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm">JavaPA</p>
          <p className="text-[#94A3B8] text-[10px]">Engineering Portal</p>
        </div>
      </div>

      {/* Developer card */}
      <div className="mx-3 mt-4 mb-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
          {getInitials(user?.full_name)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'Developer'}</p>
          <p className="text-[#94A3B8] text-[10px]">Developer</p>
        </div>
        <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
        <p className="text-[10px] font-bold text-[#94A3B8]/50 uppercase tracking-widest px-2 pt-2 pb-1.5">Developer Tools</p>

        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-[#2563EB] text-white">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Engineering Backlog
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:bg-white/8 hover:text-white transition-all"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </button>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 pt-2 border-t border-[#1E293B] flex flex-col gap-1">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A1628]">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      <DevSidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-[#0A1628] border-b border-[#1E293B] flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Developer Portal</span>
            <span className="text-[#2D3748]">/</span>
            <span className="text-sm font-semibold text-white">Engineering Backlog</span>
          </div>
          <ProfileDropdown accentColor="bg-[#2563EB]" />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
