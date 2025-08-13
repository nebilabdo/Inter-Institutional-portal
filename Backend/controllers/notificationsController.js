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
  const notificationId = parseInt(req.params.notificationId, 10);
  if (isNaN(notificationId)) {
    return res.status(400).json({ error: "Invalid notification ID." });
  }

  console.log("Received mark-as-read for ID:", notificationId);

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
  const notificationId = parseInt(req.params.notificationId, 10);
  if (isNaN(notificationId)) {
    return res.status(400).json({ error: "Invalid notification ID." });
  }

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

exports.markAllAsRead = (req, res) => {
  const institutionId = req.user.institutionId;

  const query = `UPDATE notifications SET isRead = 1 WHERE institution_id = ? AND isRead = 0`;

  db.query(query, [institutionId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: `Marked ${result.affectedRows} notifications as read.`,
    });
  });
};
// exports.getNotifications = (req, res) => {
//   // Basic example: fetch all notifications
//   const query = "SELECT * FROM notifications ORDER BY created_at DESC";

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching notifications:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     res.json(results);
//   });
// };
