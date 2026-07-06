import { Link } from 'react-router-dom';

export default function ClientSidebar({ onNavigate }) {
  return (
    <div className="w-64 bg-slate-900 h-full flex flex-col text-white fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold">JavaPA</h1>
        <p className="text-xs text-slate-400 mt-1">Support Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* DASHBOARDS */}
        <div className="px-4 mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Dashboards
          </p>
          <Link to="/client">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium">
              <span>🏠</span>
              Client Portal
            </button>
          </Link>
        </div>

        {/* TICKET MANAGEMENT */}
        <div className="px-4 mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Ticket Management
          </p>
          <button
            onClick={() => onNavigate?.('tracking')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors text-left"
          >
            <span>📍</span>
            Ticket Tracking
          </button>
          <button
            onClick={() => onNavigate?.('communication')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors text-left"
          >
            <span>💬</span>
            Communication Center
          </button>
        </div>

        {/* RESOURCES */}
        <div className="px-4 mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Resources
          </p>
          <Link to="/knowledge-base">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors text-left">
              <span>📖</span>
              Knowledge Base
            </button>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors text-left">
            <span>🎧</span>
            Support
          </button>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-700 p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors text-left">
          <span>⚙️</span>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-slate-800 text-sm font-medium transition-colors text-left">
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
