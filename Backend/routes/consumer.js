const express = require("express");
const router = express.Router();
const consumerController = require("../controllers/consumerController");

const authMiddleware = require("../middlewares/auth");

router.post("/fetch-api-url", consumerController.fetchApiUrl);

router.put("/profile", authMiddleware, consumerController.updateProfile);

module.exports = router;
