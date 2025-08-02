const express = require("express");
const router = express.Router();
const controller = require("../controllers/requestController");

const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, controller.submitRequest);

router.post("/:id/stop-conversation", controller.stopConversation);
router.post("/:id/resume-conversation", controller.resumeConversation);
router.post("/:id/note", controller.saveAdminNote);
router.get("/institutions", controller.getInstitutions);

module.exports = router;
