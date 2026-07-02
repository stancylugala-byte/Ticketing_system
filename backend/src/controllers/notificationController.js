const notifService = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notifService.getNotifications(req.user.id);
    res.json({ success: true, data: notifications });
  } catch (err) { next(err); }
};

const markAsRead = async (req, res, next) => {
  try {
    const notif = await notifService.markAsRead(req.params.id, req.user.id);
    res.json({ success: true, data: notif });
  } catch (err) { next(err); }
};

const markAllRead = async (req, res, next) => {
  try {
    await notifService.markAllRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notifService.getUnreadCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (err) { next(err); }
};

module.exports = { getNotifications, markAsRead, markAllRead, getUnreadCount };
