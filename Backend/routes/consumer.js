const express = require("express");
const router = express.Router();
const consumerController = require("../controllers/consumerController");

router.post("/fetch-api-url", consumerController.fetchApiUrl);

module.exports = router;
