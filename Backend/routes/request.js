const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");
const providerController = require("../controllers/providerController");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, requestController.submitRequest);
router.get("/", authMiddleware, providerController.getRequestsForInstitution); // only this
// router.get(
//   "/notifications",
//   authMiddleware,
//   requestController.getNotifications
// );
router.get("/my-requests", authMiddleware, requestController.getMyRequests);
router.post("/:id/stop-conversation", requestController.stopConversation);
router.post("/:id/resume-conversation", requestController.resumeConversation);
router.post("/:id/note", requestController.saveAdminNote);

router.get("/institutions", authMiddleware, requestController.getInstitutions);

router.post("/:id/approve", requestController.approveRequest);
router.post("/:id/reject", requestController.rejectRequest);
router.get("/submitted", authMiddleware, requestController.getSubmitted);
router.get("/history", authMiddleware, requestController.getHistory);

router.get(
  "/universal-requests",
  authMiddleware,
  requestController.getInstitutionRequests
);
router.post(
  "/:id/request-more-info",
  authMiddleware,
  requestController.requestMoreInfo
);
router.get("/stats", requestController.getRequestStats);

module.exports = router;
