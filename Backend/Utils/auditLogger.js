const db = require("../config/db");

const auditLog = (userId, action, details = "") => {
  const query =
    "INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, NOW())";
  db.query(query, [userId, action, details], (err) => {
    if (err) {
      console.error("Failed to write audit log:", err);
    }
  });
};

module.exports = auditLog;
