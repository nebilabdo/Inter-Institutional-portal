const express = require("express");
const router = express.Router();
const controller = require("../controllers/requestController");

router.get("/", controller.getAllRequests);
router.post("/:id/stop-conversation", controller.stopConversation);
router.post("/:id/resume-conversation", controller.resumeConversation);
router.post("/:id/note", controller.saveAdminNote);

module.exports = router;
