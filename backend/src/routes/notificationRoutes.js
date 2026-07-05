const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', notifController.getNotifications);
router.get('/unread-count', notifController.getUnreadCount);
// mark-all-read MUST come before /:id/read to avoid Express matching "mark-all-read" as an id
router.patch('/mark-all-read', notifController.markAllRead);
router.patch('/:id/read', notifController.markAsRead);

module.exports = router;
