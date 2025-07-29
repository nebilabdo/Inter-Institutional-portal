const express = require("express");
const notificationsController = require("../controllers/notificationsController");

const router = express.Router({ mergeParams: true });

// GET and POST notifications for a request
router.get("/", notificationsController.getNotificationsByRequestId);
router.post("/", notificationsController.addNotification);
router.get("/", notificationsController.getAllNotifications);

// Separate router for marking as read
const readRouter = express.Router();
readRouter.patch("/:notificationId/read", notificationsController.markAsRead);
readRouter.delete(
  "/:notificationId",
  notificationsController.deleteNotification
);

module.exports = {
  requestNotificationsRouter: router,
  readRouter: readRouter,
};
