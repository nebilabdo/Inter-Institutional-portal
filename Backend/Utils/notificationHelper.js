const db = require("../config/db");

const createNotification = (userId, message) => {
  const query =
    "INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())";
  db.query(query, [userId, message], (err) => {
    if (err) {
      console.error("Failed to create notification:", err);
    }
  });
};

module.exports = createNotification;
