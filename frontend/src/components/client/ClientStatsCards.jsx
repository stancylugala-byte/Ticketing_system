export default function ClientStatsCards({ stats }) {
  const cards = [
    {
      value: stats?.totalTickets ?? '—',
      label: 'Total Tickets',
      sublabel: 'Lifetime support requests',
      icon: '🎫',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600'
    },
    {
      value: stats?.openTickets ?? '—',
      label: 'Active Issues',
      sublabel: 'Currently being handled',
      icon: '🔧',
      iconBg: 'bg-orange-50',
      iconText: 'text-orange-600'
    },
    {
      value: stats?.pendingTickets ?? '—',
      label: 'Pending',
      sublabel: 'Awaiting response',
      icon: '⏳',
      iconBg: 'bg-yellow-50',
      iconText: 'text-yellow-600'
    },
    {
      value: stats?.resolvedTickets ?? '—',
      label: 'Resolved',
      sublabel: 'Successfully closed',
      icon: '✅',
      iconBg: 'bg-green-50',
      iconText: 'text-green-600'
    }
  ];

  // Show loading skeleton if stats is null
  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl border border-gray-100 p-5 h-24 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center text-xl ${card.iconText}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-xs text-gray-400">{card.sublabel}</p>
        </div>
      ))}
    </div>
  );
}
