import { useState } from 'react';

// Mock tickets for dropdown
const MOCK_TICKETS = [
  { id: 'TK-1001', subject: 'Login button not responding', status: 'In Progress' },
  { id: 'TK-1002', subject: 'Cannot upload profile picture', status: 'Pending' },
  { id: 'TK-1003', subject: 'Payment processing error', status: 'Resolved' },
  { id: 'TK-1004', subject: 'Feature request: Dark mode', status: 'Open' },
  { id: 'TK-1005', subject: 'Email notifications not working', status: 'In Progress' }
];

// Mock timeline events per ticket
const TIMELINES = {
  'TK-1001': [
    {
      event: 'Update from Agent',
      description: 'Testing different browser scenarios to reproduce the issue',
      timestamp: 'Jul 10, 2024 at 4:15 PM',
      type: 'update',
      agent: 'Sarah Johnson'
    },
    {
      event: 'In Review',
      description: 'Agent began investigating the reported issue',
      timestamp: 'Jul 10, 2024 at 3:00 PM',
      type: 'progress',
      agent: 'Sarah Johnson'
    },
    {
      event: 'Assigned to Agent',
      description: 'Ticket assigned to Sarah Johnson (Senior Support Engineer)',
      timestamp: 'Jul 10, 2024 at 2:45 PM',
      type: 'assigned',
      agent: 'Sarah Johnson'
    },
    {
      event: 'Ticket Created',
      description: 'Client reported login button not responding',
      timestamp: 'Jul 10, 2024 at 2:30 PM',
      type: 'created',
      agent: null
    }
  ],
  'TK-1002': [
    {
      event: 'In Review',
      description: 'Agent analyzing the provided file details',
      timestamp: 'Jul 9, 2024 at 2:15 PM',
      type: 'progress',
      agent: 'Michael Chen'
    },
    {
      event: 'Client Response Received',
      description: 'Client provided requested information about the file',
      timestamp: 'Jul 9, 2024 at 2:00 PM',
      type: 'update',
      agent: null
    },
    {
      event: 'Awaiting Client Info',
      description: 'Agent requested file format and size details from client',
      timestamp: 'Jul 9, 2024 at 11:30 AM',
      type: 'waiting',
      agent: 'Michael Chen'
    },
    {
      event: 'Assigned to Agent',
      description: 'Ticket assigned to Michael Chen (Support Specialist)',
      timestamp: 'Jul 9, 2024 at 10:20 AM',
      type: 'assigned',
      agent: 'Michael Chen'
    },
    {
      event: 'Ticket Created',
      description: 'Client reported issue uploading profile picture',
      timestamp: 'Jul 9, 2024 at 10:00 AM',
      type: 'created',
      agent: null
    }
  ],
  'TK-1003': [
    {
      event: 'Resolved',
      description: 'Issue resolved and verified with test transactions',
      timestamp: 'Jul 7, 2024 at 4:00 PM',
      type: 'resolved',
      agent: 'Emily Rodriguez'
    },
    {
      event: 'Testing Complete',
      description: 'Agent verified fix in production environment',
      timestamp: 'Jul 7, 2024 at 3:30 PM',
      type: 'progress',
      agent: 'Emily Rodriguez'
    },
    {
      event: 'Fix Deployed',
      description: 'Hotfix applied to payment processing module',
      timestamp: 'Jul 7, 2024 at 2:00 PM',
      type: 'update',
      agent: 'Emily Rodriguez'
    },
    {
      event: 'In Review',
      description: 'Agent investigating payment gateway integration',
      timestamp: 'Jul 7, 2024 at 9:30 AM',
      type: 'progress',
      agent: 'Emily Rodriguez'
    },
    {
      event: 'Assigned to Agent',
      description: 'Ticket assigned to Emily Rodriguez (Senior Support Engineer)',
      timestamp: 'Jul 7, 2024 at 9:10 AM',
      type: 'assigned',
      agent: 'Emily Rodriguez'
    },
    {
      event: 'Escalated',
      description: 'Ticket escalated to priority queue due to critical severity',
      timestamp: 'Jul 7, 2024 at 9:05 AM',
      type: 'escalated',
      agent: null
    },
    {
      event: 'Ticket Created',
      description: 'Critical: Payment processing error reported',
      timestamp: 'Jul 7, 2024 at 9:00 AM',
      type: 'created',
      agent: null
    }
  ],
  'TK-1004': [
    {
      event: 'Awaiting Triage',
      description: 'Ticket in queue for product team review',
      timestamp: 'Jul 5, 2024 at 11:05 AM',
      type: 'waiting',
      agent: null
    },
    {
      event: 'Ticket Created',
      description: 'Feature request: Add dark mode support',
      timestamp: 'Jul 5, 2024 at 11:00 AM',
      type: 'created',
      agent: null
    }
  ],
  'TK-1005': [
    {
      event: 'Testing Fix',
      description: 'Testing notification fix in development environment',
      timestamp: 'Jul 10, 2024 at 12:00 PM',
      type: 'update',
      agent: 'David Kim'
    },
    {
      event: 'In Review',
      description: 'Agent checking email service configuration',
      timestamp: 'Jul 10, 2024 at 8:30 AM',
      type: 'progress',
      agent: 'David Kim'
    },
    {
      event: 'Assigned to Agent',
      description: 'Ticket assigned to David Kim (Technical Support Lead)',
      timestamp: 'Jul 10, 2024 at 8:15 AM',
      type: 'assigned',
      agent: 'David Kim'
    },
    {
      event: 'Ticket Created',
      description: 'Email notifications not being received',
      timestamp: 'Jul 10, 2024 at 8:00 AM',
      type: 'created',
      agent: null
    }
  ]
};

