const priorityStyles = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
};

const statusStyles = {
  'Open': 'border border-blue-400 text-blue-600',
  'In Progress': 'bg-orange-500 text-white',
  'Pending': 'bg-gray-200 text-gray-700 dark:text-slate-200',
  'Resolved': 'bg-green-100 text-green-700',
  'Closed': 'bg-slate-700 text-white',
};

function timeAgo(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RecentTicketsTable({ tickets, onViewDetails }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-lg font-semibold text-gray-600 dark:text-slate-300 mb-2">No tickets yet</p>
        <p className="text-sm text-gray-400 dark:text-slate-500">Create your first support ticket to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Table header with actions */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tickets</h3>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Filters
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Subject & Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-blue-600">
                    #{ticket.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.title}</p>
                    {ticket.category && (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {ticket.category.category_name}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-slate-300">
                    {timeAgo(ticket.updated_at || ticket.updatedAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(ticket.id)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View Details ›
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
