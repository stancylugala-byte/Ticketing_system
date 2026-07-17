const db = require('../models');
const { Notification } = db;

// ── Create a notification (fire-and-forget — never throws) ───────────────────
const createNotification = async ({ userId, title, message, type = 'info', link = null }) => {
  try {
    await Notification.create({ user_id: userId, title, message, type, link });
  } catch (err) {
    // Notifications are non-critical — log but don't crash the request
    console.error('[Notification] failed to create:', err.message);
  }
};

const getNotifications = async (userId) => {
  return Notification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 30,
  });
};

const markAsRead = async (notificationId, userId) => {
  const notif = await Notification.findOne({
    where: { notification_id: notificationId, user_id: userId },
  });
  if (!notif) { const e = new Error('Notification not found'); e.status = 404; throw e; }
  await notif.update({ is_read: true });
  return notif;
};

const markAllRead = async (userId) => {
  await Notification.update({ is_read: true }, { where: { user_id: userId } });
};

const getUnreadCount = async (userId) => {
  return Notification.count({ where: { user_id: userId, is_read: false } });
};

module.exports = { createNotification, getNotifications, markAsRead, markAllRead, getUnreadCount };
