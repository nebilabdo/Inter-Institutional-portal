const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

// POST /activity - log new activity
router.post("/", activityController.logActivity);

// GET /activity - get activity logs
router.get("/", activityController.getActivities);

module.exports = router;
