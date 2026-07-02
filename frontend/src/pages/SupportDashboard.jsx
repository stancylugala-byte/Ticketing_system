import { useState } from 'react';
import Topbar from '../components/Topbar';
import StatsCards from '../components/StatsCards';
import TicketQueue from '../components/TicketQueue';
import TicketDetail from '../components/TicketDetail';
import KnowledgeBase from '../components/KnowledgeBase';
import Performance from '../components/Performance';

const TABS = [
  { key: 'queue',       label: '🎫 Ticket Queue' },
  { key: 'kb',         label: '📖 Knowledge Base' },
  { key: 'performance',label: '📊 My Performance' },
];

export default function SupportDashboard({ initialView = 'queue' }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeView, setActiveView] = useState(initialView);

  return (
    <div className="ml-[220px] min-h-screen flex flex-col bg-[#f4f6fa]">
      <Topbar onTicketSelect={(t) => { setSelectedTicket(t); setActiveView('queue'); }} />

      <main className="flex-1 flex flex-col px-6 py-5">
        {/* Stats */}
        <StatsCards />

        {/* View tabs */}
        <div className="flex gap-1 border-b-2 border-gray-200 mb-4">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveView(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] font-medium border-b-2 -mb-0.5 transition-colors
                ${activeView === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-t-lg'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Queue view */}
        {activeView === 'queue' && (
          <div className="grid grid-cols-[1fr_420px] gap-4" style={{ height: 'calc(100vh - 320px)' }}>
            <TicketQueue onSelect={setSelectedTicket} selectedId={selectedTicket?.id} />
            <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onUpdate={() => {}} />
          </div>
        )}

        {/* KB view */}
        {activeView === 'kb' && (
          <div style={{ height: 'calc(100vh - 280px)' }}>
            <KnowledgeBase />
          </div>
        )}

        {/* Performance view */}
        {activeView === 'performance' && <Performance />}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between text-xs text-gray-400">
        <span>© 2024 SupportDesk. All rights reserved.</span>
        <div className="flex gap-5">
          {['Terms', 'Privacy', 'SLA Policy'].map(l => (
            <a key={l} href="#" className="hover:text-blue-600 transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
