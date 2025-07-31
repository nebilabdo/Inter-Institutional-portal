const express = require("express");
const router = express.Router();
const institutionController = require("../controllers/institutionController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get(
  "/institution/approved",
  institutionController.getApprovedInstitutions
);

router.put(
  "/institution/:id",
  auth,
  role("admin"),
  institutionController.updateInstitutionInfo
);

module.exports = router;
