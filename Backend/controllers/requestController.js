const db = require("../config/db");

exports.submitRequest = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const {
    institutionId,
    institutionName,
    services,
    title,
    description,
    status = "Submitted",
  } = req.body;

  const sqlRequest = `
    INSERT INTO requests 
      (user_id, institutionId, institutionName, services, title, description, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sqlRequest,
    [
      userId,
      institutionId,
      institutionName,
      JSON.stringify(services),
      title,
      description,
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("DB insert error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const requestId = result.insertId;

      // Create notification message using the submitted title
      const notificationMessage = `New request submitted: ${title}`;

      const sqlNotification = `
        INSERT INTO notifications (requestId, message, isRead, createdAt)
        VALUES (?, ?, false, NOW())
      `;

      db.query(
        sqlNotification,
        [requestId, notificationMessage],
        (notifErr) => {
          if (notifErr) {
            console.error("Notification insert error:", notifErr);
            return res
              .status(201)
              .json({ message: "Request submitted, but notification failed" });
          }
          res.status(201).json({
            message: "Request and notification submitted successfully",
          });
        }
      );
    }
  );
};

exports.getInstitutions = (req, res) => {
  db.query("SELECT * FROM institutions", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST stop conversation
exports.stopConversation = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE requests SET conversationActive = FALSE WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Conversation stopped." });
    }
  );
};

exports.getAllRequests = (req, res) => {
  const sql = `SELECT * FROM requests ORDER BY createdAt DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch requests:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const formatted = results.map((row) => {
      let parsedServices = [];

      try {
        parsedServices = JSON.parse(row.services || "[]");
        if (!Array.isArray(parsedServices)) {
          parsedServices = [parsedServices]; // force into array
        }
      } catch (e) {
        console.warn("Invalid JSON in services field:", row.services);
        parsedServices = row.services ? [row.services] : [];
      }

      return {
        ...row,
        services: parsedServices,
        date: row.createdAt,
        lastUpdated: row.updatedAt,
      };
    });

    res.json(formatted);
  });
};

// controllers/notifications.js
exports.getNotifications = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT n.id, n.title, n.message, n.type, n.createdAt as timestamp, 
           n.read, r.id as requestId, r.title as requestTitle, p.name as provider
    FROM notifications n
    JOIN requests r ON n.requestId = r.id
    JOIN providers p ON r.providerId = p.id
    WHERE n.userId = ?
    ORDER BY n.createdAt DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch notifications:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const formatted = results.map((n) => ({
      id: n.id,
      title: n.title || `Update for: ${n.requestTitle}`,
      message:
        n.message ||
        `You have an update for "${n.requestTitle}" from ${n.provider}.`,
      type: n.type || "info",
      timestamp: n.timestamp,
      read: !!n.read,
      requestId: n.requestId,
      provider: n.provider,
    }));

    res.json(formatted);
  });
};

// POST resume conversation
exports.resumeConversation = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE requests SET conversationActive = TRUE WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Conversation resumed." });
    }
  );
};

// POST save admin note
exports.saveAdminNote = (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  db.query(
    "UPDATE requests SET adminNote = ? WHERE id = ?",
    [note, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Admin note saved." });
    }
  );
};

exports.approveRequest = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE requests SET status = ?, decisionDate = ? WHERE id = ?",
    ["approved", new Date(), id],
    (error, result) => {
      if (error) {
        console.error("Error approving request:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.json({ message: "Request approved successfully" });
    }
  );
};

exports.rejectRequest = (req, res) => {
  const { id } = req.params;
  const query =
    "UPDATE requests SET status = ?, decisionDate = ?, reason = ? WHERE id = ?";
  const values = ["rejected", new Date(), "Manually rejected by provider", id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error rejecting request:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request rejected successfully" });
  });
};

// Get all approved or rejected (history)
exports.getHistory = (req, res) => {
  const query =
    "SELECT * FROM requests WHERE status IN (?, ?) ORDER BY decisionDate DESC";
  db.query(query, ["approved", "rejected"], (err, results) => {
    if (err) {
      console.error("Error fetching history:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

exports.getSubmitted = (req, res) => {
  const query = "SELECT * FROM requests WHERE status = ?";
  db.query(query, ["submitted"], (err, results) => {
    if (err) {
      console.error("Error fetching pending requests:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

exports.requestMoreInfo = (req, res) => {
  const requestId = req.params.id;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Message is required." });
  }

  const getRequesterQuery =
    "SELECT user_id AS requester_id FROM requests WHERE id = ?";
  db.query(getRequesterQuery, [requestId], (err, result) => {
    if (err || result.length === 0) {
      console.error("Error finding requester:", err);
      return res.status(404).json({ message: "Request not found." });
    }

    const requesterId = result[0].requester_id;

    const insertNotificationQuery = `
  INSERT INTO notifications (user_id, requestId, message)
  VALUES (?, ?, ?)
`;

    db.query(
      insertNotificationQuery,
      [requesterId, requestId, message],
      (insertErr) => {
        if (insertErr) {
          console.error("Error saving notification:", insertErr);
          return res
            .status(500)
            .json({ message: "Failed to send info request." });
        }
        res.status(200).json({ message: "Info request sent successfully." });
      }
    );
  });
};