const EVENT_CONFIG = {
  created: { icon: '🎫', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  assigned: { icon: '👤', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  progress: { icon: '⚙️', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  update: { icon: '💬', color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
  waiting: { icon: '⏱️', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  escalated: { icon: '🚨', color: 'from-red-500 to-red-600', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  resolved: { icon: '✅', color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }
};

export default function ViewResolutionTimeline() {
  const [selectedTicket, setSelectedTicket] = useState('TK-1001');

  const timeline = TIMELINES[selectedTicket] || [];
  const currentTicket = MOCK_TICKETS.find(t => t.id === selectedTicket);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with Gradient */}
      <div className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl shadow-xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                📜
              </div>
              <h2 className="text-3xl font-bold text-white">Resolution Timeline</h2>
            </div>
            <p className="text-indigo-100 text-sm ml-15">View the complete history and progress of your ticket resolution</p>
          </div>
        </div>
      </div>

      {/* Ticket Selector */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Select Ticket to View Timeline
        </label>
        <select
          value={selectedTicket}
          onChange={(e) => setSelectedTicket(e.target.value)}
          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer"
        >
          {MOCK_TICKETS.map(ticket => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.id} - {ticket.subject} ({ticket.status})
            </option>
          ))}
        </select>
      </div>

      {/* Timeline Container */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Ticket Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-gray-200">
          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-indigo-200 border border-indigo-300 text-indigo-700 text-xs font-mono font-bold rounded-lg mb-3">
            {currentTicket?.id}
          </span>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {currentTicket?.subject}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            {timeline.length} timeline events
          </p>
        </div>

        {/* Timeline Events */}
        <div className="p-8">
          {timeline.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4 opacity-50">📋</div>
              <p className="text-xl text-gray-600 font-semibold mb-2">No timeline events found</p>
              <p className="text-sm text-gray-400">This ticket doesn't have any recorded history yet</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-200"></div>

              {/* Timeline Events (Most Recent First) */}
              <div className="space-y-8">
                {timeline.map((event, index) => {
                  const config = EVENT_CONFIG[event.type];
                  const isFirst = index === 0;

                  return (
                    <div key={index} className="relative flex gap-6 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                      {/* Event Icon */}
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-2xl shadow-xl border-4 border-white transform transition-transform hover:scale-110 ${isFirst ? 'ring-4 ring-indigo-200 animate-pulse' : ''}`}>
                          {config.icon}
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 pb-4">
                        <div className={`${config.bg} ${config.border} border-2 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow`}>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h4 className={`text-base font-bold ${config.text}`}>
                              {event.event}
                            </h4>
                            {isFirst && (
                              <span className="px-3 py-1 bg-white border-2 border-indigo-300 text-indigo-700 text-xs font-bold rounded-lg whitespace-nowrap shadow-sm">
                                Latest
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-4">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.timestamp}
                            </span>
                            {event.agent && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {event.agent}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl shadow-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shrink-0 shadow-lg">
            ℹ️
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-indigo-900 mb-2">
              Understanding Your Timeline
            </h4>
            <p className="text-sm text-indigo-800 leading-relaxed">
              Events are displayed in reverse chronological order (most recent at the top). Each update represents a significant milestone in your ticket's resolution journey. You'll receive email notifications for major status changes and updates from your assigned agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
