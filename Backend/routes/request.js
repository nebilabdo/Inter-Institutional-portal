const express = require("express");
const router = express.Router();
const controller = require("../controllers/requestController");

const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, controller.submitRequest);
router.get("/", controller.getAllRequests);
router.get("/notifications", controller.getNotifications);
router.post("/:id/stop-conversation", controller.stopConversation);
router.post("/:id/resume-conversation", controller.resumeConversation);
router.post("/:id/note", controller.saveAdminNote);
router.get("/institutions", controller.getInstitutions);
router.post("/:id/approve", controller.approveRequest);
router.post("/:id/reject", controller.rejectRequest);
router.get("/submitted", controller.getSubmitted);
router.get("/history", controller.getHistory);
router.post("/:id/request-more-info", controller.requestMoreInfo);

module.exports = router;
