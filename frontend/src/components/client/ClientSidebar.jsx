import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemSettings } from '../../context/SystemSettingsContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// All SVG icons — no emoji
const Icons = {
  overview:     <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  create:       <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  view:         <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  edit:         <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  reopen:       <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  close:        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  track:        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  staff:        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  timeline:     <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  comments:     <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  chat:         <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
  bell:         <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  faq:          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  book:         <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  tool:         <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  profile:      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  logout:       <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  chevronLeft:  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>,
  chevronRight: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>,
};

const NAV = [
  {
    section: 'Ticket Management',
    items: [
      { key: 'create-ticket',       label: 'Create Ticket',             icon: 'create' },
      { key: 'view-tickets',        label: 'View Tickets',              icon: 'view' },
      { key: 'update-ticket',       label: 'Update Ticket',             icon: 'edit' },
      { key: 'reopen-ticket',       label: 'Reopen Ticket',             icon: 'reopen' },
      { key: 'close-ticket',        label: 'Close Ticket',              icon: 'close' },
    ],
  },
  {
    section: 'Ticket Tracking',
    items: [
      { key: 'track-status',        label: 'Track Status',              icon: 'track' },
      { key: 'assigned-staff',      label: 'Assigned Staff',            icon: 'staff' },
      { key: 'resolution-timeline', label: 'Resolution Timeline',       icon: 'timeline' },
    ],
  },
  {
    section: 'Communication',
    items: [
      { key: 'ticket-comments',     label: 'Ticket Comments',           icon: 'comments' },
      { key: 'chat-support',        label: 'Chat with Support',         icon: 'chat' },
      { key: 'notifications',       label: 'Notifications',             icon: 'bell' },
    ],
  },
  {
    section: 'Knowledge',
    items: [
      { key: 'faqs',                label: 'FAQs',                      icon: 'faq' },
      { key: 'user-manuals',        label: 'User Manuals',              icon: 'book' },
      { key: 'troubleshooting',     label: 'Troubleshooting',           icon: 'tool' },
    ],
  },
];

export default function ClientSidebar({ activeSection, onNavigate, collapsed, onToggle, unreadNotifs = 0 }) {
  const { user, logout }  = useAuth();
  const { settings }      = useSystemSettings();
  const navigate          = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const w = collapsed ? 'w-16' : 'w-64';

  return (
    <aside
      className={`relative h-full ${w} flex flex-col z-50 overflow-y-auto transition-all duration-300`}
      style={{ background: settings.sidebarBg }}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 shrink-0 relative">
        <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
          {settings.logoUrl
            ? <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg shrink-0" />
            : <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: settings.primaryColor }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
          }
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm leading-tight truncate">{settings.companyName}</p>
              <p className="text-white/40 text-[10px]">Client Portal</p>
            </div>
          )}
        </Link>
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-white">{collapsed ? Icons.chevronRight : Icons.chevronLeft}</span>
        </button>
      </div>

      {/* User card */}
      {!collapsed && (
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
      )}
      {collapsed && (
        <div className="flex justify-center mt-3 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: settings.primaryColor }}>
            {getInitials(user?.full_name)}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {/* Dashboard shortcut */}
        <button
          onClick={() => onNavigate('dashboard')}
          title="Dashboard Overview"
          style={activeSection === 'dashboard' ? { background: settings.primaryColor } : {}}
          className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-lg text-xs font-medium transition-all mb-1
            ${activeSection === 'dashboard' ? 'text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'}
            ${collapsed ? 'justify-center' : ''}`}
        >
          {Icons.overview}
          {!collapsed && <span>Dashboard Overview</span>}
          {!collapsed && activeSection === 'dashboard' && <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />}
        </button>

        {NAV.map(group => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 pt-3 pb-1.5">
                {group.section}
              </p>
            )}
            {collapsed && <div className="my-1.5 mx-2 h-px bg-white/10" />}
            {group.items.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                title={item.label}
                style={activeSection === item.key ? { background: settings.primaryColor } : {}}
                className={`relative flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-lg text-xs font-medium transition-all
                  ${activeSection === item.key ? 'text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}`}
              >
                {Icons[item.icon]}
                {!collapsed && <span className="truncate">{item.label}</span>}
                {/* Notification badge */}
                {item.key === 'notifications' && unreadNotifs > 0 && (
                  <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1`}>
                    {unreadNotifs > 99 ? '99+' : unreadNotifs}
                  </span>
                )}
                {!collapsed && activeSection === item.key && item.key !== 'notifications' && <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 pt-2 border-t border-white/10 flex flex-col gap-0.5 shrink-0">
        <button onClick={() => navigate('/profile')} title="Profile"
          className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-lg text-xs font-medium text-white/50 hover:bg-white/8 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}>
          {Icons.profile}
          {!collapsed && <span>Profile</span>}
        </button>
        <button onClick={handleLogout} title="Logout"
          className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${collapsed ? 'justify-center' : ''}`}>
          {Icons.logout}
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
