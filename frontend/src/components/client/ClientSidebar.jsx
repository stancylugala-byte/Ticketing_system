import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ClientSidebar({ activeSection, onNavigate }) {
  const [trackingExpanded, setTrackingExpanded] = useState(false);
  const [communicationExpanded, setCommunicationExpanded] = useState(false);

  const handleTrackingClick = () => {
    setTrackingExpanded(!trackingExpanded);
    if (!trackingExpanded) {
      onNavigate?.('tracking-status');
    }
  };

  const handleCommunicationClick = () => {
    setCommunicationExpanded(!communicationExpanded);
    if (!communicationExpanded) {
      onNavigate?.('comm-comments');
    }
  };

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
          <button
            onClick={() => onNavigate?.('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${activeSection === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <span>🏠</span>
            Client Portal
          </button>
        </div>

        {/* TICKET MANAGEMENT */}
        <div className="px-4 mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Ticket Management
          </p>
          
          {/* Ticket Tracking (Collapsible) */}
          <div>
            <button
              onClick={handleTrackingClick}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeSection?.startsWith('tracking') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span>📍</span>
                Ticket Tracking
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${trackingExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sub-items */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
                ${trackingExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700 pl-2">
                <button
                  onClick={() => onNavigate?.('tracking-status')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                    ${activeSection === 'tracking-status' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Track Status
                </button>
                <button
                  onClick={() => onNavigate?.('tracking-staff')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                    ${activeSection === 'tracking-staff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  View Assigned Staff
                </button>
                <button
                  onClick={() => onNavigate?.('tracking-timeline')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                    ${activeSection === 'tracking-timeline' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  View Resolution Timeline
                </button>
              </div>
            </div>
          </div>

          {/* Communication Center (Collapsible) */}
          <div>
            <button
              onClick={handleCommunicationClick}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1
                ${activeSection?.startsWith('comm') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span>💬</span>
                Communication Center
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${communicationExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sub-items */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
                ${communicationExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700 pl-2">
                <button
                  onClick={() => onNavigate?.('comm-comments')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                    ${activeSection === 'comm-comments' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Ticket Comments
                </button>
                <button
                  onClick={() => onNavigate?.('comm-chat')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                    ${activeSection === 'comm-chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Chat with Support
                </button>
                <button
                  onClick={() => onNavigate?.('comm-notifications')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                    ${activeSection === 'comm-notifications' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Notifications
                </button>
              </div>
            </div>
          </div>
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
