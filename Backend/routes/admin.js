const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const adminController = require("../controllers/adminController");

router.use(auth, role("admin"));

// Add a simple test route at GET /
router.get("/", (req, res) => {
  res.json({
    message: "Admin route accessed",
    user: req.user,
  });
});

router.post("/institutions", adminController.createInstitution);
router.post("/users/register", adminController.registerInstitutionUser);
router.put("/institutions/:id/approve", adminController.approveInstitution);
router.delete("/institutions/:id", adminController.deleteInstitution);
router.get("/institutions", adminController.getAllInstitutions);
router.get("/user-stats", adminController.getUserStats);

module.exports = router;
