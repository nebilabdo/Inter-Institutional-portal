const db = require("../config/db");

// Submit Request Controller
exports.submitRequest = (req, res) => {
  const userId = req.user?.id; // sender user ID
  const senderInstitutionId = req.user?.institution_id; // sender's institution (for possible audit logging)
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const {
    institutionId, // recipient institution ID
    services,
    title,
    description,
    status = "Submitted",
  } = req.body;

  // Validate recipient institution
  db.query(
    "SELECT * FROM institutions WHERE id = ?",
    [institutionId],
    (instErr, instResult) => {
      if (instErr) {
        console.error(instErr);
        return res.status(500).json({ message: "Database error" });
      }

      if (instResult.length === 0) {
        return res
          .status(404)
          .json({ message: "Recipient institution not found" });
      }

      const institutionName = instResult[0].name;

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
        (reqErr, reqResult) => {
          if (reqErr) {
            console.error(reqErr);
            return res
              .status(500)
              .json({ message: "Failed to submit request" });
          }

          const requestId = reqResult.insertId;
          const notificationMessage = `New request submitted: ${title}`;

          // Notify only recipient institution
          const sqlNotification = `
            INSERT INTO notifications 
              (requestId, institution_id, message, isRead, createdAt)
            VALUES (?, ?, ?, false, NOW())
          `;

          db.query(
            sqlNotification,
            [requestId, institutionId, notificationMessage],
            (notifErr) => {
              if (notifErr) {
                console.error(notifErr);
                return res.status(201).json({
                  message:
                    "Request submitted, but failed to notify recipient institution",
                });
              }

              res.status(201).json({
                message:
                  "Request submitted and recipient institution notified successfully",
              });
            }
          );
        }
      );
    }
  );
};

exports.sendRequest = (req, res) => {
  const fromInstitutionId = req.user.institutionId; // sender
  const { toInstitutionId, subject, description } = req.body;

  const sql = `
    INSERT INTO requests (from_institution_id, to_institution_id, subject, description, status, created_at)
    VALUES (?, ?, ?, ?, 'pending', NOW())
  `;

  db.query(
    sql,
    [fromInstitutionId, toInstitutionId, subject, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Optionally create notification for receiver
      const notifSql = `
      INSERT INTO notifications (institution_id, message, isRead, created_at)
      VALUES (?, ?, 0, NOW())
    `;
      const message = `You have received a new request from institution ${fromInstitutionId}`;
      db.query(notifSql, [toInstitutionId, message], (nErr) => {
        if (nErr) return res.status(500).json({ error: nErr.message });
        res.json({ message: "Request sent successfully" });
      });
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
         n.isRead, r.id as requestId, r.title as requestTitle, p.name as provider
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
      read: !!n.isRead, // now consistent
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

exports.getHistory = (req, res) => {
  const institutionId = req.user?.institution_id;

  if (!institutionId)
    return res.status(403).json({ message: "Unauthorized: no institution" });

  // Fetch all requests for this institution
  const sql = "SELECT * FROM requests WHERE institutionId = ?";

  db.query(sql, [institutionId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
};

exports.getSubmitted = (req, res) => {
  const institutionId = req.user?.institution_id;

  if (!institutionId)
    return res.status(403).json({ message: "Unauthorized: no institution" });

  const sql =
    "SELECT * FROM requests WHERE institutionId = ? AND status = 'Submitted'";
  db.query(sql, [institutionId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
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

exports.getRequestStats = (req, res) => {
  const stats = {
    totalConsumers: 0,
    activeAPIs: 0,
  };

  // Query 1: total unique consumers
  db.query(
    "SELECT COUNT(DISTINCT user_id) AS totalConsumers FROM requests",
    (err, result1) => {
      if (err) {
        console.error("Error getting totalConsumers:", err);
        return res.status(500).json({ message: "Failed to get consumers" });
      }

      stats.totalConsumers = result1[0].totalConsumers;

      // Query 2: active APIs from `services` field
      db.query(`SELECT services FROM requests`, (err, result2) => {
        if (err) {
          console.error("Error getting activeAPIs:", err);
          return res.status(500).json({ message: "Failed to get active APIs" });
        }

        const apiSet = new Set();

        result2.forEach((row) => {
          try {
            const services = JSON.parse(row.services);
            services.flat().forEach((api) => apiSet.add(api));
          } catch (e) {
            console.warn("Failed to parse services:", row.services);
          }
        });

        stats.activeAPIs = apiSet.size;

        // Send the final stats response
        return res.json(stats);
      });
    }
  );
};
exports.requestMoreInfo = (req, res) => {
  const { message } = req.body;
  const requestId = req.params.id;
  const userId = req.user?.id; // logged-in user
  const institutionId = req.user?.institution_id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = `
    INSERT INTO notifications (requestId, message, isRead, institution_id, user_id)
    VALUES (?, ?, 0, ?, ?)
  `;

  db.query(
    query,
    [requestId, message, institutionId, userId],
    (err, results) => {
      if (err) {
        console.error("Error sending notification:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ success: true });
    }
  );
};

exports.getNotifications = (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = `
    SELECT * 
    FROM notifications 
    WHERE user_id = ?
    ORDER BY createdAt DESC
    LIMIT 50
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

exports.getMyRequests = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const sql = "SELECT * FROM requests WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    // Parse services JSON for frontend
    const parsedResults = results.map((r) => ({
      ...r,
      services: r.services, // already an array
      date: r.createdAt,
      lastUpdated: r.updatedAt,
    }));

    res.json(parsedResults);
  });
};
