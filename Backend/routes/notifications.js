const express = require("express");
const notificationsController = require("../controllers/notificationsController");
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

// // Routes for request notifications
// router.get("/", notificationsController.getNotificationsByRequestId);
// router.post("/", notificationsController.addNotification);
// router.get("/all", notificationsController.getAllNotifications);

router.get("/", authMiddleware, requestController.getNotifications);
// Routes for marking read and deleting notifications
router.patch("/:notificationId/read", notificationsController.markAsRead);
router.delete("/:notificationId", notificationsController.deleteNotification);
router.patch("/mark-all-read", notificationsController.markAllAsRead);

module.exports = router;
