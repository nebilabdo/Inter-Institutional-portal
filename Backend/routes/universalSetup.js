// routes/universalSetup.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");

router.post("/register-universal", async (req, res) => {
  try {
    const { email, password, institution_id } = req.body;

    const hashedPassword = bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (institution_id, email, password_hash, role)
      VALUES (?, ?, ?, 'universal')
    `;

    db.query(
      query,
      [institution_id || null, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error creating universal user" });
        }
        res.json({ success: true, userId: results.insertId });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unexpected error" });
  }
});

module.exports = router;
