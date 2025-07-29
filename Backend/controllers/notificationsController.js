const db = require("../config/db");

exports.getNotificationsByRequestId = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM notifications WHERE requestId = ? AND isRead = FALSE ORDER BY createdAt DESC",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

exports.getAllNotifications = (req, res) => {
  db.query(
    "SELECT * FROM notifications ORDER BY createdAt DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

exports.getUnreadNotifications = (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE isRead = FALSE ORDER BY createdAt DESC",
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
  console.log("📩 Received mark-as-read for ID:", req.params.notificationId);

  const { notificationId } = req.params;

  db.query(
    "UPDATE notifications SET isRead = TRUE WHERE id = ?",
    [notificationId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Notification not found." });
      }

      res.json({ message: "Notification marked as read." });
    }
  );
};

exports.deleteNotification = (req, res) => {
  const { notificationId } = req.params;

  db.query(
    "DELETE FROM notifications WHERE id = ?",
    [notificationId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Notification not found." });
      }

      res.json({ message: "Notification deleted." });
    }
  );
};
