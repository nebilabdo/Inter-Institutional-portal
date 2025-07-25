const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");

router.post("/get-api-url", providerController.sendApiUrl);

router.get("/real-data/:id", providerController.sendRealData);

module.exports = router;
