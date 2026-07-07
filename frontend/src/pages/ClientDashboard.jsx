import { useState, useEffect } from 'react';
import ClientSidebar from '../components/client/ClientSidebar';
import ClientStatsCards from '../components/client/ClientStatsCards';
import RecentTicketsTable from '../components/client/RecentTicketsTable';
import NewTicketModal from '../components/client/NewTicketModal';
import TicketDetailDrawer from '../components/client/TicketDetailDrawer';
import KnowledgeBaseCard from '../components/client/KnowledgeBaseCard';
import LiveSupportCard from '../components/client/LiveSupportCard';
import { getDashboardStats, getMyTickets, getNotifications } from '../api/clientApi';
import { useAuth } from '../context/AuthContext';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState({ notifications: [], unreadCount: 0 });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ticketsRes, notificationsRes] = await Promise.all([
        getDashboardStats(),
        getMyTickets({ page: 1, limit: 10 }),
        getNotifications()
      ]);

      setStats(statsRes.data.data);
      setTickets(ticketsRes.data.data.tickets || []);
      setNotifications(notificationsRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTicketSuccess = () => {
    loadDashboardData();
  };

  const handleTicketUpdate = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <ClientSidebar 
        unreadCount={notifications.unreadCount}
        onNewTicket={() => setIsNewTicketModalOpen(true)}
      />

      {/* Main Content */}
      <div className="ml-[260px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user?.full_name?.split(' ')[0] || 'there'}!</h1>
              <p className="text-sm text-gray-500 mt-1">Here's what's happening with your support tickets</p>
            </div>
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Ticket
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-5">
          {/* Stats Cards */}
          {stats && <ClientStatsCards stats={stats} />}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Tickets (spans 2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Tickets */}
              <RecentTicketsTable 
                tickets={tickets} 
                onViewDetails={(ticketId) => setSelectedTicketId(ticketId)}
              />
            </div>

            {/* Right Column - Side Cards */}
            <div className="space-y-6">
              {/* Knowledge Base Card */}
              <KnowledgeBaseCard />

              {/* Live Support Card */}
              <LiveSupportCard />
            </div>
          </div>

          {/* Ticket Detail Drawer (Conditional) */}
          {selectedTicketId && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-end p-6">
              <div className="w-full max-w-2xl h-full animate-slide-in-right">
                <TicketDetailDrawer
                  ticketId={selectedTicketId}
                  onClose={() => setSelectedTicketId(null)}
                  onUpdate={handleTicketUpdate}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>© 2024 SupportDesk Client Portal. All rights reserved.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
            </div>
          </div>
        </footer>
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSuccess={handleNewTicketSuccess}
      />
    </div>
  );
}
