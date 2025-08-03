const db = require("../config/db");

// Get all providers
exports.getAllProviders = (req, res) => {
  db.query("SELECT * FROM provider", (err, results) => {
    if (err) {
      console.error("Error fetching providers:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

// Get provider by id
exports.getProviderById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM provider WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching provider:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0)
      return res.status(404).json({ message: "Provider not found" });
    res.json(results[0]);
  });
};

// Create provider
exports.createProvider = (req, res) => {
  const { institution_id, institution_name, email, phone, address, status } =
    req.body;
  const query = `INSERT INTO provider (institution_id, institution_name, email, phone, address, status) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      institution_id,
      institution_name,
      email,
      phone,
      address,
      status || "active",
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating provider:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res
        .status(201)
        .json({
          id: result.insertId,
          message: "Provider created successfully",
        });
    }
  );
};

// Update provider
exports.updateProvider = (req, res) => {
  const { id } = req.params;
  const { institution_id, institution_name, email, phone, address, status } =
    req.body;
  const query = `UPDATE provider SET institution_id=?, institution_name=?, email=?, phone=?, address=?, status=? WHERE id=?`;

  db.query(
    query,
    [institution_id, institution_name, email, phone, address, status, id],
    (err, result) => {
      if (err) {
        console.error("Error updating provider:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Provider not found" });
      res.json({ message: "Provider updated successfully" });
    }
  );
};

// Delete provider
exports.deleteProvider = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM provider WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting provider:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Provider deleted successfully" });
  });
};
