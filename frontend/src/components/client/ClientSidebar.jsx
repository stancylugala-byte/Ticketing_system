import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemSettings } from '../../context/SystemSettingsContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const NAV = [
  {
    section: 'Ticket Management',
    items: [
      { key: 'create-ticket',    label: 'Create Ticket',              icon: '➕' },
      { key: 'view-tickets',     label: 'View Tickets',               icon: '🎫' },
      { key: 'update-ticket',    label: 'Update Ticket',              icon: '✏️' },
      { key: 'reopen-ticket',    label: 'Reopen Ticket',              icon: '↩️' },
      { key: 'close-ticket',     label: 'Close Ticket Confirmation',  icon: '✅' },
    ],
  },
  {
    section: 'Ticket Tracking',
    items: [
      { key: 'track-status',     label: 'Track Status',               icon: '📊' },
      { key: 'assigned-staff',   label: 'View Assigned Staff',        icon: '👤' },
      { key: 'resolution-timeline', label: 'View Resolution Timeline', icon: '📅' },
    ],
  },
  {
    section: 'Communication Center',
    items: [
      { key: 'ticket-comments',  label: 'Ticket Comments',            icon: '💬' },
      { key: 'chat-support',     label: 'Chat with Support',          icon: '🗨️' },
      { key: 'notifications',    label: 'Notifications',              icon: '🔔' },
    ],
  },
  {
    section: 'Knowledge',
    items: [
      { key: 'faqs',             label: 'FAQs',                       icon: '❓' },
      { key: 'user-manuals',     label: 'User Manuals',               icon: '📖' },
      { key: 'troubleshooting',  label: 'Troubleshooting Guides',     icon: '🔧' },
    ],
  },
];

export default function ClientSidebar({ activeSection, onNavigate }) {
  const { user, logout } = useAuth();
  const { settings }     = useSystemSettings();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-50 overflow-y-auto"
      style={{ background: settings.sidebarBg }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: settings.primaryColor }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
        <div>
          <p className="text-white font-bold text-sm leading-tight">{settings.companyName}</p>
          <p className="text-white/40 text-[10px]">Client Portal</p>
        </div>
      </div>

      {/* User card */}
      <div className="mx-3 mt-3 mb-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: settings.primaryColor }}>
          {getInitials(user?.full_name)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'Client'}</p>
          <p className="text-white/40 text-[10px]">Client Account</p>
        </div>
        <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5">
        {/* Dashboard shortcut */}
        <button
          onClick={() => onNavigate('dashboard')}
          style={activeSection === 'dashboard' ? { background: settings.primaryColor } : {}}
          className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all mb-1
            ${activeSection === 'dashboard' ? 'text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}
        >
          <span className="text-sm shrink-0">🏠</span>
          <span>Dashboard Overview</span>
          {activeSection === 'dashboard' && <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />}
        </button>

        {NAV.map(group => (
          <div key={group.section}>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 pt-3 pb-1.5">
              {group.section}
            </p>
            {group.items.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                style={activeSection === item.key ? { background: settings.primaryColor } : {}}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                  ${activeSection === item.key ? 'text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}
              >
                <span className="shrink-0 text-sm">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {activeSection === item.key && <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 pt-2 border-t border-white/10 flex flex-col gap-0.5 shrink-0">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium text-white/50 hover:bg-white/8 hover:text-white transition-all"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
