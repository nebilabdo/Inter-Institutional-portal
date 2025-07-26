const db = require("../config/db");

exports.getNotificationsByRequestId = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM notifications WHERE requestId = ? ORDER BY createdAt DESC",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

exports.addNotification = (req, res) => {
  const { id } = req.params; // requestId
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  db.query(
    "INSERT INTO notifications (requestId, message) VALUES (?, ?)",
    [id, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: "Notification added.",
        notificationId: result.insertId,
      });
    }
  );
};

exports.markAsRead = (req, res) => {
  const { notificationId } = req.params;

  db.query(
    "UPDATE notifications SET isRead = TRUE WHERE id = ?",
    [notificationId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Notification marked as read." });
    }
  );
};
