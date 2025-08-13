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
      res.status(201).json({
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
// Get notifications for a specific provider by institutionId
exports.getNotificationsByProvider = (req, res) => {
  const institutionId = req.params.institutionId;

  const query = `
    SELECT * FROM notifications 
    WHERE institution_id = ?
    ORDER BY createdAt DESC
  `;

  db.query(query, [institutionId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

exports.getNotificationsForMyInstitution = (req, res) => {
  const institutionId = req.user?.institution_id;

  if (!institutionId) {
    return res
      .status(401)
      .json({ message: "Unauthorized or no institution found" });
  }

  const sql = `
    SELECT * FROM notifications
    WHERE institution_id = ?
    ORDER BY createdAt DESC
  `;

  db.query(sql, [institutionId], (err, results) => {
    if (err) {
      console.error("Failed to fetch notifications:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

exports.getNotifications = (req, res) => {
  // Basic example: fetch all notifications
  const query = "SELECT * FROM notifications ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};
exports.getRequests = (req, res) => {
  const institutionId = req.user?.institution_id; // from token/session
  if (!institutionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sql = "SELECT * FROM requests WHERE institutionId = ?";
  db.query(sql, [institutionId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
};

exports.getRequestsForInstitution = (req, res) => {
  const institutionId = req.user?.institution_id;

  if (!institutionId)
    return res.status(403).json({ message: "Unauthorized: no institution" });

  const sql = "SELECT * FROM requests WHERE institutionId = ?";
  db.query(sql, [institutionId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
};
