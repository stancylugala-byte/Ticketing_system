import { useState } from 'react';

// Mock ticket data
const MOCK_TICKETS = [
  {
    id: 'TK-1001',
    subject: 'Login button not responding',
    priority: 'High',
    status: 'In Progress',
    lastUpdated: '2 hours ago',
    progress: 2,
    statusMessage: 'Waiting on development team since Jul 10',
    assignedTo: 'Sarah Johnson',
    estimatedResolution: '2 hours'
  },
  {
    id: 'TK-1002',
    subject: 'Cannot upload profile picture',
    priority: 'Medium',
    status: 'Pending',
    lastUpdated: '1 day ago',
    progress: 2,
    statusMessage: 'Awaiting client response since Jul 9',
    assignedTo: 'Michael Chen',
    estimatedResolution: 'Waiting on you'
  },
  {
    id: 'TK-1003',
    subject: 'Payment processing error',
    priority: 'Critical',
    status: 'Resolved',
    lastUpdated: '3 days ago',
    progress: 3,
    statusMessage: 'Issue resolved and verified on Jul 7',
    assignedTo: 'Emily Rodriguez',
    estimatedResolution: 'Completed'
  },
  {
    id: 'TK-1004',
    subject: 'Dashboard loading slowly',
    priority: 'Low',
    status: 'Open',
    lastUpdated: '5 days ago',
    progress: 0,
    statusMessage: 'Ticket created on Jul 5',
    assignedTo: 'Unassigned',
    estimatedResolution: '24 hours'
  },
  {
    id: 'TK-1005',
    subject: 'Email notifications not working',
    priority: 'High',
    status: 'In Progress',
    lastUpdated: '4 hours ago',
    progress: 1,
    statusMessage: 'Under investigation by support team',
    assignedTo: 'David Kim',
    estimatedResolution: '4 hours'
  }
];

const STAGES = [
  { key: 'open', label: 'Open', icon: '📋' },
  { key: 'in_progress', label: 'In Progress', icon: '⚙️' },
  { key: 'pending', label: 'Pending', icon: '⏳' },
  { key: 'resolved', label: 'Resolved', icon: '✅' },
  { key: 'closed', label: 'Closed', icon: '🔒' }
];

const PRIORITY_STYLES = {
  Critical: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-white', border: 'border-red-600', glow: 'shadow-red-200' },
  High: { bg: 'bg-gradient-to-r from-orange-500 to-orange-600', text: 'text-white', border: 'border-orange-600', glow: 'shadow-orange-200' },
  Medium: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500', text: 'text-gray-900 dark:text-white', border: 'border-yellow-500', glow: 'shadow-yellow-200' },
  Low: { bg: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'text-white', border: 'border-gray-500', glow: 'shadow-gray-200' }
};

export default function TrackStatus() {
  const [filter, setFilter] = useState('All');
  const [expandedTicket, setExpandedTicket] = useState(null);

  const filteredTickets = filter === 'All'
    ? MOCK_TICKETS
    : MOCK_TICKETS.filter(t => t.status === filter);

  const getTicketCount = (status) => {
    if (status === 'All') return MOCK_TICKETS.length;
    return MOCK_TICKETS.filter(t => t.status === status).length;
  };

  const toggleExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Gradient */}
      <div className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800 opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white dark:bg-slate-800 opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 bg-opacity-20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                📊
              </div>
              <h2 className="text-3xl font-bold text-white">Track Status</h2>
            </div>
            <p className="text-blue-100 text-sm ml-15">Monitor the real-time progress of your support tickets with visual indicators</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Tabs */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-3 mb-8">
        <div className="flex gap-2 overflow-x-auto">
          {['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'].map(tab => {
            const count = getTicketCount(tab);
            const isActive = filter === tab;
            
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 hover:scale-102'
                  }`}
              >
                <span className="relative z-10">{tab}</span>
                {count > 0 && (
                  <span className={`ml-2 px-2.5 py-0.5 text-xs font-bold rounded-full
                    ${isActive ? 'bg-white dark:bg-slate-800 text-blue-600' : 'bg-gray-200 text-gray-700 dark:text-slate-200'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets List with Enhanced Design */}
      <div className="space-y-5">
        {filteredTickets.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl shadow-sm p-16 text-center">
            <div className="text-7xl mb-4 opacity-50">🎫</div>
            <p className="text-xl text-gray-600 dark:text-slate-300 font-semibold mb-2">No tickets found</p>
            <p className="text-sm text-gray-400 dark:text-slate-500">Try adjusting your filter to see more results</p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const priorityStyle = PRIORITY_STYLES[ticket.priority];
            const isExpanded = expandedTicket === ticket.id;
            
            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden group"
              >
                {/* Ticket Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(ticket.id)}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-xs font-mono font-bold rounded-lg">
                          {ticket.id}
                        </span>
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${priorityStyle.bg} ${priorityStyle.text} shadow-lg ${priorityStyle.glow}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Updated {ticket.lastUpdated}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {ticket.assignedTo}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors">
                      <svg
                        className={`w-6 h-6 text-gray-400 dark:text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Enhanced Progress Stepper */}
                  <div className="relative mt-6">
                    {/* Progress Bar Background */}
                    <div className="absolute top-6 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" style={{ zIndex: 0 }}></div>
                    
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute top-6 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 shadow-lg shadow-blue-200" 
                      style={{ 
                        width: `${(ticket.progress / (STAGES.length - 1)) * 100}%`,
                        zIndex: 1
                      }}
                    ></div>
                    
                    <div className="flex items-center justify-between relative" style={{ zIndex: 2 }}>
                      {STAGES.map((stage, index) => {
                        const isCompleted = index < ticket.progress;
                        const isCurrent = index === ticket.progress;

                        return (
                          <div key={stage.key} className="flex flex-col items-center group/step">
                            {/* Step Circle with Icon */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 transform
                                ${isCompleted
                                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-110'
                                  : isCurrent
                                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-4 ring-blue-200 shadow-xl scale-110 animate-pulse'
                                  : 'bg-white dark:bg-slate-800 border-2 border-gray-300 text-gray-400 dark:text-slate-500 group-hover/step:border-gray-400'
                                }`}
                            >
                              {isCompleted ? '✓' : stage.icon}
                            </div>
                            
                            {/* Step Label */}
                            <span
                              className={`text-xs font-semibold mt-2 text-center whitespace-nowrap transition-colors
                                ${isCurrent 
                                  ? 'text-blue-600' 
                                  : isCompleted 
                                  ? 'text-green-600' 
                                  : 'text-gray-400 dark:text-slate-500'}`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expanded Details with Animation */}
                {isExpanded && (
                  <div className="border-t-2 border-gray-100 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-indigo-50 animate-fadeIn">
                    <div className="p-6 space-y-4">
                      {/* Status Message */}
                      <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-blue-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl shrink-0">
                          ℹ️
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Current Status Update</p>
                          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{ticket.statusMessage}</p>
                        </div>
                      </div>

                      {/* Additional Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1">Assigned Agent</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{ticket.assignedTo}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1">Est. Resolution</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{ticket.estimatedResolution}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 hover:shadow-xl">
                          View Details
                        </button>
                        <button className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold text-sm rounded-xl hover:border-gray-300 hover:bg-gray-50 dark:bg-slate-900 transition-all">
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
