const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");
const notificationController = require("../controllers/notificationsController");
const authMiddleware = require("../middlewares/auth");

// Basic CRUD for providers
router.get("/", providerController.getAllProviders);
router.get("/:id", providerController.getProviderById);
router.post("/", providerController.createProvider);
router.put("/:id", providerController.updateProvider);
router.delete("/:id", providerController.deleteProvider);

// Mark notification as read (assuming notificationController.markAsRead exists)
router.post("/:id/read", notificationController.markAsRead);

// Get notifications for the authenticated user's institution
router.get(
  "/notifications/my",
  authMiddleware,
  providerController.getNotificationsForMyInstitution
);

// If you want notifications by provider later, implement this method first
// router.get("/:institutionId/notifications", providerController.getNotificationsByProvider);

module.exports = router;
