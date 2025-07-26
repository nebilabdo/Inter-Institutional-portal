// routes/notifications.js
const express = require("express");
const notificationsController = require("../controllers/notificationsController");

const router = express.Router({ mergeParams: true });

router.get("/", notificationsController.getNotificationsByRequestId);
router.post("/", notificationsController.addNotification);

const readRouter = express.Router();
readRouter.post("/:notificationId/read", notificationsController.markAsRead);

module.exports = {
  requestNotificationsRouter: router,
  readRouter: readRouter,
};
