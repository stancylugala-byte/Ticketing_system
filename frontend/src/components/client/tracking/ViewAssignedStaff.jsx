// Mock ticket data with assigned staff
const MOCK_TICKETS_WITH_STAFF = [
  {
    id: 'TK-1001',
    subject: 'Login button not responding',
    priority: 'High',
    status: 'In Progress',
    agent: {
      name: 'Sarah Johnson',
      role: 'Senior Support Engineer',
      initials: 'SJ',
      color: 'from-blue-500 to-blue-600',
      availability: 'Online',
      responseTime: '< 30 min'
    }
  },
  {
    id: 'TK-1002',
    subject: 'Cannot upload profile picture',
    priority: 'Medium',
    status: 'Pending',
    agent: {
      name: 'Michael Chen',
      role: 'Support Specialist',
      initials: 'MC',
      color: 'from-purple-500 to-purple-600',
      availability: 'Online',
      responseTime: '< 1 hour'
    }
  },
  {
    id: 'TK-1003',
    subject: 'Payment processing error',
    priority: 'Critical',
    status: 'Resolved',
    agent: {
      name: 'Emily Rodriguez',
      role: 'Senior Support Engineer',
      initials: 'ER',
      color: 'from-pink-500 to-pink-600',
      availability: 'Away',
      responseTime: '< 30 min'
    }
  },
  {
    id: 'TK-1004',
    subject: 'Feature request: Dark mode',
    priority: 'Low',
    status: 'Open',
    agent: null // Unassigned
  },
  {
    id: 'TK-1005',
    subject: 'Email notifications not working',
    priority: 'High',
    status: 'In Progress',
    agent: {
      name: 'David Kim',
      role: 'Technical Support Lead',
      initials: 'DK',
      color: 'from-green-500 to-green-600',
      availability: 'Online',
      responseTime: '< 15 min'
    }
  }
];

const PRIORITY_STYLES = {
  Critical: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-white' },
  High: { bg: 'bg-gradient-to-r from-orange-500 to-orange-600', text: 'text-white' },
  Medium: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500', text: 'text-gray-900 dark:text-white' },
  Low: { bg: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'text-white' }
};

const STATUS_STYLES = {
  'In Progress': { bg: 'bg-orange-500', text: 'text-white' },
  'Pending': { bg: 'bg-gray-200', text: 'text-gray-700 dark:text-slate-200' },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-700' },
  'Open': { border: 'border border-blue-400', text: 'text-blue-600' }
};

export default function ViewAssignedStaff() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Gradient */}
      <div className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl shadow-xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800 opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white dark:bg-slate-800 opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 bg-opacity-20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                👥
              </div>
              <h2 className="text-3xl font-bold text-white">View Assigned Staff</h2>
            </div>
            <p className="text-purple-100 text-sm ml-15">Connect with the dedicated support agents handling your tickets</p>
          </div>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TICKETS_WITH_STAFF.map(ticket => {
          const priorityStyle = PRIORITY_STYLES[ticket.priority];
          const statusStyle = STATUS_STYLES[ticket.status] || {};
          
          return (
            <div
              key={ticket.id}
              className="bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-2xl hover:border-purple-200 transition-all duration-300 overflow-hidden group"
            >
              {/* Ticket Header */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b-2 border-gray-100 dark:border-slate-700">
                <div className="flex items-start gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-xs font-mono font-bold rounded-lg">
                    {ticket.id}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${priorityStyle.bg} ${priorityStyle.text} shadow-md`}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {ticket.subject}
                </h3>
                <span className={`inline-block mt-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border || ''}`}>
                  {ticket.status}
                </span>
              </div>

              {/* Agent Info or Unassigned State */}
              {ticket.agent ? (
                <div className="p-6 space-y-5">
                  {/* Agent Profile Card */}
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      {/* Avatar with Gradient */}
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br ${ticket.agent.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform`}>
                          {ticket.agent.initials}
                        </div>
                        {/* Availability Badge */}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-sm
                          ${ticket.agent.availability === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}>
                        </div>
                      </div>

                      {/* Agent Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                          {ticket.agent.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-slate-300 mb-2">
                          {ticket.agent.role}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 text-xs font-semibold
                            ${ticket.agent.availability === 'Online' ? 'text-green-600' : 'text-gray-500 dark:text-slate-400'}`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {ticket.agent.availability}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-slate-500">•</span>
                          <span className="text-xs text-gray-600 dark:text-slate-300">
                            Resp: {ticket.agent.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-200 hover:shadow-xl flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message Agent
                    </button>
                    <button className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold text-sm rounded-xl hover:border-gray-300 hover:bg-gray-50 dark:bg-slate-900 transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  {/* Unassigned State */}
                  <div className="py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <svg className="w-10 h-10 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-base font-bold text-gray-700 dark:text-slate-200 mb-2">
                      Unassigned
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                      Awaiting agent assignment
                    </p>
                    <div className="mt-5 px-4 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 text-lg shrink-0">⏱️</span>
                        <p className="text-xs text-yellow-900 font-medium leading-relaxed">
                          Your ticket is in the queue. An agent will be assigned within 24 hours based on priority and availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl shadow-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shrink-0 shadow-lg">
            💡
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-purple-900 mb-2">
              Need to reach your assigned agent?
            </h4>
            <p className="text-sm text-purple-800 leading-relaxed">
              Click "Message Agent" to send a direct message through the Communication Center. 
              Our agents prioritize responses based on ticket urgency and are committed to resolving your issues promptly. 
              Average response times are displayed on each agent card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
