const express = require("express");
const notificationsController = require("../controllers/notificationsController"); // singular
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

// Request notifications
router.get("/", authMiddleware, requestController.getNotifications);

// Notifications actions
router.patch("/:notificationId/read", notificationsController.markAsRead);
router.patch("/:notificationId/unread", notificationsController.markAsUnread);

router.delete("/:notificationId", notificationsController.deleteNotification);
router.patch("/mark-all-read", notificationsController.markAllAsRead);

// My notifications
router.get(
  "/my-notifications",
  authMiddleware,
  notificationsController.getMyNotifications
);

module.exports = router;
