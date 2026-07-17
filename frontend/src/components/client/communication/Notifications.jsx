import { useState } from 'react';

// Mock notifications
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'status_change',
    title: 'Ticket #1003 status changed to Resolved',
    message: 'Your payment processing error ticket has been marked as resolved.',
    timestamp: '2 hours ago',
    isRead: false,
    icon: '✅',
    iconColor: 'bg-green-100 text-green-600'
  },
  {
    id: 2,
    type: 'new_reply',
    title: 'New reply on Ticket #1001',
    message: 'Sarah Johnson replied: "I\'ve identified the issue. It\'s related to a recent deployment..."',
    timestamp: '3 hours ago',
    isRead: false,
    icon: '💬',
    iconColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    type: 'assignment',
    title: 'Agent assigned to Ticket #1005',
    message: 'David Kim (Technical Support Lead) has been assigned to your ticket.',
    timestamp: '5 hours ago',
    isRead: false,
    icon: '👤',
    iconColor: 'bg-purple-100 text-purple-600'
  },
  {
    id: 4,
    type: 'status_change',
    title: 'Ticket #1002 status changed to Pending',
    message: 'Your ticket is awaiting additional information from you.',
    timestamp: '1 day ago',
    isRead: true,
    icon: '⏳',
    iconColor: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 5,
    type: 'new_reply',
    title: 'New reply on Ticket #1002',
    message: 'Michael Chen replied: "What file format and size is the image you\'re trying to upload?"',
    timestamp: '1 day ago',
    isRead: true,
    icon: '💬',
    iconColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: 6,
    type: 'priority_change',
    title: 'Ticket #1003 priority escalated',
    message: 'Your ticket has been escalated to Critical priority for faster resolution.',
    timestamp: '3 days ago',
    isRead: true,
    icon: '🚨',
    iconColor: 'bg-red-100 text-red-600'
  },
  {
    id: 7,
    type: 'assignment',
    title: 'Agent assigned to Ticket #1001',
    message: 'Sarah Johnson (Senior Support Engineer) has been assigned to your ticket.',
    timestamp: '4 days ago',
    isRead: true,
    icon: '👤',
    iconColor: 'bg-purple-100 text-purple-600'
  }
];

function groupNotifications(notifications) {
  const now = new Date();
  const today = [];
  const earlier = [];

  notifications.forEach(notification => {
    // Simple grouping - in real app would parse timestamps
    if (notification.timestamp.includes('hour')) {
      today.push(notification);
    } else {
      earlier.push(notification);
    }
  });

  return { today, earlier };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const { today, earlier } = groupNotifications(notifications);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const NotificationItem = ({ notification }) => (
    <div
      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
      className={`group cursor-pointer transition-all duration-300
        ${!notification.isRead ? 'mb-5' : 'mb-4'}`}
    >
      <div className={`relative bg-white dark:bg-slate-800 border-2 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden
        ${!notification.isRead 
          ? 'border-blue-300 hover:border-blue-400' 
          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'}`}
      >
        {/* Unread indicator stripe */}
        {!notification.isRead && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
        )}

        <div className="p-6">
          <div className="flex gap-5">
            {/* Icon Circle */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all ${notification.iconColor}`}>
              {notification.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className={`text-base font-bold leading-tight ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-200'}`}>
                  {notification.title}
                </h4>
                {!notification.isRead && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                      NEW
                    </span>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {notification.timestamp}
                </span>
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all pointer-events-none"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl p-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white dark:bg-slate-800 opacity-5 rounded-full -mr-24 -mt-24"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 bg-opacity-20 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm">
                  🔔
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Notifications</h2>
                  <p className="text-cyan-100 text-xs">Stay updated on your ticket activity and important updates</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <div className="flex flex-col items-end gap-2">
                  <span className="px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 text-base font-bold rounded-xl shadow-lg">
                    {unreadCount} unread
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-1.5 bg-white dark:bg-slate-800 bg-opacity-20 hover:bg-opacity-30 text-white text-xs font-semibold rounded-lg transition-all backdrop-blur-sm border border-white border-opacity-30"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List - Maximum Space */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-lg">
              🔔
            </div>
            <p className="text-xl font-bold text-gray-600 dark:text-slate-300 mb-2">No notifications</p>
            <p className="text-sm text-gray-400 dark:text-slate-500">You're all caught up! Check back later for updates</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            {/* Today */}
            {today.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4 sticky top-0 bg-gradient-to-r from-gray-50 to-white py-2 z-10">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Today</h3>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                </div>
                <div className="space-y-0">
                  {today.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier */}
            {earlier.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 sticky top-0 bg-gradient-to-r from-gray-50 to-white py-2 z-10">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Earlier</h3>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                <div className="space-y-0">
                  {earlier.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Banner - Compact */}
      <div className="mt-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-xl shrink-0 shadow-lg">
            ⚙️
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-cyan-900 mb-1">
              Notification Preferences
            </h4>
            <p className="text-xs text-cyan-800 leading-relaxed mb-2">
              Manage how and when you receive notifications to stay informed about your support tickets.
            </p>
            <button className="text-xs text-cyan-700 hover:text-cyan-800 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Go to Settings
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
