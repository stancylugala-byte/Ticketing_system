const navItems = [
  { label: 'Client Portal', icon: '⊞', key: 'client' },
  { label: 'Support Queue', icon: '☰', key: 'support' },
  { label: 'Dev Backlog', icon: '⚙', key: 'dev' },
  { label: 'Performance', icon: '📊', key: 'performance' },
  { label: 'Admin Settings', icon: '🛡', key: 'admin' },
];

const resources = [
  { label: 'Knowledge Base', icon: '📖', key: 'kb' },
  { label: 'Support', icon: '💬', key: 'support-res' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const NavBtn = ({ item }) => (
    <button
      onClick={() => onNavigate(item.key)}
      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
        ${activePage === item.key
          ? 'bg-blue-600 text-white'
          : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
    >
      <span className="w-4 text-center text-sm shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0f1623] flex flex-col z-50 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">▲</div>
        <span className="text-white font-bold text-[15px] tracking-wide">SupportDesk</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-3 pb-1.5">Dashboards</p>
        {navItems.map(item => <NavBtn key={item.key} item={item} />)}

        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-5 pb-1.5">Resources</p>
        {resources.map(item => <NavBtn key={item.key} item={item} />)}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 pb-5 pt-2 border-t border-white/10 flex flex-col gap-0.5">
        <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all">
          <span className="w-4 text-center shrink-0">⚙</span>
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
          <span className="w-4 text-center shrink-0">→</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
