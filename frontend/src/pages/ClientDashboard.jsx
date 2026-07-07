import { useState, useEffect } from 'react';
import ClientSidebar from '../components/client/ClientSidebar';
import ClientStatsCards from '../components/client/ClientStatsCards';
import RecentTicketsTable from '../components/client/RecentTicketsTable';
import NewTicketModal from '../components/client/NewTicketModal';
import TicketDetailDrawer from '../components/client/TicketDetailDrawer';
import KnowledgeBaseCard from '../components/client/KnowledgeBaseCard';
import LiveSupportCard from '../components/client/LiveSupportCard';
import TrackStatus from '../components/client/tracking/TrackStatus';
import ViewAssignedStaff from '../components/client/tracking/ViewAssignedStaff';
import ViewResolutionTimeline from '../components/client/tracking/ViewResolutionTimeline';
import TicketComments from '../components/client/communication/TicketComments';
import ChatWithSupport from '../components/client/communication/ChatWithSupport';
import Notifications from '../components/client/communication/Notifications';
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
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (activeSection === 'dashboard') {
      loadDashboardData();
    }
  }, [activeSection]);

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

  const handleNavigate = (section) => {
    setActiveSection(section);
    setSelectedTicketId(null); // Close ticket drawer when navigating
  };

  // Render content based on active section
  const renderContent = () => {
    if (activeSection === 'tracking-status') {
      return (
        <div className="animate-fadeIn">
          <TrackStatus />
        </div>
      );
    }

    if (activeSection === 'tracking-staff') {
      return (
        <div className="animate-fadeIn">
          <ViewAssignedStaff />
        </div>
      );
    }

    if (activeSection === 'tracking-timeline') {
      return (
        <div className="animate-fadeIn">
          <ViewResolutionTimeline />
        </div>
      );
    }

    if (activeSection === 'comm-comments') {
      return (
        <div className="animate-fadeIn h-[calc(100vh-200px)]">
          <TicketComments />
        </div>
      );
    }

    if (activeSection === 'comm-chat') {
      return (
        <div className="animate-fadeIn h-[calc(100vh-200px)]">
          <ChatWithSupport />
        </div>
      );
    }

    if (activeSection === 'comm-notifications') {
      return (
        <div className="animate-fadeIn h-[calc(100vh-200px)]">
          <Notifications />
        </div>
      );
    }

    // Default dashboard view
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fadeIn">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 mb-6 rounded-xl shadow-sm">
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

        {/* Stats Cards */}
        {stats && <ClientStatsCards stats={stats} />}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <ClientSidebar 
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div className="ml-64 min-h-screen flex flex-col">
        <main className="flex-1 p-6">
          {renderContent()}
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
