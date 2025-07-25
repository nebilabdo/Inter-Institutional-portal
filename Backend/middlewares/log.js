// middlewares/log.js
const db = require("../config/db");

module.exports = (req, res, next) => {
  const start = Date.now();

  const { method, originalUrl } = req;
  const userId = req.user ? req.user.id : null;
  const userRole = req.user ? req.user.role : null;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logEntry = {
      method,
      url: originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      user_id: userId,
      user_role: userRole,
      timestamp: new Date(),
    };

    console.log(
      `[${logEntry.timestamp.toISOString()}] ${method} ${originalUrl} - ${
        res.statusCode
      } - ${duration}ms - User: ${userId || "Guest"} (${userRole || "N/A"})`
    );

    const institutionId = req.user ? req.user.institution_id : null;

    const query = `INSERT INTO api_requests
  (method, url, http_status, duration_ms, user_id, user_role, institution_id, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      logEntry.method,
      logEntry.url,
      logEntry.status,
      logEntry.duration_ms,
      logEntry.user_id,
      logEntry.user_role,
      institutionId,
      logEntry.timestamp,
    ];

    db.query(query, values, (err) => {
      if (err) {
        console.error("Failed to log API request:", err);
      }
    });
  });
  next();
};
