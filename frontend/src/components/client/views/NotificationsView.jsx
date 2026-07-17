import { useEffect, useState } from 'react';
import { getNotifications, markNotifRead, markAllNotifsRead } from '../../../api/clientApi';

function timeAgo(d) {
  if (!d) return '';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

export default function NotificationsView({ onRefresh }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [loading, setLoading]             = useState(true);

  const load = () => {
    getNotifications().then(r => {
      const data = r.data.data;
      setNotifications(data.notifications || []);
      setUnread(data.unreadCount || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    await markNotifRead(id).catch(() => {});
    load(); onRefresh?.();
  };

  const handleReadAll = async () => {
    await markAllNotifsRead().catch(() => {});
    load(); onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Stay updated on your ticket activity.</p>
        </div>
        {unread > 0 && (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg">{unread} unread</span>
            <button onClick={handleReadAll} className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Mark all read
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}</div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400 gap-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <span className="text-3xl">🔔</span><p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map(n => (
            <div key={n.notification_id}
              onClick={() => !n.is_read && handleRead(n.notification_id)}
              className={`flex items-start gap-4 px-5 py-4 rounded-xl border transition-all cursor-pointer
                ${!n.is_read
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${!n.is_read ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-slate-700'}`}>
                🔔
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.is_read ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'}`}>{n.title}</p>
                  {!n.is_read && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1.5">{timeAgo(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

