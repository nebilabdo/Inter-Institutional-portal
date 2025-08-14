const express = require("express");
const router = express.Router();
const upload = require("../Utils/upload");
const submitDocument = require("../controllers/universalController");
const authMiddleware = require("../middlewares/auth");

// File upload middleware
const uploadMiddleware = upload.fields([
  { name: "national_id", maxCount: 1 },
  { name: "supporting_docs", maxCount: 10 },
]);

// Error handling wrapper
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// Add authMiddleware before your controller
// POST /submission
router.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  submitDocument // just pass it directly
);

module.exports = router;
