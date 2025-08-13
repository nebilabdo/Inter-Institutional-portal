const db = require("../config/db");

exports.logActivity = (req, res) => {
  const {
    user_id,
    request_id,
    notification_id,
    provider_id,
    institution_id,
    action,
    details,
    type,
  } = req.body;

  if (!action) {
    return res.status(400).json({ message: "Action is required" });
  }

  const sql = `
    INSERT INTO activity_log
    (user_id, request_id, notification_id, provider_id, institution_id, action, details, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      request_id,
      notification_id,
      provider_id,
      institution_id,
      action,
      details,
      type,
    ],
    (err, result) => {
      if (err) {
        console.error("Error logging activity:", err);
        return res.status(500).json({ message: "Failed to log activity" });
      }
      res
        .status(201)
        .json({ message: "Activity logged", activityId: result.insertId });
    }
  );
};


exports.getActivities = (req, res) => {
  const { user_id, request_id } = req.query;

  let sql = `
    SELECT 
      a.id,
      a.action,
      a.details,
      a.timestamp,
      a.type,
      i.name AS name,
      r.title AS request_title
    FROM activity_log a
    LEFT JOIN requests r ON a.request_id = r.id
    LEFT JOIN institutions i ON a.institution_id = i.id
    WHERE 1=1
  `;

  const params = [];

  if (user_id) {
    sql += " AND a.user_id = ?";
    params.push(user_id);
  }
  if (request_id) {
    sql += " AND a.request_id = ?";
    params.push(request_id);
  }

  sql += " ORDER BY a.timestamp DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching activities:", err);
      return res.status(500).json({ message: "Failed to get activities" });
    }
    res.json(results);
  });
};
